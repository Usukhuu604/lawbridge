// university, documents, appointment

import React from "react";
import { Input } from "@/components/ui";
import { ZodErrors } from "../ZodError";
import { FormData } from "@/app/page";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

type Props = {
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
};

const ThirdCardForLawyer = ({ errors, register }: Props) => {
  return (
    <div>
      <div>
        <label htmlFor="university" className="block text-sm font-medium mb-1">
          Их Сургуулийн Мэдээлэл
        </label>

        <Input id="university" {...register("university")} />
        <ZodErrors error={errors.university?.message ? [errors.university.message] : undefined} />
      </div>

      <div>
        <label htmlFor="documents" className="block text-sm font-medium mb-1">
          Шаардлагатай бичиг баримт (Лиценз ба Иргэний үнэмлэх)
        </label>
        <Input id="documents" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" {...register("documents")} />
        <ZodErrors error={errors.documents?.message ? [errors.documents.message] : undefined} />
      </div>
    </div>
  );
};

export default ThirdCardForLawyer;
