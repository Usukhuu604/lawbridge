import { z } from "zod";

export const schemaLawyerProfile = z.object({
  firstName: z.string().max(100).min(2, { message: "First name is required" }),
  lastName: z.string().max(100).min(2, { message: "Last name is required " }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .max(8)
    .regex(/^(?:83|85|86|88|89|90|91|94|95|96|97|98|99)\d{6}$/, "Invalid phone number"),

  licenseNumber: z.string().regex(/^LAW-\d{4}-\d{3}$/, {
    message: "Өмгөөлөгчийн дугаар буруу байна (ж: LAW-2021-045)",
  }),
  specializations: z.array(z.string()).min(1, { message: "Select at least one specialization" }),
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters" })
    .max(1000, { message: "Bio cannot exceed 1000 characters" }),
  university: z.string().min(2, { message: "Enter name of the university" }),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }).min(1, { message: "Avatar is required" }),
  documents: z.custom(
    (value) => {
      if (typeof FileList !== "undefined" && value instanceof FileList) {
        return value.length >= 1;
      }
      return false;
    },
    {
      message: "Please upload required documents",
    }
  ),
});
