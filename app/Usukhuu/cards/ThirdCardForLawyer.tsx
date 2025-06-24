import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox } from "@/components/ui/index";
import { ZodErrors } from "../components/ZodError";
import { FormData } from "../page";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

import { specializations } from "@/app/Usukhuu/utils/specializations";

type Props = {
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watchedSpecializations: string[];

  isSubmitting?: boolean;
  goToPreviousStep?: () => void;
};

const ThirdCardForLawyer = ({
  errors,
  register,
  isSubmitting,
  goToPreviousStep,
  watchedSpecializations,
  setValue,
}: Props) => {
  const handlePreviousStep = goToPreviousStep;

  const [recommendPaid, setRecommendPaid] = useState<{ [spec: string]: boolean }>({});

  useEffect(() => {
    setRecommendPaid((prev) => {
      const updated: { [spec: string]: boolean } = {};
      watchedSpecializations.forEach((spec) => {
        updated[spec] = prev[spec] || false;
      });
      return updated;
    });
  }, [watchedSpecializations]);

  const handleRecommendPaidChange = (spec: string, checked: boolean | string) => {
    setRecommendPaid((prev) => ({ ...prev, [spec]: Boolean(checked) }));
  };

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
    <div className="space-y-10">
      <div>
        <label className="block font-medium mb-1 text-[16px]">Талбар</label>
        <div className="grid grid-cols-2 gap-2">
          {specializations.map((spec) => (
            <div key={spec} className="flex items-center space-x-2">
              <Checkbox
                id={`spec-${spec}`}
                checked={watchedSpecializations.includes(spec)}
                onCheckedChange={(checked) => handleCheckboxChange(checked, spec)}
                className="cursor-pointer  hover:bg-gray-100"
              />
              <label htmlFor={`spec-${spec}`} className="text-sm cursor-pointer">
                {spec}
              </label>
            </div>
          ))}
        </div>
        <ZodErrors error={errors.specializations?.message ? [errors.specializations.message] : undefined} />
      </div>

      {watchedSpecializations.length > 0 && (
        <div className="space-y-4">
          <label className="block font-medium mb-1 text-[16px]">Та төлбөртэй үйлчилгээ санал болгох уу?</label>
          {watchedSpecializations.map((spec) => {
            const isChecked = recommendPaid[spec] || false;
            return (
              <div
                key={spec}
                className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                  isChecked ? "bg-green-200 border-green-500" : "border-blue-300 hover:bg-gray-100"
                } cursor-pointer`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                    handleRecommendPaidChange(spec, !isChecked);
                  }
                }}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleRecommendPaidChange(spec, !isChecked);
                  }
                }}
              >
                <Checkbox
                  id={`recommend-paid-${spec}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleRecommendPaidChange(spec, checked)}
                  className="cursor-pointer"
                />
                <label htmlFor={`recommend-paid-${spec}`} className="text-sm cursor-pointer">
                  {`"${spec}" талбарт төлбөртэй үйлчилгээ үзүүлнэ`}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 mt-6 gap-10">
        <Button onClick={handlePreviousStep} className="bg-black text-white cursor-pointer hover:bg-gray-800">
          Буцах
        </Button>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer text-white border-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Бүртгүүлэх"}
        </Button>
      </div>
    </div>
  );
};
export default ThirdCardForLawyer;
