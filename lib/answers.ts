import { getQuestions, type Gender } from "./evaluation";

/** Turns stored answer indexes/values into readable question + answer labels. */
export function readableAnswers(gender: string | null | undefined, answers: unknown) {
  const g: Gender = gender === "female" ? "female" : "male";
  const saved = (answers && typeof answers === "object" ? answers : {}) as Record<
    string,
    string[]
  >;
  return getQuestions(g).map((q, i) => ({
    question: q.title,
    answers: (Array.isArray(saved[i]) ? saved[i] : []).map(
      (v) => q.options.find((o) => o.value === v)?.label ?? v,
    ),
  }));
}

/** Details captured by the "Book Your Consultation" form (stored in answers.consultation). */
export function consultationDetails(answers: unknown) {
  const c =
    answers && typeof answers === "object"
      ? (answers as Record<string, unknown>).consultation
      : null;
  if (!c || typeof c !== "object") return null;
  const v = c as Record<string, unknown>;
  const text = (x: unknown) => (typeof x === "string" ? x : "");
  return [
    { label: "Concern", value: text(v.concern) },
    { label: "Pincode", value: text(v.pincode) },
    { label: "Hair loss stage", value: text(v.hairLossStageLabel) || text(v.hairLossStage) },
    { label: "Opened from", value: text(v.trigger) },
  ].filter((item) => item.value);
}
