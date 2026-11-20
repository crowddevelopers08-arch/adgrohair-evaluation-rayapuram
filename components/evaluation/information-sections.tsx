"use client";
import { useState } from "react";
import { InformationCopy } from "./information-copy";
const faqs: { title: string; answer?: string; items?: string[] }[] = [
  {
    title: "Tell Us About Your Hair",
    answer:
      "Answer questions about your current hair fall, thinning, scalp condition, and how long you've been experiencing the concern.",
  },
  {
    title: "Share Your Hair History",
    answer:
      "Your responses help create a clearer picture of your hair concerns and the changes you've noticed over time.",
  },
  {
    title: "Get Your Hair Health Insights",
    answer:
      "Once you've completed the assessment, you'll receive insights based on the information you've provided.",
  },
  {
    title: "Know What To Do Next",
    answer:
      "If your concerns have been persistent, the results can help you understand whether it's time to speak with a hair specialist for a detailed evaluation.",
  },
  {
    title: "What You Get From The Evaluation",
    items: [
      "A simple online hair assessment",
      "Insights based on your current concerns",
      "Better understanding of your hair-loss pattern",
      "Identification of concerns that may need attention",
      "Guidance on whether professional evaluation may be useful",
      "A convenient way to start from home",
    ],
  },
];
export function InformationSections() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="information-sections mt-12 text-[18px] leading-[1.7] text-[#656565] [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:font-medium [&_h2]:text-brand [&_p]:mb-2 [&_li]:mb-2 [&_ul]:mt-0 [&_ul]:mb-4 [&_ul]:pl-10 [&_ol]:mt-0 [&_ol]:mb-4 [&_ol]:pl-10 [&_b]:font-medium [&_a]:text-brand [&_h3]:mt-0 [&_h3]:mb-1 [&_h3]:text-[18px] [&_h3]:font-normal max-[768px]:px-[15px] max-[768px]:[&_ul]:pl-[30px] max-[768px]:[&_ol]:pl-[30px]">
      <InformationCopy />
      <section className="faqs mt-12 [&_h2]:mb-5" aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQ</h2>
        <h3 className="!mb-1 !text-[22px] !font-medium text-brand">
          A Few Questions Can Tell You More About Your Hair
        </h3>
        <p className="mb-4">The evaluation is designed to be simple.</p>
        {faqs.map((faq, index) => (
          <div
            className="faq-item [&.faq-item_h3]:m-0 [&.faq-item_h3]:font-medium [&_button]:flex [&_button]:min-h-12 [&_button]:w-full [&_button]:items-center [&_button]:gap-3 [&_button]:[background:none] [&_button]:p-0 [&_button]:text-left [&_button]:text-[18px] [&_button]:font-medium [&_button]:text-[#656565] [&>div]:pt-2.5 [&>div]:px-[35px] [&>div]:pb-[15px] [&>div_p]:mb-2 max-[768px]:[&>div]:pr-0"
            key={faq.title}
          >
            <h3>
              <button
                aria-expanded={open === index}
                aria-controls={`faq-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span
                  className="faq-symbol inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-solid border-[#788795] text-[20px] text-[#788795]"
                  aria-hidden="true"
                >
                  {open === index ? "−" : "+"}
                </span>
                {faq.title}
              </button>
            </h3>
            <div id={`faq-${index}`} hidden={open !== index}>
              {faq.answer && <p>{faq.answer}</p>}
              {faq.items && (
                <ul className="!mb-0 !list-none !pl-0">
                  {faq.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="font-bold text-brand" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
