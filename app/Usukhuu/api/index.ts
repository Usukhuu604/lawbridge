const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadToR2 } = require("./uploadService");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Uploading file:", req.file.path, req.file.filename);
    await uploadToR2(req.file.path, req.file.filename);
    console.log("Upload to R2 successful");

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${req.file.filename}`;
    res.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Error processing file: " + err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
