"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input, Button } from "@/components/ui";
import { ZodErrors } from "../ZodError";
import { FormData } from "@/app/page";

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  goToNextStep?: () => void;
};

const FirstCardForLawyer = ({ register, errors, goToNextStep }: Props) => {
  const handleNextStep = goToNextStep;

  return (
    <div>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Овог нэр
        </label>
        <Input id="fullName" {...register("fullName")} />
        <ZodErrors error={errors.fullName?.message ? [errors.fullName.message] : undefined} />
      </div>
      <div>
        <label htmlFor="eMail" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input id="eMail" {...register("email")} />
        <ZodErrors error={errors.email?.message ? [errors.email.message] : undefined} />
      </div>
      <Button onClick={handleNextStep} className="w-full mt-6 bg-blue-300">
        next
      </Button>
    </div>
  );
};

export default FirstCardForLawyer;
