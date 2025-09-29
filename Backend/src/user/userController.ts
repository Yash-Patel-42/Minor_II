import { NextFunction, Request, Response } from "express";
import userModel from "./userModel";
import { sign, verify } from "jsonwebtoken";
import { envConfig } from "../config/config";
import { decodedUser, newUser, User } from "./userTypes";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

// options for cookies
const options = {
  httpOnly: true,
  secure: envConfig.environment === "production",
};

//Register Handler
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  let newUser: newUser;
  //Validation
  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required."));
  }
  // Database Checking Calls
  try {
    const user = await userModel.findOne({ email: email });
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
    newUser = await userModel.create({
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
      .json({ user: { _id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    return next(createHttpError(500, `Error Creating accessToken: ${error}`));
  }
};

//Login Handler
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user;
  //Validation
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required."));
  }
  //Database Calls
  try {
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Username or password incorrect."));
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
      .json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return next(createHttpError(500, `Error generating access token: ${error}`));
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
      user = await userModel.findOne({ refreshToken });
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
    let decodedToken: decodedUser;
    try {
      decodedToken = verify(
        incomingRefreshToken,
        envConfig.refreshTokenSecret as string
      ) as decodedUser;
    } catch (error) {
      return next(createHttpError(500, `Error decoding the incoming refresh token: ${error}`));
    }
    //DB Calls to Validate User
    const user = await userModel.findById(decodedToken?._id).select("-password");
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
    // console.log("Done:Access = ", accessToken, "Done:Refresh = ", refreshToken);
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
  redirectUri: envConfig.googleRedirectUri,
});
//Frontend will make request on this route.
const googleLoginInitiator = (req: Request, res: Response, next: NextFunction) => {
  const redirectURL = oAuth2Client.generateAuthUrl({
    assess_type: "offline",
    prompt: "consent",
    scope: ["openid", "profile", "email"],
  });
  if (!redirectURL) return next(createHttpError(500, "Error generating redirectURL"));
  // we will redirect to this generated route.
  res.redirect(redirectURL);
};
//Google will provide a callback on the generated route, so we can listen that here.
const googleLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
  const code = req.query.code as string;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const ticket = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: envConfig.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload) return next(createHttpError(500, "No payload, Invalid google token"));
  const { email, name, sub: googleId, picture } = payload;

  let user = await userModel.findOne({ email });
  if (!user) {
    user = await userModel.create({
      email,
      name,
      googleId,
      avatar: picture,
    });
  }
  console.log("Code: ", code);
  console.log("Token: ", tokens);
  console.log("Ticket: ", ticket);
  console.log("Payload: ", payload);
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
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("http://localhost:5173/home");
};

//Home Page for user
const userHome = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.user as User;
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
