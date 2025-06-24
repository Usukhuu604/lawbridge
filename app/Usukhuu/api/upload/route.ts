const dotenv = require("dotenv");
import fs from "fs";
const AWS = require("aws-sdk");
dotenv.config();

const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: "auto",
  signatureVersion: "v4",
});

module.exports = {
  uploadToR2: async (filePath, fileName) => {
    const fileStats = fs.statSync(filePath);

    if (fileStats.size > 5242880) {
      // >5MB, use putObject and return a promise
      const file = fs.readFileSync(filePath);
      const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file,
      };
      return await s3.putObject(params).promise();
    } else {
      // <=5MB, use upload and return a promise
      const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: fs.createReadStream(filePath),
      };
      return await s3.upload(params).promise();
    }
  },
};
