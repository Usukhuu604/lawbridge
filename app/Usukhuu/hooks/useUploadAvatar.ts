"use client";

import { useState, useRef } from "react";

export const useUploadAvatar = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewLink, setPreviewLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const openBrowse = () => fileInputRef.current?.click();

  const uploadToServer = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/Usukhuu/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const imageUrl = data.url;
      onUpload(imageUrl);
      setPreviewLink(imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadToServer(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) uploadToServer(file);
  };

  const deleteImage = async () => {
    if (previewLink) {
      try {
        await fetch("/Usukhuu/api/delete", {
          method: "POST",
          body: JSON.stringify({ url: previewLink }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Failed to delete image from bucket", err);
      }
    }

    setPreviewLink("");
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    previewLink,
    uploading,
    isDragging,
    openBrowse,
    handleFileSelect,
    handleDrop,
    deleteImage,
    setIsDragging,
  };
};
