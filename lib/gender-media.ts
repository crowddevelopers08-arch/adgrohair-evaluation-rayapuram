import type { Gender } from "./evaluation";

// Keep patient imagery in one place so every selected-gender section agrees.
// Result pairs are sourced from the reference site's corresponding male/female
// pattern-baldness pages; they are reference examples, not Adglow patient records.
export const genderMedia = {
  male: {
    portrait: "offer-image-3.webp",
    portraitAlt: "Male hair treatment portrait",
    results: [
      {
        before: "male-result-1-before.webp",
        after: "male-result-1-after.webp",
      },
      {
        before: "male-result-2-before.webp",
        after: "male-result-2-after.webp",
      },
    ],
  },
  female: {
    portrait: "offer-image-2.webp",
    portraitAlt: "Female hair treatment portrait",
    results: [
      {
        before: "female-result-1-before.webp",
        after: "female-result-1-after.webp",
      },
      {
        before: "female-result-2-before.webp",
        after: "female-result-2-after.webp",
      },
    ],
  },
} satisfies Record<
  Gender,
  {
    portrait: string;
    portraitAlt: string;
    results: { before: string; after: string }[];
  }
>;
