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
