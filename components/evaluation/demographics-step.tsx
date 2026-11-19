/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { ages, Profile } from "@/lib/evaluation";
import { ActionButton } from "./action-button";
import { asset } from "@/lib/assets";
export function DemographicsStep({
  profile,
  onChange,
  onNext,
}: {
  profile: Profile;
  onChange: (profile: Profile) => void;
  onNext: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="demographics-form mt-[43px] [&_legend]:mb-2 [&_legend]:text-[28px] [&_legend]:font-medium [&_legend]:text-[#212529] [&>.action-button]:mt-[43px] [&_.field-error]:text-center max-[768px]:mt-6 max-[768px]:[&>.action-button]:mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (profile.age && profile.gender) onNext();
      }}
    >
      <fieldset>
        <legend>AGE</legend>
        <div className="age-options flex justify-center gap-[15px] min-[992px]:max-[1200px]:gap-2 max-[768px]:mx-auto max-[768px]:w-full max-[768px]:max-w-[350px] max-[768px]:flex-wrap max-[768px]:gap-3">
          {ages.map((age) => (
            <label
              key={age}
              className="age-option relative cursor-pointer py-[6px] [&_input]:pointer-events-none [&_input]:absolute [&_input]:size-px [&_input]:opacity-0 [&>span]:flex [&>span]:size-[90px] [&>span]:items-center [&>span]:justify-center [&>span]:rounded-full [&>span]:border-2 [&>span]:border-solid [&>span]:border-[#656565] [&>span]:bg-white [&>span]:text-[20px] [&>span]:font-medium [&:has(input:checked)>span]:border-brand [&:has(input:checked)>span]:bg-brand [&:has(input:checked)>span]:text-white min-[769px]:[&:hover>span]:border-brand min-[769px]:[&:hover>span]:bg-brand min-[769px]:[&:hover>span]:text-white min-[992px]:max-[1200px]:[&>span]:size-[74px] max-[768px]:p-[5px]"
            >
              <input
                type="radio"
                name="age"
                value={age}
                checked={profile.age === age}
                onChange={() => onChange({ ...profile, age })}
              />
              <span>{age}</span>
            </label>
          ))}
        </div>
        {submitted && !profile.age && (
          <p
            className="field-error my-1 text-left text-[14px] text-[#d33535]"
            role="alert"
          >
            Required
          </p>
        )}
      </fieldset>
      <fieldset className="gender-field mt-[42px] max-[768px]:mt-6">
        <legend>CHOOSE GENDER</legend>
        <div className="gender-options flex justify-center gap-[18px] max-[768px]:gap-3">
          {(["male", "female"] as const).map((gender, i) => (
            <label
              className="gender-option flex cursor-pointer flex-col items-center px-3 py-[6px] text-[20px] uppercase [&_input]:pointer-events-none [&_input]:absolute [&_input]:size-px [&_input]:opacity-0 [&:has(input:checked)]:text-brand [&:has(input:checked)_img]:[filter:none] [&:has(input:checked)_img]:[transform:scale(1)] [&:has(input:checked)_.gender-check]:block"
              key={gender}
            >
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={profile.gender === gender}
                onChange={() => onChange({ ...profile, gender })}
              />
              <span className="gender-picture relative block [&_img]:size-[150px] [&_img]:object-contain [&_img]:[filter:grayscale(1)] [&_img]:[transform:scale(0.85)] [&_img]:[transition:transform_0.4s] max-[768px]:[&_img]:size-[125px]">
                <img src={asset(`gender-${i + 1}.webp`)} alt="" />
                <span
                  className="gender-check absolute top-0 right-0 hidden size-10 rounded-full bg-brand-dark leading-10 text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
              </span>
              <span>{gender}</span>
            </label>
          ))}
        </div>
        {submitted && !profile.gender && (
          <p
            className="field-error my-1 text-left text-[14px] text-[#d33535]"
            role="alert"
          >
            Required
          </p>
        )}
      </fieldset>
      <ActionButton type="submit">LET&apos;S BEGIN</ActionButton>
    </form>
  );
}
