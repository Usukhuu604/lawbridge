import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZodErrors } from "../components/ZodError";
import type { FormData } from "@/app/Usukhuu/page";
import Avatar from "../components/Avatar";

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  goToNextStep?: () => void;
};

const FirstCardForLawyer = ({ register, errors, goToNextStep }: Props) => {
  const handleNextStep = () => {
    if (!errors.firstName && !errors.lastName && !errors.email) {
      goToNextStep && goToNextStep();
    }
    // else {
    //   goToNextStep && goToNextStep(); // ustgah
    // }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            Нэр
          </label>
          <Input id="firstName" {...register("firstName")} />
          <ZodErrors error={errors.firstName?.message ? [errors.firstName.message] : undefined} />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Овог
          </label>
          <Input id="lastName" {...register("lastName")} />
          <ZodErrors error={errors.lastName?.message ? [errors.lastName.message] : undefined} />
        </div>
      </div>

      <div>
        <label htmlFor="eMail" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input id="eMail" {...register("email")} />
        <ZodErrors error={errors.email?.message ? [errors.email.message] : undefined} />
      </div>

      <Avatar errors={errors} />

      <Button onClick={handleNextStep} className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer text-white">
        Дараачийн
      </Button>
    </div>
  );
};

export default FirstCardForLawyer;
