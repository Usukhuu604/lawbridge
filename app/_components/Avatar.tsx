"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";

const Avatar = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  return (
    <div>
      <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
        Зураг оруулах
      </label>
      <Input id="profileImage" type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 w-32 h-32 rounded-md object-cover" />}
    </div>
  );
};

export default Avatar;
