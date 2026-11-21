"use client";
import Link from "next/link";
import localFont from "next/font/local";
import type { Profile } from "@/lib/evaluation";
import { ConsultationProvider } from "./consultation-provider";
import { SiteHeader } from "../evaluation/site-header";
import { EvaluationBackdrop } from "../evaluation/evaluation-backdrop";

const outfit = localFont({
  src: "../../app/fonts/outfit-variable.ttf",
  weight: "100 900",
  display: "swap",
});

// Full-page version of the consultation popup's "Thank you" screen.
export function ThankYouPage({ name }: { name: string }) {
  const profile: Profile = { name, mobile: "", email: "", age: "", gender: "" };
  return (
    <ConsultationProvider profile={profile}>
      <SiteHeader />
      <main className="relative isolate min-h-[calc(100dvh-102px)] overflow-hidden bg-[#fffdfc] px-3 py-12 max-[992px]:min-h-[calc(100dvh-64px)]">
        <EvaluationBackdrop />
        <div
          className={`${outfit.className} mx-auto w-full max-w-[640px] rounded-[16px] border-[8px] border-solid border-[#e10b0b] bg-white px-5 pt-6 pb-5 text-[#3f3f3f] shadow-2xl max-[640px]:border-[6px]`}
        >
          <h1 className="mb-[14px] text-center text-[21px] leading-[26px] font-bold text-[#3f3f3f] max-[640px]:text-[18px] max-[640px]:leading-[24px]">
            Book <span className="text-[#e10b0b]">Hair Consultation</span> With
            Trichologist
          </h1>
          <div
            role="status"
            className="flex min-h-[310px] flex-col items-center justify-center gap-5 px-4 text-center"
          >
            <span
              className="flex size-16 items-center justify-center rounded-full bg-green-50 text-[36px] text-green-700"
              aria-hidden="true"
            >
              ✓
            </span>
            <h2 className="text-[20px] font-bold">Thank you, {name}!</h2>
            <p className="max-w-[380px] text-[15px] leading-[22px]">
              We&apos;ve received your consultation request. Our team will
              contact you to arrange your appointment.
            </p>
            <Link
              href="/"
              className="rounded-[10px] bg-[#e10b0b] px-6 py-2.5 text-[14px] font-bold text-white"
            >
              Done
            </Link>
          </div>
        </div>
      </main>
    </ConsultationProvider>
  );
}
