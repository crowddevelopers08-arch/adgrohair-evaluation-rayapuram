/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import type { Question } from "@/lib/evaluation";
import { ActionButton } from "./action-button";
import { asset } from "@/lib/assets";
export function QuestionStep({
  question,
  index,
  selected,
  medicalDetail,
  onDetail,
  onSelect,
  onNext,
  transitioning,
}: {
  question: Question;
  index: number;
  selected: string[];
  medicalDetail: string;
  onDetail: (value: string) => void;
  onSelect: (value: string) => void;
  onNext: () => void;
  transitioning: boolean;
}) {
  const [error, setError] = useState("");
  const needsDetail = question.medical && selected.includes("2");
  const submit = () => {
    if (question.multiple && !selected.length) {
      setError("Please select any option");
      return;
    }
    if (needsDetail && !medicalDetail.trim()) {
      setError("Required");
      return;
    }
    setError("");
    onNext();
  };
  return (
    <section
      className={`question-step mt-[25px] min-h-[300px] [&.question-8]:min-h-[330px] [&_h2]:text-[32px] [&_h2]:leading-[1.2] [&_h2]:font-semibold [&_h2]:text-brand [&_h2]:outline-none [&>.action-button]:mt-6 max-[768px]:mt-5 max-[768px]:[&_h2]:text-[20px] max-[768px]:[&_h2]:font-medium max-[768px]:[&.question-4_.circle]:mx-auto max-[768px]:[&.question-4_.circle]:max-w-[400px] question-${index + 1}`}
      aria-labelledby="question-title"
    >
      <h2 id="question-title" tabIndex={-1}>
        {question.title}
      </h2>
      {question.multiple && (
        <p className="multiple-note mt-2 text-[#52525b]">
          choose multiple options
        </p>
      )}
      <div
        className={`answer-options mt-12 grid grid-cols-2 gap-x-[30px] gap-y-[14px] [&.circle]:flex [&.circle]:justify-center [&.circle]:gap-12 [&.comb]:grid-cols-3 max-[768px]:mt-6 max-[768px]:grid-cols-1 max-[768px]:gap-[14px] max-[768px]:px-[15px] max-[768px]:[&.circle]:mt-8 max-[768px]:[&.circle]:flex-wrap max-[768px]:[&.circle]:gap-6 max-[768px]:[&.circle]:p-0 max-[768px]:[&.comb]:flex max-[768px]:[&.comb]:flex-col max-[768px]:[&.comb]:gap-5 ${question.appearance || "text"} ${question.multiple ? "multiple" : ""}`}
        role="group"
        aria-label={question.title}
      >
        {question.options.map((option, optionIndex) => (
          <label
            key={option.value}
            className={`answer-option relative flex cursor-pointer flex-col animate-enter [&_input]:pointer-events-none [&_input]:absolute [&_input]:size-px [&_input]:opacity-0 min-[769px]:[&:hover_.option-label]:border-brand max-[768px]:[.comb_&]:flex-row max-[768px]:[.comb_&]:items-end max-[768px]:[.comb_&]:justify-center max-[768px]:[.comb_&]:gap-6 max-[768px]:[.portrait_&]:flex-row max-[768px]:[.portrait_&]:items-center max-[768px]:[.portrait_&]:gap-5 ${selected.includes(option.value) ? "selected" : ""}`}
            style={{ animationDelay: `${optionIndex * 60}ms` }}
          >
            <input
              type={question.multiple ? "checkbox" : "radio"}
              name={`question-${index + 1}`}
              value={option.value}
              checked={selected.includes(option.value)}
              disabled={transitioning}
              onClick={() => {
                if (!question.multiple) {
                  setError("");
                  onSelect(option.value);
                }
              }}
              onChange={() => {
                if (question.multiple) {
                  setError("");
                  onSelect(option.value);
                }
              }}
            />
            {option.image && (
              <span className="option-image [.circle_&]:mx-auto [.circle_&]:my-0 [.circle_&]:flex [.circle_&]:size-[100px] [.circle_&]:items-center [.circle_&]:justify-center [.circle_&]:rounded-full [.circle_&]:border-2 [.circle_&]:border-solid [.circle_&]:border-[#656565] [.circle_&]:bg-white [.circle_&]:p-2.5 [.portrait_&]:mx-auto [.portrait_&]:mt-0 [.portrait_&]:mb-6 [.portrait_&]:flex [.portrait_&]:size-[100px] [.portrait_&]:items-center [.portrait_&]:justify-center [.portrait_&]:rounded-full [.portrait_&]:border-2 [.portrait_&]:border-solid [.portrait_&]:border-[#656565] [.portrait_&]:bg-white [.portrait_&]:p-2.5 [.circle_.selected_&]:border-brand [.circle_.selected_&]:bg-brand min-[769px]:[.circle_.answer-option:hover_&]:border-brand min-[769px]:[.circle_.answer-option:hover_&]:bg-brand [.circle_&_img]:max-h-full [.circle_&_img]:max-w-full [.circle_&_img]:object-contain [.portrait_&_img]:max-h-full [.portrait_&_img]:max-w-full [.portrait_&_img]:object-contain [.comb_&]:mb-4 [.comb_&]:flex [.comb_&]:h-[175px] [.comb_&]:items-end [.comb_&]:justify-center [.comb_&_img]:max-h-[175px] [.comb_&_img]:object-contain max-[768px]:[.comb_&]:m-0 max-[768px]:[.comb_&]:h-[100px] max-[768px]:[.comb_&]:max-w-[150px] max-[768px]:[.comb_&]:flex-1 max-[768px]:[.comb_&_img]:max-h-[100px] max-[768px]:[.portrait_&]:m-0">
                <img
                  src={asset(option.image)}
                  alt={question.appearance === "circle" ? option.label : ""}
                />
              </span>
            )}
            <span
              className={
                question.appearance === "circle"
                  ? "sr-only"
                  : "option-label relative block min-h-[60px] rounded-[50px] border border-solid border-[#565656] bg-white p-[14px] text-[20px] leading-[1.5] font-semibold [.selected_&]:border-brand [.selected_&]:bg-brand-gradient [.selected_&]:text-white [.multiple_&]:pr-10 [.answer-options:not(.multiple)_.selected_&]:after:absolute [.answer-options:not(.multiple)_.selected_&]:after:right-5 [.answer-options:not(.multiple)_.selected_&]:after:top-1/2 [.answer-options:not(.multiple)_.selected_&]:after:h-5 [.answer-options:not(.multiple)_.selected_&]:after:w-[14px] [.answer-options:not(.multiple)_.selected_&]:after:[transform:translateY(-50%)] [.answer-options:not(.multiple)_.selected_&]:after:[background:url('https://res.cloudinary.com/ms16lpja/image/upload/v1795092011/lock-icon.webp')_center/contain_no-repeat] [.answer-options:not(.multiple)_.selected_&]:after:brightness-50 [.answer-options:not(.multiple)_.selected_&]:after:content-[''] max-[768px]:min-h-[42px] max-[768px]:p-2 max-[768px]:text-[16px] max-[768px]:[.comb_&]:flex-1 max-[768px]:[.portrait_&]:flex-1"
              }
            >
              {option.label}
              {question.multiple && (
                <span
                  className="checkbox-indicator absolute top-1/2 right-[15px] size-[15px] rounded-full border border-solid border-[#656565] bg-white [transform:translateY(-50%)] [.selected_&]:after:m-[3px] [.selected_&]:after:block [.selected_&]:after:size-[7px] [.selected_&]:after:rounded-full [.selected_&]:after:bg-brand [.selected_&]:after:content-['']"
                  aria-hidden="true"
                />
              )}
            </span>
          </label>
        ))}
      </div>
      {needsDetail && (
        <div className="medical-detail mt-[15px] [&_input]:w-full [&_input]:border [&_input]:border-solid [&_input]:border-[#656565] [&_input]:bg-white [&_input]:p-[15px] [&_input]:text-[14px] max-[768px]:px-[15px]">
          <label className="sr-only" htmlFor="medical-detail">
            Please mention your medical condition
          </label>
          <input
            id="medical-detail"
            type="text"
            placeholder="Please mention.."
            value={medicalDetail}
            onChange={(e) => {
              onDetail(e.target.value);
              setError("");
            }}
            aria-invalid={Boolean(error)}
          />
        </div>
      )}
      {error && (
        <p
          role="alert"
          className={question.multiple ? "selection-error" : "field-error"}
        >
          {error}
        </p>
      )}
      {(question.multiple || needsDetail) && (
        <ActionButton onClick={submit} disabled={transitioning}>
          {index === 9 ? "Submit" : "continue"}
        </ActionButton>
      )}
    </section>
  );
}
