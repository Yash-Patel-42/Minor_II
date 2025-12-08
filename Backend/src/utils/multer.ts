import fs from "fs";
import multer from "multer";
import path from "path";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

export const uploadVideo = multer({
  dest: uploadsDir,
  fileFilter: (req, file, cb) => {
    if (/^video\/(mp4|quicktime|x-msvideo|x-matroska|webm)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type."));
  },
  limits: { fileSize: 1024 * 1024 * 512 }, // 512MB
});
