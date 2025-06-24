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
        {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations.message}</p>}
      </div>

      <div className="grid grid-cols-2 mt-6 gap-10">
        <Button onClick={handlePreviousStep} className="bg-black text-white cursor-pointer hover:bg-gray-800">
          Буцах
        </Button>
        <Button
          type="submit"
          className="w-full bg-blue-400 hover:bg-blue-300 cursor-pointer text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Бүртгүүлэх"}
        </Button>
      </div>
    </div>
  );
};
export default ThirdCardForLawyer;
