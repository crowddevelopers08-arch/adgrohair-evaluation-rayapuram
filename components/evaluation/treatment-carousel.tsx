/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Gender } from "@/lib/evaluation";
import { genderMedia } from "@/lib/gender-media";
import { asset } from "@/lib/assets";
import { hairTreatments } from "@/lib/treatments";

const treatments = hairTreatments;

const INTERVAL = 3500;

export function TreatmentCarousel({ gender }: { gender: Gender }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [active, setActive] = useState(0);
  const media = genderMedia[gender];

  const cardStep = () => {
    const first = track.current?.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    return first.offsetWidth + 25; // card width + gap
  };

  const goTo = useCallback((index: number) => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    el.scrollTo({ left: index * (first.offsetWidth + 25), behavior: "smooth" });
  }, []);

  // Auto-advance one card at a time, looping back to the first.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const el = track.current;
      if (!el || paused.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: cardStep(), behavior: "smooth" });
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  // Keep the dots in sync with whatever the user / autoplay scrolled to.
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const step = cardStep() || 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setActive(
      atEnd ? treatments.length - 1 : Math.round(el.scrollLeft / step),
    );
  };

  return (
    <div
      className="treatment-carousel"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => window.setTimeout(() => (paused.current = false), 4000)}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-[25px] overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {treatments.map((t) => (
          <article
            key={t.name}
            className="w-[calc(33.333%-17px)] min-w-[280px] shrink-0 snap-start border-4 border-solid border-white bg-[#f5f5f5] p-5 max-[768px]:w-[85%]"
          >
            <img
              className="w-full"
              src={asset(media.portrait)}
              alt={`${media.portraitAlt} - ${t.name}`}
            />
            <div className="bg-[#efefef] px-2.5 py-3 text-[22px] font-bold text-brand-dark">
              {t.name}
            </div>
            <p className="px-1 pt-4 text-[17px] leading-[24px] font-bold text-brand">
              {t.title}
            </p>
            <p className="px-1 pt-2 text-[14px] leading-[22px]">{t.description}</p>
            <p className="px-1 py-4 text-[15px] leading-[25px] font-bold text-[#231f20]">
              <span className="block text-[14px] font-semibold text-[#656565]">
                Results
              </span>
              <strong className="block text-[20px]">{t.results}</strong>
            </p>
          </article>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2" aria-label="Treatments">
        {treatments.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Show ${t.name}`}
            aria-current={active === i}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-brand" : "w-2.5 bg-[#d9c9c7]"}`}
          />
        ))}
      </div>
      <p className="mt-4 text-[13px] text-[#656565]">
        <b>Disclaimer:</b> Results may vary depending on the individual and other
        factors.
      </p>
    </div>
  );
}
