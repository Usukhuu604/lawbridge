"use server";

import { z } from "zod";

const schemaLawyerProfile = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  nationalId: z.string().regex(/^[А-Я]{2}\d{8}$/, { message: "Invalid National ID format (e.g., АБ12345678)" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  yearOfAdmission: z
    .number()
    .min(1900, { message: "Invalid year" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  specializations: z.array(z.string()).min(1, { message: "Select at least one specialization" }),
  officeAddress: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    building: z.string().min(1, { message: "Building is required" }),
    apartment: z.string().optional(),
    district: z.string().min(1, { message: "District is required" }),
    aimag: z.string().min(1, { message: "Aimag/City is required" }),
  }),
  bio: z
    .string()
    .min(50, { message: "Bio must be at least 50 characters" })
    .max(1000, { message: "Bio cannot exceed 1000 characters" }),
  // profilePicture: z
  //   .instanceof(File)
  //   .refine((file) => file.size <= 5 * 1024 * 1024, { message: "File size must be less than 5MB" })
  //   .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
  //     message: "Only JPG and PNG files are allowed",
  //   }),
  documents: z
    .array(z.instanceof(File))
    .min(2, { message: "Please upload required documents" })
    .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), {
      message: "Each file must be less than 10MB",
    })
    .refine((files) => files.every((file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type)), {
      message: "Only PDF, JPG, and PNG files are allowed",
    }),
});

export const newLawyer = async (formData: FormData) => {
  const user = "";

  if (!user) {
    return {
      message: "No logged-in user",
      ZodError: {},
    };
  }

  const parsed = schemaLawyerProfile.safeParse({
    fullName: formData.get("fullName"),
    nationalId: formData.get("nationalId"),
    licenseNumber: formData.get("licenseNumber"),
    yearOfAdmission: parseInt(formData.get("yearOfAdmission") as string),
    specializations: formData.getAll("specializations"),
    officeAddress: {
      street: formData.get("street"),
      building: formData.get("building"),
      apartment: formData.get("apartment"),
      district: formData.get("district"),
      aimag: formData.get("aimag"),
    },
    bio: formData.get("bio"),
    // profilePicture: formData.get("profilePicture"),
    documents: formData.getAll("documents"),
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
    message: "Lawyer profile created successfully",
  };
};
