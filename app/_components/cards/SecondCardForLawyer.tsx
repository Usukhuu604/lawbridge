"use client";

import { Input, Checkbox, Textarea, Button } from "@/components/ui";
import { ZodErrors } from "../ZodError";
import { FormData } from "@/app/page";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { useState } from "react";

const specializations = [
  "Эрүүгийн хууль",
  "Иргэний хууль",
  "Гэр бүлийн хууль",
  "Компанийн эрх зүй",
  "Эд хөрөнгийн эрх зүй",
  "Оюуны өмч",
  "Татварын хууль",
  "Хөдөлмөрийн хууль",
  "Захиргааны эрх зүй",
  "Үндсэн хуулийн эрх зүй",
  "Банк, санхүүгийн эрх зүй",
  "Байгаль орчны эрх зүй",
  "Олон улсын эрх зүй",
  "Газар зохион байгуулалт",
  "Худалдааны эрх зүй",
  "Даатгалын эрх зүй",
  "Хэрэглэгчийн эрх ашгийг хамгаалах",
  "Кибер аюулгүй байдал ба мэдээллийн технологийн",
];

type Props = {
  errors: FieldErrors<FormData>;
  watchedSpecializations: string[];
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
};

const SecondCardForLawyer = ({
  register,
  errors,
  setValue,
  watchedSpecializations,
  goToNextStep,
  goToPreviousStep,
}: Props) => {
  const handleNextStep = () => {
    if (!errors.licenseNumber && !errors.specializations && !errors.bio) {
      goToNextStep && goToNextStep();
    }
  };
  const handlePreviousStep = goToPreviousStep;

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

  return (
    <div>
      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
          Өмгөөлөгчийн дугаар
        </label>
        <Input id="licenseNumber" {...register("licenseNumber")} />
        <ZodErrors error={errors.licenseNumber?.message ? [errors.licenseNumber.message] : undefined} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Талбар</label>
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

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Мэргэжлийн намтар
        </label>
        <Textarea id="bio" {...register("bio")} rows={4} />
        <ZodErrors error={errors.bio?.message ? [errors.bio.message] : undefined} />
      </div>

      <div className="w-full grid grid-cols-2 justify-between gap-5 mt-4">
        <Button onClick={handlePreviousStep} className="bg-black text-white cursor-pointer hover:bg-gray-800 ">
          Буцах
        </Button>
        <Button onClick={handleNextStep} className="bg-blue-400 hover:bg-blue-300 cursor-pointer text-white">
          Дараачийн
        </Button>
      </div>
    </div>
  );
};

export default SecondCardForLawyer;
