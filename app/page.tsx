"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { newLawyer } from "./actions/lawyerForm";
import { ZodErrors } from "./_components/ZodError";

const specializations = [
  'Эрүүгийн эрх зүй',
'Гэр бүлийн эрх зүй',
'Компанийн эрх зүй',
'Иргэний эрх зүй',
'Эд хөрөнгийн эрх зүй',
'Оюуны өмч',
'Татварын эрх зүй',
'Хөдөлмөрийн эрх зүй'
];

const schemaLawyerProfile = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  nationalId: z.string().regex(/^[А-Я]{2}\d{8}$/, { message: "Invalid National ID format (e.g., АБ12345678)" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  // Changed yearOfAdmission to z.number() and added a refine for min year
  // yearOfAdmission: z.string().regex(/^\d{4}$/, { message: "Year of Admission must be a 4-digit number" })
  //   .transform(Number) // Convert to number after regex validation
  //   .refine(year => year >= 1900 && year <= new Date().getFullYear(), {
  //     message: `Year must be between 1900 and ${new Date().getFullYear()}`,
  //   }),
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
  documents: z
    .instanceof(FileList)
    .refine((fileList) => fileList.length >= 2, { message: "Please upload at least 2 required documents" }),
});

type FormData = z.infer<typeof schemaLawyerProfile>;

const LawyerRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    setValue, 
    watch, 
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schemaLawyerProfile),
    defaultValues: {
      specializations: [],
    },
  });

  const watchedSpecializations = watch("specializations"); // Watch for changes in specializations

  const handleCheckboxChange = (checked: boolean | string, value: string) => {
    const currentSpecializations = watchedSpecializations || [];
    if (checked) {
      setValue("specializations", [...currentSpecializations, value], { shouldValidate: true });
    } else {
      setValue(
        "specializations",
        currentSpecializations.filter((spec) => spec !== value),
        { shouldValidate: true }
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "specializations") {
        (value as string[]).forEach((spec) => formData.append("specializations", spec));
      } else if (key === "officeAddress") {
        Object.entries(value as { [s: string]: unknown }).forEach(([addrKey, addrValue]) => {
          formData.append(`officeAddress[${addrKey}]`, String(addrValue)); 
        });
      } else if (key === "profilePicture" || key === "documents") {
        Array.from(value as FileList).forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, String(value)); 
      }
    });

    try {
      const result = await newLawyer(formData);
      console.log("Form submission result:", result);

    } catch (error) {
      console.error("Form submission error:", error);
     
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl border shadow-2xl p-8 rounded-lg space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Өмгөөлөгчийн бүртгэл</h1>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Овог нэр
          </label>
          <Input id="fullName" {...register("fullName")} />
          <ZodErrors error={errors.fullName?.message ? [errors.fullName.message] : undefined} />
        </div>

        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium mb-1">
            Регистрын дугаар
          </label>
          <Input id="nationalId" {...register("nationalId")} placeholder="АБ12345678" />
          <ZodErrors error={errors.nationalId?.message ? [errors.nationalId.message] : undefined} />
        </div>

        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
            Зөвшөөрлийн дугаар
          </label>
          <Input id="licenseNumber" {...register("licenseNumber")} />
          <ZodErrors error={errors.licenseNumber?.message ? [errors.licenseNumber.message] : undefined} />
        </div>

        {/* 
        <div>
          <label htmlFor="yearOfAdmission" className="block text-sm font-medium mb-1">Year of Admission</label>
          <Input id="yearOfAdmission" type="number" {...register("yearOfAdmission")} />
          <ZodErrors error={errors.yearOfAdmission?.message ? [errors.yearOfAdmission.message] : undefined} />
        </div>
 */}
        <div>
          <label className="block text-sm font-medium mb-1">Specializations</label>
          <div className="grid grid-cols-2 gap-2">
            {specializations.map((spec) => (
              <div key={spec} className="flex items-center space-x-2">
                <Checkbox
                  id={`spec-${spec}`}
                  checked={watchedSpecializations.includes(spec)}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, spec)}
                />
                <label htmlFor={`spec-${spec}`} className="text-sm cursor-pointer">
                  {spec}
                </label>
              </div>
            ))}
          </div>
          {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations.message}</p>}
        </div>

        {/* Office Address */}
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Ажлын хаяг</h3>
          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">
              Гудамж
            </label>
            <Input id="street" {...register("officeAddress.street")} />
            <ZodErrors
              error={errors.officeAddress?.street?.message ? [errors.officeAddress.street.message] : undefined}
            />
          </div>

          <div>
            <label htmlFor="building" className="block text-sm font-medium mb-1">
              Байр
            </label>
            <Input id="building" {...register("officeAddress.building")} />
            <ZodErrors
              error={errors.officeAddress?.building?.message ? [errors.officeAddress.building.message] : undefined}
            />
          </div>

          <div>
            <label htmlFor="apartment" className="block text-sm font-medium mb-1">
              Тоот (Optional)
            </label>
            <Input id="apartment" {...register("officeAddress.apartment")} />
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-1">
              Дүүрэг
            </label>
            <Input id="district" {...register("officeAddress.district")} />
            <ZodErrors
              error={errors.officeAddress?.district?.message ? [errors.officeAddress.district.message] : undefined}
            />
          </div>

          <div>
            <label htmlFor="aimag" className="block text-sm font-medium mb-1">
              Aimag/Хот
            </label>
            <Input id="aimag" {...register("officeAddress.aimag")} />
            <ZodErrors
              error={errors.officeAddress?.aimag?.message ? [errors.officeAddress.aimag.message] : undefined}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Мэргэжлийн намтар
          </label>
          <Textarea id="bio" {...register("bio")} rows={4} />
          <ZodErrors error={errors.bio?.message ? [errors.bio.message] : undefined} />
        </div>

        <div>
          <label htmlFor="documents" className="block text-sm font-medium mb-1">
            Шаардлагатай бичиг баримт (Лиценз ба Иргэний үнэмлэх)
          </label>
          <Input id="documents" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" {...register("documents")} />
          <ZodErrors error={errors.documents?.message ? [errors.documents.message] : undefined} />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register as Lawyer"}
        </Button>
      </form>
    </div>
  );
};

export default LawyerRegistrationForm;
