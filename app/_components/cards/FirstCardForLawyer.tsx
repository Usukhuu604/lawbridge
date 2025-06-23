"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input, Button } from "@/components/ui";
import { ZodErrors } from "../ZodError";
import type { FormData } from "@/app/page";
import { useState } from "react";
import Avatar from "../Avatar";

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  goToNextStep?: () => void;
};

const FirstCardForLawyer = ({ register, errors, goToNextStep }: Props) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedImageUrl(data.url);
  };

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
      <Avatar />

      <Button onClick={goToNextStep} className="w-full mt-6 bg-blue-400 hover:bg-blue-300 cursor-pointer text-white">
        Дараачийн
      </Button>
    </div>
  );
};

export default FirstCardForLawyer;

// "use client";

// import { UseFormRegister, FieldErrors } from "react-hook-form";
// import { Input, Button } from "@/components/ui";
// import { ZodErrors } from "../ZodError";
// import type { FormData } from "@/app/page";
// import { useState } from "react";

// type Props = {
//   register: UseFormRegister<FormData>;
//   errors: FieldErrors<FormData>;
//   goToNextStep?: () => void;
// };

// const FirstCardForLawyer = ({ register, errors, goToNextStep }: Props) => {
//   const handleNextStep = goToNextStep;

//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();
//     setUploadedImageUrl(data.url);
//   };

//   return (
//     <div>
//       <div>
//         <label htmlFor="fullName" className="block text-sm font-medium mb-1">
//           Овог нэр
//         </label>
//         <Input id="fullName" {...register("fullName")} />
//         <ZodErrors error={errors.fullName?.message ? [errors.fullName.message] : undefined} />
//       </div>
//       <div>
//         <label htmlFor="eMail" className="block text-sm font-medium mb-1">
//           Email
//         </label>
//         <Input id="eMail" {...register("email")} />
//         <ZodErrors error={errors.email?.message ? [errors.email.message] : undefined} />
//       </div>

//       <div>
//         <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
//           Зураг оруулах
//         </label>
//         <Input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} />
//         <ZodErrors error={errors.profileImage?.message ? [errors.profileImage.message] : undefined} />
//       </div>
//       {uploadedImageUrl && <img src={uploadedImageUrl} alt="preview" className="mt-2 w-32 h-32 rounded-md" />}

//       <Button onClick={handleNextStep} className="w-full mt-6 bg-blue-400 hover:bg-blue-300 cursor-pointer text-white">
//         Дараачийн
//       </Button>
//     </div>
//   );
// };

// export default FirstCardForLawyer;
