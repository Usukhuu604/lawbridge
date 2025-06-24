"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import FirstCardForLawyer from "./cards/FirstCardForLawyer";
import SecondCardForLawyer from "./cards/SecondCardForLawyer";
import ThirdCardForLawyer from "./cards/ThirdCardForLawyer";

import { schemaLawyerProfile } from "./actions/schema";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < 3) {
      setPreviousStep(currentStep);
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((previousStep) => previousStep - 1);
    }
  };

  const CurrentStepComponent = [FirstCardForLawyer, SecondCardForLawyer, ThirdCardForLawyer][currentStep];

  return (
    <div className="w-screen min-h-screen flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl border-2 border-blue-400 shadow-2xl p-8 rounded-lg space-y-6 "
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Өмгөөлөгчийн бүртгэл</h1>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: currentStep > previousStep ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: currentStep > previousStep ? -100 : 100 }}
            variants={undefined}
            className="space-y-4"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <CurrentStepComponent
              errors={errors}
              setValue={setValue}
              register={register}
              watchedSpecializations={watchedSpecializations}
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
};

export default LawyerRegistrationForm;
