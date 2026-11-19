export type Gender = "male" | "female";
export type Profile = {
  name: string;
  mobile: string;
  email: string;
  age: string;
  gender: Gender | "";
};
export type Option = { value: string; label: string; image?: string };
export type Question = {
  title: string;
  options: Option[];
  multiple?: boolean;
  appearance?: "circle" | "comb" | "portrait";
  medical?: boolean;
};
const options = (...labels: string[]): Option[] =>
  labels.map((label, index) => ({ value: String(index + 1), label }));
export const ages = ["0-18", "18-25", "26-35", "36-45", "46-55", "55+"];
export const emptyProfile: Profile = {
  name: "",
  mobile: "",
  email: "",
  age: "",
  gender: "",
};
export function getQuestions(gender: Gender): Question[] {
  return [
    {
      title: "Since how long have you been experiencing hairfall?",
      options: options(
        "0-6 months",
        "6 months - 1 year",
        "1-3 years",
        "only hair thinning",
      ),
    },
    {
      title: "How many strands of hair do you loose everyday?",
      appearance: "comb",
      options: options("0-50", "50-100", "100+").map((o, i) => ({
        ...o,
        image: `comb-${i + 1}.webp`,
      })),
    },
    {
      title: "Do you have dandruff?",
      appearance: "circle",
      options: [
        { value: "1", label: "Dandruff", image: "dnf-3.webp" },
        { value: "2", label: "No dandruff", image: "dnf-2.webp" },
      ],
    },
    {
      title: "What image best describe your hair loss",
      appearance: "circle",
      options: Array.from({ length: 4 }, (_, i) => ({
        value: String(i + (gender === "male" ? 1 : 5)),
        label: `Hair loss pattern ${i + 1}`,
        image: `hair-${gender === "female" ? "f-" : ""}${i + 1}.webp`,
      })),
    },
    {
      title: "Does your lifestyle includes",
      multiple: true,
      options:
        gender === "male"
          ? options(
              "Hair color",
              "stress",
              "irregular eating habbits",
              "change of place & water",
              "smoking",
              "None of the above",
            )
          : options(
              "Chemical Treatments",
              "stress",
              "irregular eating/dieting",
              "irregular periods",
              "drastic weight change",
              "use of birth control pills",
            ),
    },
    {
      title: "Is hairloss affecting your self-confidence?",
      appearance: "portrait",
      options: options("Yes", "No").map((o, i) => ({
        ...o,
        image: `${gender === "male" ? "mp" : "fc"}${i + 1}.webp`,
      })),
    },
    {
      title: "Do you have family history of hair loss?",
      options: options(
        "Anyone from mother's side",
        "Anyone from father's side",
        "Both",
        "None",
      ),
    },
    {
      title: "Are you suffering from any medical condition?",
      medical: gender === "male",
      options:
        gender === "male"
          ? options("No", "Yes, Please mention")
          : options("PCOS/PCOD", "thyroid", "hormonal imbalance", "Other").map(
              (o, i) => ({ ...o, value: String(i + 3) }),
            ),
    },
    {
      title: "Are you currently on any hair suppliments?",
      options: options("Yes", "No"),
    },
    {
      title: "What are your major hair goals",
      multiple: true,
      options: options(
        "Regrow hair",
        "control hair fall",
        "improve hair quality",
        "delay greying",
        "maintain hair quality",
      ),
    },
  ];
}
export function toggleAnswer(
  current: string[],
  value: string,
  exclusiveNone = false,
): string[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (exclusiveNone && value === "6") return ["6"];
  return [...current.filter((item) => !exclusiveNone || item !== "6"), value];
}
export function validateContact(profile: Profile): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!profile.name.trim()) errors.name = "Required";
  if (!profile.mobile) errors.mobile = "Required";
  else if (!/^[6789]\d{9}$/.test(profile.mobile))
    errors.mobile = "Please Enter Valid Number";
  if (!profile.email.trim()) errors.email = "Required";
  else if (
    !/^[a-zA-Z0-9_.+\-]+@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/.test(
      profile.email.trim(),
    )
  )
    errors.email = "Please Enter Valid Email Id";
  return errors;
}
