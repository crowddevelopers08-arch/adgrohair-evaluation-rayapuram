/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import type { Gender } from "@/lib/evaluation";
import { genderMedia } from "@/lib/gender-media";
import { asset } from "@/lib/assets";

const INTERVAL = 3500;

export function TreatmentResults({ gender }: { gender: Gender }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);
  const results = genderMedia[gender].results;

  // On narrow screens the cards form a swipeable row; move it automatically.
  // On desktop both cards fit side by side, so nothing needs to move.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const el = track.current;
      if (!el || paused.current || el.scrollWidth <= el.clientWidth + 4) return;
      const first = el.firstElementChild as HTMLElement | null;
      const step = (first?.offsetWidth ?? el.clientWidth) + 20;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [gender]);

  const onScroll = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setActive(
      atEnd ? results.length - 1 : Math.round(el.scrollLeft / (first.offsetWidth + 20)),
    );
  };

  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => window.setTimeout(() => (paused.current = false), 4000)}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="treatment-results flex w-full snap-x snap-mandatory items-start gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] min-[768px]:grid min-[768px]:grid-cols-2 min-[768px]:overflow-visible [&::-webkit-scrollbar]:hidden"
        data-gender={gender}
        aria-label={`${gender === "male" ? "Male" : "Female"} before and after treatment examples`}
      >
        {results.map((pair, index) => (
          <figure
            key={pair.before}
            className="m-0 w-[88%] min-w-0 shrink-0 snap-start overflow-hidden rounded-xl border border-solid border-brand-border bg-white min-[768px]:w-full"
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
      <div className="mt-3 flex justify-center gap-2 min-[768px]:hidden">
        {results.map((pair, i) => (
          <button
            key={pair.before}
            type="button"
            aria-label={`Show result ${i + 1}`}
            aria-current={active === i}
            onClick={() => {
              const el = track.current;
              const first = el?.firstElementChild as HTMLElement | null;
              if (el && first)
                el.scrollTo({ left: i * (first.offsetWidth + 20), behavior: "smooth" });
            }}
            className={`h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-brand" : "w-2.5 bg-[#d9c9c7]"}`}
          />
        ))}
      </div>
    </div>
  );
}
