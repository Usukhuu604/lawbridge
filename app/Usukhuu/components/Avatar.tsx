"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

type AvatarProps = {
  src?: string | null;
};

const Avatar = ({ src }: AvatarProps) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUploadedUrl(data.url);
    } catch (err) {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
        Зураг оруулах
      </label>
      <Input id="profileImage" type="file" accept="image/*" onChange={handleFileChange} />
      {isUploading && <div className="text-sm text-blue-500 mt-2">Uploading...</div>}
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      {uploadedUrl && <img src={uploadedUrl} alt="preview" className="mt-2 w-32 h-32 rounded-md object-cover" />}
      {src ? (
        <img src={src} alt="preview" className="mt-2 w-32 h-32 rounded-md object-cover" />
      ) : (
        <div className="mt-2 w-32 h-32 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}
    </div>
  );
};

export default Avatar;
