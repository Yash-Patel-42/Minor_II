import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { Video } from "./videoModel";

const handleVideoUploadToWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) return next(createHttpError(404, "No file found to upload"));

    const workspaceId = req.workspace._id;
    const userId = req.user._id;
    if (!workspaceId || !userId) return next(createHttpError(404, "No workspace or user found"));

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: `workspace_${workspaceId}/videos`,
      public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
      chunk_size: 6000000,
    });

    fs.unlink(file.path, (error) => {
      if (error) console.warn("Failed to delete temp file:", error);
    });

    const videoUrl = result.secure_url;
    const thumbnailUrl = cloudinary.url(result.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [{ width: 640, height: 360, crop: "fill" }],
    });

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      url: videoUrl,
      thumbnail: thumbnailUrl,
      uploaderID: userId,
      workspaceID: workspaceId,
    });

    res
      .status(201)
      .json({ message: "Video uploaded successfully & pending for review", video: video });
  } catch (error) {
    next(createHttpError(500, `Error uploading video: ${error}`));
  }
};

export { handleVideoUploadToWorkspace };
