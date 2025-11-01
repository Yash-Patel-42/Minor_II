import { Router } from "express";

import {
  agentHandler,
  generateDescriptionHandler,
  generateTagsHandler,
//   generateImageHandler,
  generateTitleHandler,
} from "@/controllers/agent.cotroller";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/generate", agentHandler);
router.post("/generatetitle", generateTitleHandler);
router.post("/generate-description", generateDescriptionHandler);
router.post("/generate-tags", generateTagsHandler);

// router.post("/generate-image", generateImageHandler);
export default router;
