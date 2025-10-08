import { verifyUser } from './../middlewares/authMiddleware';
import express from "express"
import { handleUserInvite, fetchInbox } from "./indexController"

const inboxRouter = express.Router()

inboxRouter.post("/workspace/:workspaceId/invite/user", verifyUser, handleUserInvite)
inboxRouter.get("/inbox/user/invite", verifyUser, fetchInbox)

export default inboxRouter