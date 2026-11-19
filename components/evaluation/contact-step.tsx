"use client";
import { useState } from "react";
import { Profile, validateContact } from "@/lib/evaluation";
import { ActionButton } from "./action-button";
export function ContactStep({
  profile,
  onChange,
  onNext,
}: {
  profile: Profile;
  onChange: (profile: Profile) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <form
      className="contact-form mt-[30px] px-[15px] max-[768px]:mx-auto max-[768px]:mt-6 max-[768px]:w-[83.333%]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const nextErrors = validateContact(profile);
        setErrors(nextErrors);
        if (!Object.keys(nextErrors).length) onNext();
      }}
    >
      {(
        [
          { key: "name", label: "NAME", type: "text", autoComplete: "name" },
          {
            key: "mobile",
            label: "MOBILE NO",
            type: "tel",
            autoComplete: "tel-national",
          },
          {
            key: "email",
            label: "EMAIL ID",
            type: "email",
            autoComplete: "email",
          },
        ] as const
      ).map(({ key, label, type, autoComplete }) => (
        <div
          className="contact-field mt-[30px] first:mt-0 [&_input]:h-[52px] [&_input]:w-full [&_input]:rounded-[50px] [&_input]:border [&_input]:border-solid [&_input]:border-[#565656] [&_input]:bg-white [&_input]:p-[15px] [&_input]:text-[14px] [&_input]:text-[#495057] [&_input::placeholder]:text-[#768394] [&_input::placeholder]:opacity-100 max-[768px]:[&_input]:h-[42px] max-[768px]:[&_input]:px-[15px] max-[768px]:[&_input]:py-3"
          key={key}
        >
          <label className="sr-only" htmlFor={`patient-${key}`}>
            {label}
          </label>
          <input
            id={`patient-${key}`}
            name={key}
            type={type}
            autoComplete={autoComplete}
            placeholder={label}
            value={profile[key]}
            maxLength={key === "mobile" ? 10 : undefined}
            inputMode={key === "mobile" ? "numeric" : undefined}
            aria-invalid={Boolean(errors[key])}
            aria-describedby={errors[key] ? `${key}-error` : undefined}
            onChange={(event) => {
              const value =
                key === "mobile"
                  ? event.target.value.replace(/\D/g, "")
                  : key === "name"
                    ? event.target.value.replace(/[^a-zA-Z ]/g, "")
                    : event.target.value;
              onChange({ ...profile, [key]: value });
              setErrors({ ...errors, [key]: "" });
            }}
          />
          {errors[key] && (
            <p
              id={`${key}-error`}
              role="alert"
              className="field-error my-1 text-left text-[14px] text-[#d33535]"
            >
              {errors[key]}
            </p>
          )}
        </div>
      ))}
      <p className="contact-note mt-[17px] -mx-2.5 mb-[37px] text-[11px] text-[#768394] max-[768px]:mt-[18px] max-[768px]:-mx-2 max-[768px]:mb-[25px]">
        *You will receive your hair health score on your contact details
      </p>
      <ActionButton type="submit">NEXT</ActionButton>
    </form>
  );
}
