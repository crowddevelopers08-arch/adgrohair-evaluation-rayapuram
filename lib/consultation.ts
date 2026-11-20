export const consultationConcerns = [
  "Hair Fall",
  "Dandruff",
  "Thin Hair",
  "Bald Patches",
  "Receding Hairline",
  "Alopecia",
] as const;

export const consultationStages = [
  {
    id: "stage1",
    label: "S1 - Minimal hair loss",
  },
  {
    id: "stage2",
    label: "S2 - Mild receding",
  },
  {
    id: "stage3",
    label: "S3 - Moderate thinning",
  },
  {
    id: "stage4",
    label: "S4 - Significant loss",
  },
  {
    id: "stage5",
    label: "S5 - Advanced balding",
  },
] as const;

export type ConsultationValues = {
  fullName: string;
  phone: string;
  concern: string;
  pincode: string;
  hairLossStage: string;
};

export function validateConsultation(values: ConsultationValues) {
  const errors: Partial<Record<keyof ConsultationValues, string>> = {};
  if (values.fullName.trim().length < 2)
    errors.fullName = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(values.phone))
    errors.phone = "Enter a valid 10-digit phone number.";
  if (!consultationConcerns.some((concern) => concern === values.concern))
    errors.concern = "Please select your concern.";
  if (!/^[1-9]\d{5}$/.test(values.pincode))
    errors.pincode = "Enter a valid 6-digit pincode.";
  if (!consultationStages.some((stage) => stage.id === values.hairLossStage))
    errors.hairLossStage = "Please select your hair loss stage.";
  return errors;
}
