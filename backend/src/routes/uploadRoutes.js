const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Configure Multer memory storage (we will process the buffer using Sharp)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed!"));
  },
});

// Configure R2 Client if environment variables are set
const isR2Configured = !!(
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME &&
  process.env.R2_ENDPOINT
);

let s3Client = null;
if (isR2Configured) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  console.log("☁️ [UPLOAD]: Cloudflare R2 storage initialized.");
} else {
  console.log("📁 [UPLOAD]: Cloudflare R2 not configured. Using local filesystem uploads.");
}

router.post("/", authenticateJWT, isAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // 1. Process and optimize with Sharp
    const filename = `${uuidv4()}.webp`;
    
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Determine upload destination
    if (isR2Configured && s3Client) {
      // Stream to Cloudflare R2
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: optimizedBuffer,
        ContentType: "image/webp",
      });

      await s3Client.send(command);

      // Return public R2 URL
      const publicUrl = `${process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${filename}`;
      return res.status(200).json({
        message: "Image uploaded successfully to Cloudflare R2.",
        url: publicUrl,
      });
    } else {
      // Local storage fallback
      const uploadDir = path.join(__dirname, "../../public/uploads");
      
      // Ensure local uploads directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, optimizedBuffer);

      // Return local URL path
      // Note: Make sure backend/public/uploads is served statically in app.js
      const localUrl = `/uploads/${filename}`;
      return res.status(200).json({
        message: "Image uploaded successfully to local storage.",
        url: localUrl,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
