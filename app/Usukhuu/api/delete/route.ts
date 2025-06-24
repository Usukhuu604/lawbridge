import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  // Extract the key from the URL
  const bucketName = process.env.R2_BUCKET_NAME!;
  const key = url.split(`/${bucketName}/`)[1];
  if (!key) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
