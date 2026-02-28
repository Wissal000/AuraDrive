// server/middlewares/upload.js
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // keep file in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});
