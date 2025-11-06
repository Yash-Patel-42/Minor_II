import compression from "compression";
import cors from "cors";
import express, { Application } from "express";

import agentRouter from "./routes/agent.routes";

export const app: Application = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());
app.use(compression());

app.use("/api/v1/agent", agentRouter);
