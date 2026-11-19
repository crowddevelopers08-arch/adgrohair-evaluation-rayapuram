/* eslint-disable @next/next/no-img-element */
import type { HairEvaluationResult } from "@/lib/hair-score";
import type { Gender } from "@/lib/evaluation";
import { genderMedia } from "@/lib/gender-media";
import { ScoreSummary } from "./score-summary";
import { TreatmentResults } from "./treatment-results";
import { asset } from "@/lib/assets";

export function ResultsStep({
  name,
  result,
  gender,
}: {
  name: string;
  result: HairEvaluationResult;
  gender: Gender;
}) {
  return (
    <section
      className="results-step w-full text-center [&_h2]:relative [&_h2]:my-[35px] [&_h2]:text-[24px] [&_h2]:font-medium [&_h2]:text-[#231f20] [&_h2::after]:mx-auto [&_h2::after]:my-[6px] [&_h2::after]:block [&_h2::after]:h-0.5 [&_h2::after]:w-[275px] [&_h2::after]:max-w-full [&_h2::after]:bg-brand [&_h2::after]:content-['']"
      aria-label="Evaluation completed"
    >
      <ScoreSummary name={name} result={result} />
      <h2>International Hair Treatments</h2>
      <div className="treatment-cards flex justify-start gap-[25px] min-[768px]:justify-center max-[768px]:gap-[15px] max-[768px]:overflow-x-auto">
        {[
          {
            logo: "stm.svg",
            result: "88% Postive Results",
            duration: "10 SESSIONS",
            label: "STM hair regrowth treatment",
          },
          {
            logo: "grohair.svg",
            result: "77% Postive Results",
            duration: "10 WEEKS",
            label: "GroHair treatment",
          },
        ].map((treatment) => (
          <article
            className="treatment-card w-[calc(33.333%-20px)] border-4 border-solid border-white bg-[#f5f5f5] p-5 [&_p]:py-4 [&_p]:text-[15px] [&_p]:leading-[25px] [&_p]:font-bold [&_p_span]:block [&_p_span]:text-[18px] [&_p_strong]:block [&_p_strong]:text-[25px] max-[768px]:w-[90%] max-[768px]:min-w-[280px] max-[768px]:max-w-[90%] max-[768px]:shrink-0 max-[768px]:p-4"
            key={treatment.logo}
          >
            <img
              className="treatment-photo w-full"
              src={asset(genderMedia[gender].portrait)}
              alt={`${genderMedia[gender].portraitAlt} - ${treatment.label}`}
            />
            <div className="treatment-logo bg-[#efefef] p-2.5 [&_img]:h-10 [&_img]:w-auto">
              <img src={asset(treatment.logo)} alt={treatment.label} />
            </div>
            <p>
              {treatment.result}
              <span>Visible Results in</span>
              <strong>{treatment.duration}</strong>
            </p>
          </article>
        ))}
      </div>
      <h2>Our Treatment Results</h2>
      <TreatmentResults gender={gender} />
    </section>
  );
}
