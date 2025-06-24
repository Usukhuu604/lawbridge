"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUploadAvatar } from "../hooks/useUploadAvatar";
import { ZodErrors } from "./ZodError";
import type { FieldErrors } from "react-hook-form";
import type { FormData } from "@/app/Usukhuu/page";

type Props = {
  errors: FieldErrors<FormData>;
};

const Avatar = ({ errors }: Props) => {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const {
    fileInputRef,
    previewLink,
    uploading,
    isDragging,
    openBrowse,
    handleFileSelect,
    handleDrop,
    deleteImage,
    setIsDragging,
  } = useUploadAvatar({ onUpload: setUploadedUrl });

  return (
    <div>
      <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
        Нүүр зураг оруулах
      </label>
      <Input
        id="profileImage"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div
        className={`flex items-center justify-center bg-gray-100 w-full h-32 rounded-md border-dashed border-2 mb-2 cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
        }`}
        onClick={openBrowse}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {previewLink || uploadedUrl ? (
          <img src={previewLink || uploadedUrl} alt="preview" className="w-32 h-32 rounded-md object-cover" />
        ) : (
          <span className="text-gray-500">Click or drag an image here</span>
        )}
      </div>
      <ZodErrors error={errors.avatar?.message ? [errors.avatar.message] : undefined} />

      {(previewLink || uploadedUrl) && (
        <button
          type="button"
          onClick={deleteImage}
          className="mt-2 text-xs text-red-500 hover:underline cursor-pointer"
        >
          Remove image
        </button>
      )}
      {uploading && <div className="text-sm text-blue-500 mt-2">Uploading...</div>}
    </div>
  );
};

export default Avatar;
