import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import requireAdmin from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error("Only JPG, PNG or WEBP images are allowed"));
  },
});

// POST /api/upload  -> admin only
router.post("/", requireAdmin, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5 MB"
          : err.message;
      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image was sent" });
    }

    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "crochet-tales" }, (error, uploaded) => {
            if (error) reject(error);
            else resolve(uploaded);
          })
          .end(req.file.buffer);
      });

      res.json({ url: result.secure_url });
    } catch (error) {
      console.error("UPLOAD ERROR:", error.message);
      res.status(500).json({ message: "Image upload failed" });
    }
  });
});

export default router;