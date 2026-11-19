/* eslint-disable @next/next/no-img-element */
import type { Gender } from "@/lib/evaluation";
import { genderMedia } from "@/lib/gender-media";
import { asset } from "@/lib/assets";

export function TreatmentResults({ gender }: { gender: Gender }) {
  return (
    <div
      className="treatment-results grid w-full grid-cols-1 items-start gap-5 min-[768px]:grid-cols-2"
      data-gender={gender}
      aria-label={`${gender === "male" ? "Male" : "Female"} before and after treatment examples`}
    >
      {genderMedia[gender].results.map((pair, index) => (
        <figure
          key={pair.before}
          className="m-0 min-w-0 w-full overflow-hidden rounded-xl border border-solid border-brand-border bg-white"
        >
          <div className="grid grid-cols-2 gap-px bg-brand-border">
            {(["before", "after"] as const).map((stage) => (
              <div key={stage} className="min-w-0 bg-white">
                <img
                  src={asset(pair[stage])}
                  alt={`${gender === "male" ? "Male" : "Female"} hair treatment example ${index + 1}, ${stage} treatment`}
                  className="block h-auto w-full object-contain"
                  width="587"
                  height="391"
                />
                <p className="py-3 text-[13px] font-semibold text-brand-dark uppercase">
                  {stage}
                </p>
              </div>
            ))}
          </div>
          <figcaption className="border-t border-solid border-brand-border py-3 text-[14px] text-[#656565]">
            {gender === "male" ? "Male" : "Female"} hair treatment result{" "}
            {index + 1}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
