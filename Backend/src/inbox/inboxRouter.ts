import { verifyUser } from './../middlewares/authMiddleware';
import express from "express"
import { handleUserInvite, fetchInbox, handleAcceptInvite, handleDeclineInvite } from "./inboxController"

const inboxRouter = express.Router()

inboxRouter.post("/workspace/:workspaceId/invite/user", verifyUser, handleUserInvite)
inboxRouter.get("/inbox/user/invite", verifyUser, fetchInbox)
inboxRouter.post("/inbox/user/invite/accept", verifyUser, handleAcceptInvite)
inboxRouter.post("/inbox/user/invite/decline", verifyUser, handleDeclineInvite)

export default inboxRouter