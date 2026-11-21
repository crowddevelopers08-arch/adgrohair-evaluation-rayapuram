import { getQuestions, type Gender } from "./evaluation";

export type EvaluationAnswers = Record<number, string[]>;
export type HairEvaluationResult = {
  score: number;
  band: "needs-attention" | "some-concerns" | "fewer-concerns";
  message: string;
};

// Local, indicative questionnaire scoring, not Dr Batra's private scoring
// algorithm or a clinically validated measure. Higher scores indicate fewer
// reported concerns. Contact details, age, confidence, supplements and goals
// do not change the score. Equivalent male/female hair patterns score equally.
export const CONCERN_POINTS = {
  duration: { "1": 0, "2": 5, "3": 10, "4": 3 },
  shedding: { "1": 0, "2": 12, "3": 25 },
  dandruff: { "1": 10, "2": 0 },
  pattern: [0, 8, 17, 25],
  lifestylePerSelection: 2,
  lifestyleMaximum: 10,
  familyHistory: { "1": 5, "2": 5, "3": 10, "4": 0 },
  medical: { "1": 0, "2": 10, "3": 10, "4": 10, "5": 10, "6": 10 },
} as const;

export function calculateHairScore(
  gender: Gender,
  answers: EvaluationAnswers,
  medicalDetail = "",
): HairEvaluationResult {
  // A partial questionnaire must never produce a reassuring default score.
  getQuestions(gender).forEach((question, index) => {
    const selected = answers[index];
    const validValues = new Set(question.options.map((option) => option.value));
    if (
      !selected?.length ||
      (!question.multiple && selected.length !== 1) ||
      new Set(selected).size !== selected.length ||
      selected.some((value) => !validValues.has(value))
    ) {
      throw new Error(`A valid answer is required for question ${index + 1}.`);
    }
  });
  if (gender === "male" && answers[4].includes("6") && answers[4].length > 1) {
    throw new Error(
      '"None of the above" cannot be combined with lifestyle choices.',
    );
  }
  if (gender === "male" && answers[7][0] === "2" && !medicalDetail.trim()) {
    throw new Error("Please mention your medical condition.");
  }

  const points = (table: Record<string, number>, question: number) =>
    table[answers[question][0]];
  const patternIndex = Number(answers[3][0]) - (gender === "male" ? 1 : 5);
  const lifestyleCount = answers[4].filter(
    (value) => !(gender === "male" && value === "6"),
  ).length;
  const concerns =
    points(CONCERN_POINTS.duration, 0) +
    points(CONCERN_POINTS.shedding, 1) +
    points(CONCERN_POINTS.dandruff, 2) +
    CONCERN_POINTS.pattern[patternIndex] +
    Math.min(
      lifestyleCount * CONCERN_POINTS.lifestylePerSelection,
      CONCERN_POINTS.lifestyleMaximum,
    ) +
    points(CONCERN_POINTS.familyHistory, 6) +
    points(CONCERN_POINTS.medical, 7);
  const score = Math.max(0, Math.min(100, Math.round(100 - concerns)));

  return resultForScore(score);
}

/** Score band + message for a given score (also used by the saved score page). */
export function resultForScore(score: number): HairEvaluationResult {
  if (score < 40) {
    return {
      score,
      band: "needs-attention",
      message:
        "Based on your responses, we understand that your hair needs extra love, attention, and care. Hair conditions can be better assessed by a trichologist. However, in the meantime, keeping stress at bay, eating well, and acquiring treatment at the earliest can help you achieve flawless tresses.",
    };
  }
  if (score < 70) {
    return {
      score,
      band: "some-concerns",
      message:
        "Based on your responses, you have reported some hair and scalp concerns. A trichologist can assess your hair condition and discuss the concerns you shared in this evaluation.",
    };
  }
  return {
    score,
    band: "fewer-concerns",
    message:
      "Based on your responses, you have reported fewer hair and scalp concerns. This questionnaire cannot confirm your hair health. A trichologist can assess any hair changes or concerns you would like to discuss.",
  };
}
