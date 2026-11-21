/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import localFont from "next/font/local";
import { asset } from "@/lib/assets";
import { clinicPhone } from "@/lib/contact";
import type { Profile } from "@/lib/evaluation";
import {
  consultationConcerns,
  consultationStages,
  validateConsultation,
  type ConsultationValues,
} from "@/lib/consultation";
import { HairStageIllustration } from "./hair-stage-illustration";

const outfit = localFont({
  src: "../../app/fonts/outfit-variable.ttf",
  weight: "100 900",
  display: "swap",
});
const fieldClass =
  "h-11 w-full min-w-0 rounded-[10px] border border-solid border-[#d1d5db] bg-white px-[14px] text-[14px] leading-5 text-[#3f3f3f] outline-none placeholder:text-[#9ca3af] focus:border-[#e10b0b] focus:ring-1 focus:ring-red-100 aria-invalid:border-red-500 max-[640px]:h-11 max-[640px]:text-[14px]";

export function ConsultationDialog({
  source,
  profile,
  onClose,
}: {
  source: string;
  profile: Profile;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [values, setValues] = useState<ConsultationValues>({
    fullName: profile.name,
    phone: profile.mobile,
    concern: "",
    pincode: "",
    hairLossStage: "",
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateConsultation>>(
    {},
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [failure, setFailure] = useState("");

  useEffect(() => {
    const modal = dialog.current;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      abort.current?.abort();
      modal?.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  function update(key: keyof ConsultationValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "error") setStatus("idle");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading" || status === "success") return;
    const validation = validateConsultation(values);
    setErrors(validation);
    if (Object.keys(validation).length) {
      requestAnimationFrame(() =>
        dialog.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setStatus("loading");
    setFailure("");
    const controller = new AbortController();
    abort.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const stage = consultationStages.find(
        (item) => item.id === values.hairLossStage,
      )!;
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          source: "Consultation Modal",
          name: values.fullName.trim(),
          phone: values.phone,
          email: profile.email,
          age: profile.age,
          gender: profile.gender,
          concern: `${values.concern} | Pincode: ${values.pincode} | Hair loss stage: ${stage.label} | Opened from: ${source}`,
          answers: {
            consultation: {
              concern: values.concern,
              pincode: values.pincode,
              hairLossStage: stage.id,
              hairLossStageLabel: stage.label,
              trigger: source,
            },
          },
          pageUrl: window.location.href,
        }),
      });
      const result = await response.json();
      const saved =
        result.database === "saved" ||
        result.excel === "synced" ||
        result.telecrm?.synced === true;
      if (!response.ok || !result.success || !saved)
        throw new Error("Submission was not confirmed.");
      // Submitted: reload into the dedicated thank-you page.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload is intended
      window.location.assign("/thank-you");
    } catch {
      if (!dialog.current?.open) return;
      setFailure(
        "We couldn't confirm your request. Please try again or call us.",
      );
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const error = (key: keyof ConsultationValues) =>
    errors[key] ? (
      <p
        id={`consultation-${key}-error`}
        className="mt-1 text-[12px] leading-4 text-red-600"
      >
        {errors[key]}
      </p>
    ) : null;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="consultation-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`${outfit.className} fixed inset-0 m-auto max-h-[calc(100dvh-30px)] w-[calc(100%-88px)] max-w-[1100px] overflow-visible border-0 bg-transparent p-0 text-[#3f3f3f] backdrop:bg-black/70 max-[900px]:w-[calc(100%-24px)]`}
    >
      <button
        type="button"
        aria-label="Close consultation form"
        onClick={onClose}
        className="absolute -top-3 -right-3 z-10 flex size-8 items-center justify-center rounded-full border-2 border-solid border-[#e10b0b] bg-white text-[21px] leading-none font-bold text-[#e10b0b] shadow-[0_2px_8px_#0003] transition hover:bg-[#e10b0b] hover:text-white max-[900px]:-top-2 max-[900px]:-right-2 max-[900px]:size-8"
      >
        &times;
      </button>
      <div className="flex max-h-[calc(100dvh-30px)] overflow-y-auto rounded-[16px] border-[8px] border-solid border-[#e10b0b] bg-white shadow-2xl max-[900px]:rounded-[16px] max-[900px]:border-[6px]">
        <aside
          className="relative hidden w-[35%] shrink-0 bg-[#f3f4f6] min-[900px]:block"
          aria-label="Special offers for online bookings"
        >
          <img
            src={asset("consultation-offer.png")}
            width="1024"
            height="1306"
            alt="Special Offers for Online Bookings! Book consultation worth ₹699, now ₹0. Limited Period Offer."
            className="absolute inset-0 h-full w-full object-contain"
          />
        </aside>
        <section className="min-w-0 w-[65%] px-5 pt-5 pb-4 max-[900px]:w-full max-[640px]:px-3 max-[640px]:pt-5 max-[640px]:pb-4">
          <h2
            id="consultation-title"
            className="mb-[14px] text-center text-[21px] leading-[26px] font-bold text-[#3f3f3f] max-[640px]:text-[18px] max-[640px]:leading-[24px]"
          >
            Book <span className="text-[#e10b0b]">Hair Consultation</span> With
            Trichologist
          </h2>
          {status === "success" ? (
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
              <h3 className="text-[20px] font-bold">
                Thank you, {values.fullName.trim()}!
              </h3>
              <p className="max-w-[380px] text-[15px] leading-[22px]">
                We&apos;ve received your consultation request. Our team will
                contact you to arrange your appointment.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[10px] bg-[#e10b0b] px-6 py-2.5 text-[14px] font-bold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={submit}
              aria-label="Book hair consultation"
              aria-busy={status === "loading"}
            >
              <fieldset disabled={status === "loading"}>
                <legend className="sr-only">Consultation details</legend>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-[640px]:grid-cols-1 max-[640px]:gap-3">
                  <div>
                    <label className="sr-only" htmlFor="consultation-name">
                      Full Name
                    </label>
                    <input
                      id="consultation-name"
                      autoFocus
                      autoComplete="name"
                      name="name"
                      placeholder="Full Name"
                      value={values.fullName}
                      onChange={(event) =>
                        update("fullName", event.target.value)
                      }
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={
                        errors.fullName
                          ? "consultation-fullName-error"
                          : undefined
                      }
                      required
                      className={fieldClass}
                    />
                    {error("fullName")}
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="consultation-phone">
                      Phone Number
                    </label>
                    <input
                      id="consultation-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      name="phone"
                      placeholder="Phone Number"
                      value={values.phone}
                      maxLength={10}
                      onChange={(event) =>
                        update(
                          "phone",
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "consultation-phone-error" : undefined
                      }
                      required
                      className={fieldClass}
                    />
                    {error("phone")}
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="consultation-concern">
                      What Are Your Concerns
                    </label>
                    <div className="relative">
                      <select
                        id="consultation-concern"
                        name="concern"
                        value={values.concern}
                        onChange={(event) =>
                          update("concern", event.target.value)
                        }
                        aria-invalid={Boolean(errors.concern)}
                        aria-describedby={
                          errors.concern
                            ? "consultation-concern-error"
                            : undefined
                        }
                        required
                        className={`${fieldClass} appearance-none pr-10 ${values.concern ? "" : "text-[#9ca3af]!"}`}
                      >
                        <option value="" disabled>
                          What Are Your Concerns
                        </option>
                        {consultationConcerns.map((concern) => (
                          <option key={concern} value={concern}>
                            {concern}
                          </option>
                        ))}
                      </select>
                      <span
                        className="pointer-events-none absolute top-1/2 right-[18px] -translate-y-1/2 text-[15px] leading-none text-[#e10b0b]"
                        aria-hidden="true"
                      >
                        ▼
                      </span>
                    </div>
                    {error("concern")}
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="consultation-pincode">
                      6-Digit Pincode
                    </label>
                    <input
                      id="consultation-pincode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      name="pincode"
                      placeholder="6-Digit Pincode"
                      maxLength={6}
                      value={values.pincode}
                      onChange={(event) =>
                        update(
                          "pincode",
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      aria-invalid={Boolean(errors.pincode)}
                      aria-describedby={
                        errors.pincode
                          ? "consultation-pincode-error"
                          : undefined
                      }
                      required
                      className={fieldClass}
                    />
                    {error("pincode")}
                  </div>
                </div>
                <fieldset
                  className="mt-4"
                  aria-describedby={
                    errors.hairLossStage
                      ? "consultation-hairLossStage-error"
                      : undefined
                  }
                >
                  <legend className="mb-1 text-[14px] leading-[18px] font-medium text-black">
                    Select Your Hair Loss Stage{" "}
                    <span className="text-[#e10b0b]">*</span>
                  </legend>
                  <div className="grid grid-cols-5 gap-2 max-[640px]:gap-1">
                    {consultationStages.map((stage, index) => (
                      <label
                        key={stage.id}
                        className={`relative min-w-0 cursor-pointer rounded border-2 border-solid p-1 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#e10b0b] ${values.hairLossStage === stage.id ? "border-[#e10b0b] bg-red-50" : "border-[#e5e7eb] bg-white hover:border-red-300"}`}
                      >
                        <input
                          type="radio"
                          name="consultation-hair-stage"
                          value={stage.id}
                          checked={values.hairLossStage === stage.id}
                          onChange={() => update("hairLossStage", stage.id)}
                          required
                          aria-invalid={Boolean(errors.hairLossStage)}
                          className="sr-only"
                        />
                        <HairStageIllustration index={index} />
                        <span className="block text-center text-[10px] leading-[13px] font-normal text-black max-[640px]:text-[9px] max-[640px]:leading-3">
                          {stage.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {error("hairLossStage")}
                </fieldset>
                {status === "error" && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg bg-red-50 p-3 text-[14px] leading-5 text-red-700"
                  >
                    {failure}{" "}
                    <a
                      href={clinicPhone.href}
                      className="font-semibold underline"
                    >
                      {clinicPhone.display}
                    </a>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-4 min-h-12 w-full cursor-pointer rounded-[10px] bg-[#e10b0b] px-4 py-3 text-[16px] leading-6 font-bold text-white shadow-[0_4px_12px_rgba(225,11,11,0.3)] transition hover:bg-[#c90a0a] disabled:cursor-wait disabled:opacity-70 max-[640px]:min-h-12 max-[640px]:text-[15px]"
                >
                  {status === "loading"
                    ? "Submitting..."
                    : "Book Your Appointment Now"}
                </button>
              </fieldset>
            </form>
          )}
          <div className="mt-3 border-t border-solid border-[#e5e7eb] pt-[14px]">
            <img
              src={asset("consultation-badges.png")}
              width="698"
              height="188"
              alt="Google Reviews, 100% Satisfaction Guaranteed, FDA Approved"
              className="mx-auto block h-[60px] w-full max-w-[360px] object-contain max-[640px]:h-[52px]"
            />
          </div>
        </section>
      </div>
    </dialog>
  );
}
