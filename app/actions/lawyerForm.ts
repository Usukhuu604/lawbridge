"use server";

import { z } from "zod";

const schemaUserProfile = z.object({
  name: z.string().min(3, { message: "Please enter name" }),
  bio: z.string().min(10, { message: "Please fill the field" }).url({ message: "Please enter a valid bio" }),
});

export const newLawyer = async (formData: FormData) => {
  const user = "";

  if (!user) {
    return {
      message: "No logged-in user",
      ZodError: {},
    };
  }

  const parsed = schemaUserProfile.safeParse({
    avatarImageUrl: formData.get("avatarImageUrl"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      ZodError: parsed.error.flatten().fieldErrors,
      message: "Validation failed",
    };
  }

  return {
    data: {
      success: true,
    },
    ZodError: {},
    message: "Profile created",
  };
};
