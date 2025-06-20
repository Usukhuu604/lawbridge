import { Input } from "@/components/ui";
import { ZodErrors } from "../ZodError";
import { FormData } from "@/app/page";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui";

type Props = {
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  isSubmitting?: boolean;
  goToPreviousStep?: () => void;
};

const MONGOLIAN_UNIVERSITIES = [
  "Монгол Улсын Их Сургууль (МУИС)",
  "Хууль Сахиулахын Их Сургууль (ХСИС)",
  "Монгол Улсын Боловсролын Их Сургууль (МУБИС)",
  "Их Засаг Олон Улсын Их Сургууль",
  "Отгонтэнгэр Их Сургууль",
  "Шихихутуг Хууль Зүйн Их Сургууль",
];

const ThirdCardForLawyer = ({ errors, register, isSubmitting, goToPreviousStep }: Props) => {
  const handlePreviousStep = goToPreviousStep;
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

      <div className="grid grid-cols-2 mt-6 gap-10">
        <Button onClick={handlePreviousStep} className="bg-red-300">
          Back
        </Button>
        <Button type="submit" className="w-full bg-blue-400" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  );
};
export default ThirdCardForLawyer;
