"use client";
import { useRef } from "react";

export type LeadView = {
  name: string;
  date: string;
  fields: { label: string; value: string }[];
  qa: { question: string; answers: string[] }[];
  medicalDetail?: string;
};

export function LeadDetails({ lead }: { lead: LeadView }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="rounded-full border border-brand px-3 py-1 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
      >
        View
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto max-h-[88vh] w-[min(640px,94vw)] overflow-y-auto rounded-2xl p-0 text-[#3f3f46] shadow-2xl backdrop:bg-black/50"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-brand-border bg-brand-soft px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-brand">{lead.name}</h2>
            <p className="text-xs">{lead.date}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => ref.current?.close()}
            className="text-2xl leading-none text-brand-dark"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">
          <h3 className="text-xs font-bold tracking-wide text-brand uppercase">
            Contact &amp; profile
          </h3>
          <dl className="mt-2 grid grid-cols-[120px_1fr] gap-x-3 gap-y-1.5 text-sm">
            {lead.fields.map((f) => (
              <div key={f.label} className="contents">
                <dt className="text-[#768394]">{f.label}</dt>
                <dd className="font-semibold break-words text-brand-dark">{f.value}</dd>
              </div>
            ))}
          </dl>

          {lead.qa.length > 0 && (
            <>
          <h3 className="mt-6 text-xs font-bold tracking-wide text-brand uppercase">
            Questionnaire answers
          </h3>
          <ol className="mt-2 space-y-3">
            {lead.qa.map((item, i) => (
              <li key={i} className="rounded-xl border border-brand-border p-3 text-sm">
                <p className="font-semibold text-brand-dark">
                  Q{i + 1}. {item.question}
                </p>
                <p className="mt-1">
                  {item.answers.length ? item.answers.join(", ") : "Not answered"}
                </p>
              </li>
            ))}
          </ol>
            </>
          )}
          {lead.medicalDetail && (
            <p className="mt-3 rounded-xl bg-brand-soft p-3 text-sm">
              <b>Medical condition details:</b> {lead.medicalDetail}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
