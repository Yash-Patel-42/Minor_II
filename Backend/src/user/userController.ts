import { CookieOptions, NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { envConfig } from "../config/config";
import { IDecodedUser, IUser } from "./userTypes";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { User } from "./userModel";

// options for cookies
const options: CookieOptions = {
  httpOnly: true,
  secure: envConfig.environment === "production",
  sameSite: envConfig.environment === "production" ? "none" : "lax",
};

//Register Handler
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    let newUser: IUser;
    //Validation
    if (!name || !email || !password) {
      return next(createHttpError(400, "All fields are required."));
    }
    // Database Checking Calls
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        return next(createHttpError(409, "User already exist with this email."));
      }
    } catch (error) {
      return next(createHttpError(500, `Error while getting user: ${error}`));
    }
    //Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    //Database Save User
    try {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      return next(createHttpError(500, `Error Creating User: ${error}`));
    }
    //Token Generation
    try {
      const accessToken = sign(
        { _id: newUser._id, email: newUser.email },
        envConfig.accessTokenSecret as string,
        {
          expiresIn: "1d",
          algorithm: "HS256",
        }
      );
      const refreshToken = sign(
        { _id: newUser._id, email: newUser.email },
        envConfig.refreshTokenSecret as string,
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );
      newUser.refreshToken = refreshToken;
      await newUser.save({ validateBeforeSave: false });
      //Response
      res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
          },
        });
    } catch (error) {
      return next(createHttpError(500, `Error Creating accessToken or refreshToken : ${error}`));
    }
  } catch (error) {
    next(createHttpError(500, `Error Creating the user. ${error}`));
  }
};

//Login Handler
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    let user;
    //Validation
    if (!email || !password) {
      return next(createHttpError(400, "All fields are required."));
    }
    //Database Calls
    try {
      user = (await User.findOne({ email })) as IUser;
      if (!user) {
        return next(createHttpError(404, "User not found."));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(createHttpError(401, "Username or password incorrect."));
      }
    } catch (error) {
      return next(createHttpError(500, `Error fetching user data: ${error}`));
    }
    //Token Generation
    try {
      const accessToken = sign(
        { _id: user._id, email: user.email },
        envConfig.accessTokenSecret as string,
        {
          expiresIn: "1d",
          algorithm: "HS256",
        }
      );
      const refreshToken = sign(
        { _id: user._id, email: user.email },
        envConfig.refreshTokenSecret as string,
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );
      //Update DB with Refresh Token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      //Response
      res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    } catch (error) {
      return next(createHttpError(500, `Error generating accessToken or refreshToken : ${error}`));
    }
  } catch (error) {
    next(createHttpError(500, `Error logging you in. ${error}`));
  }
};

//Logout Handler
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get Cookies
    const cookies = req.cookies;
    //Check Cookies
    if (!cookies?.refreshToken) {
      return next(createHttpError(400, "Invalid or none cookies received"));
    }
    const refreshToken = cookies.refreshToken;
    let user;
    try {
      user = await User.findOne({ refreshToken });
    } catch (error) {
      return next(createHttpError(500, `Error fetching user: ${error}`));
    }
    //Clear Cookies even if user is not there
    if (!user) {
      res.clearCookie("accessToken", options);
      res.clearCookie("accessToken", options);
      return res.status(204).json({ message: "User logged out." });
    }
    //Update DB
    try {
      user.refreshToken = "";
      await user.save();
    } catch (error) {
      return next(createHttpError(500, `Error clearing refresh token: ${error}`));
    }
    // Clear Cookies
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    // Response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(createHttpError(500, `Unexpected error during logout: ${error}`));
  }
};

//Refresh Access Token Handler
const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get Refresh Token
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    //Validate Refresh Token
    if (!incomingRefreshToken) {
      return next(createHttpError(401, "No refresh token received"));
    }
    //Decode Token
    let decodedToken: IDecodedUser;
    try {
      decodedToken = verify(
        incomingRefreshToken,
        envConfig.refreshTokenSecret as string
      ) as IDecodedUser;
    } catch (error) {
      return next(createHttpError(500, `Error decoding the incoming refresh token: ${error}`));
    }
    //DB Calls to Validate User
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      return next(createHttpError(500, "No user found for this refresh token."));
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      return next(createHttpError(400, "Refresh token expired or used or invalid."));
    }
    //Generate New Access Token and Refresh Token
    const accessToken = sign(
      { _id: user._id, email: user.email },
      envConfig.accessTokenSecret as string,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      }
    );
    const refreshToken = sign(
      { _id: user._id, email: user.email },
      envConfig.refreshTokenSecret as string,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );
    //Update DB with Refresh Token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // Response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: { _id: user._id, name: user.name, email: user.email },
      });
  } catch (error) {
    return next(createHttpError(500, `Unexpected error during token refresh: ${error}`));
  }
};

//Google Auth
const oAuth2Client = new OAuth2Client({
  clientId: envConfig.googleClientId,
  clientSecret: envConfig.googleClientSecret,
  redirectUri: envConfig.googleLoginRedirectUri,
});

//Frontend will make request on this route.
const googleLoginInitiator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const redirectURL = oAuth2Client.generateAuthUrl({
      assess_type: "offline",
      prompt: "consent",
      scope: ["openid", "profile", "email"],
    });
    if (!redirectURL) return next(createHttpError(500, "Error generating google redirectURL"));
    // we will redirect to this generated route.
    console.log("redirect : ", redirectURL)
    res.redirect(redirectURL);
  } catch (error) {
    next(createHttpError(500, `Error while google login: ${error}`));
  }
};

//Google will provide a callback on the generated route, so we can listen that here.
const googleLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get Code and Validate
    const code = req.query.code as string;
    if (!code) {
      throw createHttpError(500, "No code, Invalid google code");
    }

    // 2. Get Tokens from Google
    const { tokens } = await oAuth2Client.getToken(code);
    if (!tokens) {
      throw createHttpError(500, "No tokens, Invalid google tokens");
    }
    oAuth2Client.setCredentials(tokens);

    // 3. Verify the ID Token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: envConfig.googleClientId,
    });
    if (!ticket) {
      throw createHttpError(500, "No ticket, Invalid google ticket");
    }

    // 4. Get User Payload
    const payload = ticket.getPayload();
    if (!payload) {
      throw createHttpError(500, "No payload, Invalid google token");
    }
    const { email, name, sub: googleAccountID, picture } = payload;

    // 5. Find or Create User
    let user = await User.findOne({ email });

    // Handle existing user without Google login
    if (user && !user.googleAccountID) {
      return res.status(409).json({
        message:
          "User already exists with this email but without a Google login. Try manual login.",
      });
    }

    // Create a new user if one doesn't exist
    if (!user) {
      user = await User.create({
        email,
        name,
        googleAccountID,
        avatar: picture,
      });
    }

    // A final safety check to ensure user is not null
    if (!user) {
      throw createHttpError(500, "User object could not be found or created.");
    }

    // Generate and Save refreshTokens and accessTokens
    const accessToken = sign(
      { _id: user._id, email: user.email },
      envConfig.accessTokenSecret as string,
      { expiresIn: "1d", algorithm: "HS256" }
    );
    const refreshToken = sign(
      { _id: user._id, email: user.email },
      envConfig.refreshTokenSecret as string,
      { expiresIn: "7d", algorithm: "HS256" }
    );
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 7. Send Response and Redirect
    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect("http://localhost:5173/home");
  } catch (error) {
    next(createHttpError(500, `An error occurred during Google authentication: ${error}`));
  }
};

//Home Page for user
const userHome = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.user as IUser;
  if (!name && !email) {
    return next(createHttpError(404, "No such user exist try login again."));
  }
  res.status(200).json({ name: name, email: email });
};
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userHome,
  googleLoginInitiator,
  googleLoginCallback,
};
