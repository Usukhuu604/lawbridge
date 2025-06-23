import z, { any } from "zod";

export const schemaLawyerProfile = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  nationalId: z.string().regex(/^[А-Я]{2}\d{8}$/, { message: "Invalid National ID format (e.g., АБ12345678)" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  specializations: z.array(z.string()).min(1, { message: "Select at least one specialization" }),
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters" })
    .max(1000, { message: "Bio cannot exceed 1000 characters" }),
  university: z.string().min(2, { message: "Enter name of the university" }),
  documents: z.custom<FileList | undefined>(
    (value) => {
      if (!value) return false;
      return value instanceof FileList && value.length >= 1;
    },
    {
      message: "Please upload required documents",
    }
  ),
  profileImage: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Зураг заавал оруулна уу",
  }),
});
