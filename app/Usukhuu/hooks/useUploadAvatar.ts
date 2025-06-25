"use client";

import { useState, useRef, useEffect } from "react";

const LOCALSTORAGE_KEY = "avatar_image_key";
const LOCALSTORAGE_EXP = "avatar_image_key_exp";
const CACHE_MINUTES = 30;

export const useUploadAvatar = ({ onUpload }: { onUpload: (key: string) => void }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageKey, setImageKey] = useState<string>("");

  useEffect(() => {
    const cachedKey = localStorage.getItem(LOCALSTORAGE_KEY);
    const cachedExp = localStorage.getItem(LOCALSTORAGE_EXP);
    if (cachedKey && cachedExp && Date.now() < Number(cachedExp)) {
      setImageKey(cachedKey);
      onUpload(cachedKey);
    }
  }, [onUpload]);

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getPreviewLink = (key: string) => (key ? `/Usukhuu/api/get?key=${encodeURIComponent(key)}` : "");

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
      const key = data.key || "";
      setImageKey(key);
      onUpload(key);
      localStorage.setItem(LOCALSTORAGE_KEY, key);
      localStorage.setItem(LOCALSTORAGE_EXP, (Date.now() + CACHE_MINUTES * 60 * 1000).toString());
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
    if (imageKey) {
      try {
        await fetch("/Usukhuu/api/delete", {
          method: "POST",
          body: JSON.stringify({ key: imageKey }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Failed to delete image from bucket", err);
      }
    }
    setImageKey("");
    onUpload("");
    localStorage.removeItem(LOCALSTORAGE_KEY);
    localStorage.removeItem(LOCALSTORAGE_EXP);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    previewLink: getPreviewLink(imageKey),
    uploading,
    isDragging,
    openBrowse,
    handleFileSelect,
    handleDrop,
    deleteImage,
    setIsDragging,
  };
};
