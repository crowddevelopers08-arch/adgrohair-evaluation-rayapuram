import type { HairEvaluationResult } from "@/lib/hair-score";
import { clinicPhone } from "@/lib/contact";

export function ScoreSummary({
  name,
  result,
}: {
  name: string;
  result: HairEvaluationResult;
}) {
  return (
    <section
      aria-labelledby="hair-score-heading"
      className="score-summary mx-auto max-w-[760px] px-5 pb-10 text-center text-[15px] leading-[21px] text-[#52606d] min-[640px]:px-[54px]"
    >
      <p className="thank-you mb-[44px]">
        Dear <strong>{name}</strong>, Thank you for taking our hair evaluation
        test!
      </p>
      <h3
        id="hair-score-heading"
        className="mb-2 text-[17px] leading-[24px] font-bold text-brand"
      >
        Your score on the Hair Evaluation Test is{" "}
        <span data-testid="hair-score">{result.score}</span> out of 100.
      </h3>
      <p data-testid="score-message">{result.message}</p>
      <p className="mt-[22px]">
        Call us at{" "}
        <a
          href={clinicPhone.href}
          className="font-medium text-brand hover:underline"
        >
          {clinicPhone.display}
        </a>{" "}
        to schedule an appointment with a hair specialist and avail of our
        Advanced International Treatments from the house of trichologists.
      </p>
      <p className="mt-5 text-[12px] leading-[18px] text-[#768394]">
        Indicative self-assessment score. A specialist can assess your hair
        health.
      </p>
    </section>
  );
}
