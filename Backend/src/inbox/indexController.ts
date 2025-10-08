import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../user/userModel";
import { Workspace } from "../workspace/workspaceModel";
import { IWorkspace } from "../workspace/workspaceTypes";
import { Member } from "../workspace/workspaceMemberModel";
import { envConfig } from "../config/config";
import { Inbox } from "./inboxModel";

const handleUserInvite = async (req: Request, res: Response, next: NextFunction) => {
  //Create a session for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  //Get data from params, body and request
  const workspaceId = req.params.workspaceId;
  const { newMemberEmail, newMemberRole } = req.body;

  //Validate incoming data
  if (!workspaceId || !newMemberEmail || !newMemberRole) {
    await session.abortTransaction();
    session.endSession();
    return next(createHttpError(404, "No workspaceID or email or role received, Invalid request."));
  }

  //Check if newMemberEmail exist in system
  const newMember = await User.findOne({ email: newMemberEmail });
  if (!newMember) {
    await session.abortTransaction();
    session.endSession();
    return next(createHttpError(404, "No such user exist in database."));
  }

  //Check if workspace exist
  const workspace = (await Workspace.findById({ _id: workspaceId })) as IWorkspace;
  if (!workspace) {
    await session.abortTransaction();
    session.endSession();
    return next(createHttpError(404, "Workspace not found."));
  }

  //Check if already a member
  const existingMember = await Member.findOne({
    userID: newMember._id,
    workspaceId: workspace._id,
  }).session(session);
  if (existingMember) {
    await session.abortTransaction();
    session.endSession();
    return next(
      createHttpError(400, "User is already a member of this workspace or Already invited.")
    );
  }

  //Create invite token
  const inviteToken = jwt.sign(
    {
      workspaceID: workspace._id.toString(),
      userID: newMember._id.toString(),
      invitedBy: req.user._id,
    },
    envConfig.inviteTokenSecret as string,
    { expiresIn: "1d" }
  );
  console.log(inviteToken);

  //Send notification/invite to member
  if (newMember) {
    await Inbox.create(
      [
        {
          sender: req.user._id,
          type: "workspace-invite",
          receiver: newMember._id,
          payload: {
            role: newMemberRole,
            workspaceId: workspaceId,
            receiverEmail: newMember.email,
          },
          isRead: false,
        },
      ],
      { session }
    );
  }

  //End Session
  await session.commitTransaction();
  session.endSession();

  //Response
  res.status(201).json({ sentToEmail: newMember.email, message: "Invite sent" });
};

//Fetch data from Inbox
const fetchInbox = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user._id;
  if (!userID) return next(createHttpError(404, "No user ID found. Try logging in again."));

  const inbox = await Inbox.findById({ receiver: userID }).populate("sender", "email name");

  if (!inbox) return next(createHttpError(404, "No inbox found in the database."));

  res.status(200).json({ inbox: inbox });
};
export { handleUserInvite, fetchInbox };
