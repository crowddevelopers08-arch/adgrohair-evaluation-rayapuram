"use client";
import type { Profile } from "@/lib/evaluation";
import type { HairEvaluationResult } from "@/lib/hair-score";
import { ConsultationProvider } from "../consultation/consultation-provider";
import { SiteHeader } from "./site-header";
import { ResultsStep } from "./results-step";
import { InformationSections } from "./information-sections";
import { EvaluationBackdrop } from "./evaluation-backdrop";

// Dedicated score page: same layout and score card as the in-flow results.
export function ScorePage({
  profile,
  result,
}: {
  profile: Profile;
  result: HairEvaluationResult;
}) {
  return (
    <ConsultationProvider profile={profile}>
      <SiteHeader />
      <main>
        <div className="evaluation-background started relative isolate overflow-hidden bg-[#fffdfc] pt-12 pb-2">
          <EvaluationBackdrop />
          <div className="page-container mx-auto max-w-[1140px] px-[15px] min-[992px]:max-[1200px]:max-w-[960px]">
            <div className="evaluation-form wide mx-auto max-w-[760px] scroll-mt-6 text-center min-[992px]:max-[1200px]:max-w-[480px] max-[992px]:max-w-[690px] max-[768px]:w-full max-[768px]:max-w-[600px] [&:has(.results-step)]:max-w-full">
              {profile.gender && (
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
    </ConsultationProvider>
  );
}
