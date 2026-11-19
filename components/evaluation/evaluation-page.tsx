"use client";
import { useRef, useState } from "react";
import { emptyProfile, getQuestions, toggleAnswer } from "@/lib/evaluation";
import {
  calculateHairScore,
  type HairEvaluationResult,
} from "@/lib/hair-score";
import { SiteHeader } from "./site-header";
import { HeroBanner } from "./hero-banner";
import { ContactStep } from "./contact-step";
import { DemographicsStep } from "./demographics-step";
import { ProgressSteps } from "./progress-steps";
import { QuestionStep } from "./question-step";
import { ResultsStep } from "./results-step";
import { InformationSections } from "./information-sections";
import { EvaluationBackdrop } from "./evaluation-backdrop";
export function EvaluationPage() {
  const [stage, setStage] = useState<
    "contact" | "demographics" | "questions" | "results"
  >("contact");
  const [profile, setProfile] = useState(emptyProfile);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [medicalDetail, setMedicalDetail] = useState("");
  const [result, setResult] = useState<HairEvaluationResult | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const transitionLock = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);
  const questions = getQuestions(profile.gender || "male");
  const question = questions[index];
  const focusQuestion = () =>
    requestAnimationFrame(() =>
      document.getElementById("question-title")?.focus({ preventScroll: true }),
    );
  const next = () => {
    if (index === 9) {
      if (!profile.gender) return;
      const evaluation = calculateHairScore(profile.gender, answers, medicalDetail);
      setResult(evaluation);
      void fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          source: "Hair Evaluation Test",
          name: profile.name,
          phone: profile.mobile,
          email: profile.email,
          age: profile.age,
          gender: profile.gender,
          concern: `Hair evaluation score ${evaluation.score}/100 (${evaluation.band})`,
          answers,
          medicalDetail,
          score: evaluation.score,
          band: evaluation.band,
          pageUrl: window.location.href,
        }),
      }).catch(() => {});
      setStage("results");
      formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      setIndex((value) => value + 1);
      focusQuestion();
    }
  };
  const select = (value: string) => {
    if (transitionLock.current) return;
    setAnswers((previous) => ({
      ...previous,
      [index]: question.multiple
        ? toggleAnswer(
            previous[index] || [],
            value,
            index === 4 && profile.gender === "male",
          )
        : [value],
    }));
    if (!question.multiple && !(question.medical && value === "2")) {
      transitionLock.current = true;
      setTransitioning(true);
      window.setTimeout(() => {
        next();
        transitionLock.current = false;
        setTransitioning(false);
      }, 300);
    }
  };
  const started = stage === "questions" || stage === "results";
  return (
    <>
      <SiteHeader />
      <main>
        {!started && <HeroBanner />}
        <div
          className={`evaluation-background relative isolate overflow-hidden bg-[#fffdfc] pt-8 pb-2 [&.started]:pt-12 max-[768px]:pt-12 ${started ? "started" : ""}`}
        >
          <EvaluationBackdrop />
          <div className="page-container mx-auto max-w-[1140px] px-[15px] min-[992px]:max-[1200px]:max-w-[960px]">
            <div
              ref={formRef}
              className={`evaluation-form mx-auto max-w-[555px] scroll-mt-6 text-center [&.wide]:max-w-[760px] min-[992px]:max-[1200px]:max-w-[480px] max-[992px]:[&.wide]:max-w-[690px] max-[768px]:w-full max-[768px]:max-w-[600px] [&.wide:has(.results-step)]:max-w-full ${started ? "wide" : ""}`}
            >
              {!started && (
                <>
                  <h1 className="sr-only">Hair Evaluation Test</h1>
                  <h2 className="intake-title text-[32px] leading-[1.2] font-bold whitespace-nowrap text-brand min-[992px]:max-[1200px]:text-[28px] max-[768px]:text-[20px] max-[768px]:font-medium max-[768px]:whitespace-normal">
                    Tell us a bit about yourself
                  </h2>
                  <svg
                    className="title-rule mx-auto mt-[3px] block h-[17px] w-full max-w-[520px] fill-none stroke-brand stroke-[4] max-[768px]:mt-[5px] max-[768px]:h-auto max-[768px]:w-[83.333%]"
                    viewBox="0 0 645 21"
                    aria-hidden="true"
                  >
                    <path d="M642.5 3.5H337.893L322.021 15.5 306.6 3.5H1.5" />
                  </svg>
                </>
              )}
              {stage === "contact" && (
                <ContactStep
                  profile={profile}
                  onChange={setProfile}
                  onNext={() => setStage("demographics")}
                />
              )}
              {stage === "demographics" && (
                <DemographicsStep
                  profile={profile}
                  onChange={setProfile}
                  onNext={() => {
                    setStage("questions");
                    window.scrollTo({ top: 0, behavior: "instant" });
                    focusQuestion();
                  }}
                />
              )}
              {stage === "questions" && (
                <>
                  <ProgressSteps current={index} />
                  <QuestionStep
                    key={index}
                    question={question}
                    index={index}
                    selected={answers[index] || []}
                    medicalDetail={medicalDetail}
                    onDetail={setMedicalDetail}
                    onSelect={select}
                    onNext={next}
                    transitioning={transitioning}
                  />
                  {index > 0 && (
                    <button
                      className="previous-button mt-[30px] flex items-center gap-[6px] bg-transparent p-0 text-[16px] text-brand uppercase [&_span]:inline-block [&_span]:px-2 [&_span]:py-1 [&_span]:text-[24px] [&_span]:[transform:rotate(180deg)] max-[768px]:mt-5"
                      disabled={transitioning}
                      onClick={() => {
                        setIndex(index - 1);
                        focusQuestion();
                      }}
                    >
                      <span aria-hidden="true">➜</span>Previous
                    </button>
                  )}
                </>
              )}
              {stage === "results" && result && profile.gender && (
                <ResultsStep
                  name={profile.name}
                  result={result}
                  gender={profile.gender}
                />
              )}
            </div>
            <InformationSections />
          </div>
        </div>
      </main>
    </>
  );
}
