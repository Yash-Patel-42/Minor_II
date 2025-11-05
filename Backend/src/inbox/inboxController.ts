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

//Handle Invite user to workspace, send invite to user inbox
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
          receivers: [newMember._id],
          payload: {
            role: newMemberRole,
            workspaceId: workspaceId,
            workspaceName: workspace.workspaceName,
            workspaceDescription: workspace.workspaceDescription,
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

//Fetch all notifications/invites from inbox
const fetchInbox = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.user._id;
    if (!userID) return next(createHttpError(404, "No user ID found. Try logging in again."));

    const inbox = await Inbox.find({ receivers: { $in: [req.user._id] } })
      .populate("sender", "email name")
      .sort({ createdAt: -1 });

    if (!inbox) return next(createHttpError(404, "Inbox is empty!"));
    res.status(200).json({ inbox: inbox });
  } catch (error) {
    next(createHttpError(500, `Error fetching inbox: ${error}`));
  }
};

//Handle user accepting invite for a workspace
const handleAcceptInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get data from request
    const { invite } = req.body;

    // console.log("Invite: ", invite);
    if (invite.receivers.length === 0) return next(createHttpError(404, "User Not Found"));

    // //Add Member to workspace
    const member = await Member.create({
      userID: invite.receivers[0],
      role: invite.payload.role,
      invitedBy: invite.sender._id,
      workspaceID: invite.payload.workspaceId,
      status: "active",
      acceptedAt: new Date(),
    });

    //Update reference in workspace model for the new created member
    await Workspace.findByIdAndUpdate(
      { _id: invite.payload.workspaceId },
      { $addToSet: { members: member._id } }
    );

    //Update the reference in Inbox model for the accepted response
    await Inbox.findByIdAndUpdate({ _id: invite._id }, { response: "accepted", isRead: true });

    // //Send Response
    res.status(201).json({ message: "Done Member Added." });
  } catch (error) {
    next(createHttpError(500, `Error Accepting invite: ${error}`));
  }
};

//Handle user declining invite for a workspace
const handleDeclineInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invite } = req.body;
    await Inbox.findByIdAndUpdate({ _id: invite._id }, { response: "declined", isRead: true });
    res.status(201).json({ message: "Ok, Declined" });
  } catch (error) {
    next(createHttpError(500, `Error Declining invite: ${error}`));
  }
};

export { handleUserInvite, fetchInbox, handleAcceptInvite, handleDeclineInvite };
