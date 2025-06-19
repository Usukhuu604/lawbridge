"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { newLawyer } from "./actions/lawyerForm";
import FirstCardForLawyer from "./_components/cards/FirstCardForLawyer";
import SecondCardForLawyer from "./_components/cards/SecondCardForLawyer";
import ThirdCardForLawyer from "./_components/cards/ThirdCardForLawyer";
import { schemaLawyerProfile } from "./actions/schema";

export type FormData = z.infer<typeof schemaLawyerProfile>;

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

  const watchedSpecializations = watch("specializations");

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "specializations") {
        (value as string[]).forEach((spec) => formData.append("specializations", spec));
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl border-2 border-blue-400 shadow-2xl p-8 rounded-lg space-y-6 "
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Өмгөөлөгчийн бүртгэл</h1>

        <FirstCardForLawyer register={register} errors={errors} />

        <SecondCardForLawyer
          errors={errors}
          setValue={setValue}
          register={register}
          watchedSpecializations={watchedSpecializations}
        />

        <ThirdCardForLawyer register={register} errors={errors} />

        <Button type="submit" className="w-full bg-blue-400" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register as Lawyer"}
        </Button>
      </form>
    </div>
  );
};

export default LawyerRegistrationForm;
