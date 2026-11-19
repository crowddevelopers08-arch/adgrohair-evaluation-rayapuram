"use client";
import { useState } from "react";
import { InformationCopy } from "./information-copy";
const faqs = [
  {
    title: "How accurate is the hair test?",
    answer:
      "Our online hair analysis tool provides reliable results based on your answers, ensuring a thorough evaluation of your hair and scalp health.",
  },
  {
    title: "Can I take the test multiple times?",
    answer:
      "Yes! You can retake the hair loss evaluation test as many times as you need to track your progress.",
  },
  {
    title: "Is the test free?",
    answer:
      "Absolutely! The free online hair analysis test allows you to assess your hair health without commitment or cost.",
    extra:
      "We understand how concerning hair health issues can be and are here to help you resolve them and open doors to broader treatment options. In just a few minutes, you can take our Hair Evaluation Test to gain valuable insights into your hair condition.",
  },
  {
    title: "Is Adglow Hair Test free?",
    answer:
      "We offer a basic hair analysis test online free of charge. For a more comprehensive evaluation and personalised homeopathic treatment plan, you can book an appointment from our website or call us at ",
  },
];
export function InformationSections() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="information-sections mt-12 text-[18px] leading-[1.7] text-[#656565] [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:font-medium [&_h2]:text-brand [&_p]:mb-2 [&_li]:mb-2 [&_ul]:mt-0 [&_ul]:mb-4 [&_ul]:pl-10 [&_ol]:mt-0 [&_ol]:mb-4 [&_ol]:pl-10 [&_b]:font-medium [&_a]:text-brand [&_h3]:mt-0 [&_h3]:mb-1 [&_h3]:text-[18px] [&_h3]:font-normal max-[768px]:px-[15px] max-[768px]:[&_ul]:pl-[30px] max-[768px]:[&_ol]:pl-[30px]">
      <InformationCopy />
      <section className="faqs mt-12 [&_h2]:mb-5" aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQs</h2>
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
              <p>{faq.answer}</p>
              {faq.extra && <p>{faq.extra}</p>}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
