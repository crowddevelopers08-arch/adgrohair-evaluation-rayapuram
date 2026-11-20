import type { HairEvaluationResult } from "@/lib/hair-score";
import type { Gender } from "@/lib/evaluation";
import { ScoreSummary } from "./score-summary";
import { TreatmentResults } from "./treatment-results";
import { TreatmentCarousel } from "./treatment-carousel";
import { clinicPhone } from "@/lib/contact";
import { ConsultationTrigger } from "../consultation/consultation-provider";

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
      <h2 id="international-treatments-heading">International Hair Treatments</h2>
      <TreatmentCarousel />
      <h2>Our Treatment Results</h2>
      <TreatmentResults gender={gender} />
      <div className="result-actions mt-8 mb-4 flex flex-wrap items-center justify-center gap-4 max-[768px]:flex-col">
        <ConsultationTrigger
          source="Results Book Your Consultation"
          className="min-w-[240px] rounded-[50px] bg-brand-gradient px-8 py-3 text-[16px] font-semibold text-white uppercase max-[768px]:w-full max-[768px]:max-w-[320px]"
        >
          Book Your Consultation
        </ConsultationTrigger>
        <a
          href={clinicPhone.href}
          className="min-w-[240px] rounded-[50px] border-2 border-solid border-brand bg-white px-8 py-3 text-[16px] font-semibold text-brand uppercase max-[768px]:w-full max-[768px]:max-w-[320px]"
        >
          Call Now
        </a>
      </div>
    </section>
  );
}
