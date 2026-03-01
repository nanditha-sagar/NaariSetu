export const ACTIVITY_OPTIONS = ["Inactive", "Moderate", "Active"];
export const DIET_OPTIONS = ["Veg", "Non-veg", "Vegan"];
export const WATER_INTAKE_OPTIONS = ["< 1L", "1-2L", "2-3L", "3L+"];
export const BLOOD_GROUP_OPTIONS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
export const MARITAL_STATUS_OPTIONS = ["Single", "Married", "In Relationship"];
export const OCCUPATION_OPTIONS = [
  "Student",
  "Professional",
  "Homemaker",
  "Self-employed",
];
export const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Thyroid (Hypo)",
  "Thyroid (Hyper)",
  "Breast Cancer",
  "Hypertension (High BP)",
  "Anemia",
  "PCOS",
  "None",
];

export const VITAMIN_DEFICIENCIES = [
  "Vitamin A",
  "Vitamin B12",
  "Vitamin C",
  "Vitamin D",
  "Calcium",
  "Iron",
  "Magnesium",
  "None",
];

export const PERIOD_REGULARITY_OPTIONS = ["Yes", "Mostly", "No"];
export const BLEEDING_DURATION_OPTIONS = ["1-3", "4-6", "7+"];
export const PERIOD_FLOW_OPTIONS = ["Light", "Medium", "Heavy"];
export const SLEEP_HOURS_OPTIONS = ["4-5h", "5-6h", "7-8h", "8h+"];
export const CRAVINGS_OPTIONS = ["None", "Sweet", "Salty", "Spicy"];
export const MOOD_SWINGS_OPTIONS = ["Yes", "Mostly", "No"];
export const PERIOD_ACNE_OPTIONS = ["Yes", "No"];
export const PERIOD_ACTIVENESS_OPTIONS = ["Low", "Moderate", "High"];
export const PERIOD_CRAMPS_OPTIONS = ["None", "Mild", "Severe"];

export const PRIMARY_GOAL_OPTIONS = [
  "Improve energy",
  "Manage PCOS",
  "Weight loss",
  "Improve skin",
  "Balance hormones",
];

export const FAMILY_HISTORY_OPTIONS = [
  "Cancers (Breast/Ovarian)",
  "Diabetes (Type 2)",
  "Heart Disease",
];

export interface Symptom {
  id: string;
  label: string;
  icon: string;
}

export const CONDITION_SYMPTOMS_MAP: Record<string, Symptom[]> = {
  Diabetes: [
    { id: "urinary", label: "Frequent urination", icon: "wash" },
    { id: "thirst", label: "Excessive thirst", icon: "local-drink" },
  ],
  "Thyroid (Hypo)": [
    { id: "fatigue", label: "Fatigue", icon: "bedtime" },
    { id: "weight_gain", label: "Weight gain", icon: "trending-up" },
  ],
  "Thyroid (Hyper)": [
    { id: "weight_loss", label: "Weight loss", icon: "trending-down" },
    { id: "heart_beat", label: "Rapid heartbeat", icon: "favorite" },
  ],
  "Breast Cancer": [
    { id: "lump", label: "Lump in breast or underarm", icon: "adjust" },
    {
      id: "breast_size",
      label: "Change in breast size/shape",
      icon: "circles",
    },
  ],
  "Hypertension (High BP)": [
    { id: "headache", label: "Headache", icon: "error-outline" },
    { id: "dizzy", label: "Dizziness", icon: "rotate-left" },
  ],
  Anemia: [
    { id: "tiredness", label: "Extreme tiredness", icon: "bedtime" },
    { id: "pale_skin", label: "Pale skin", icon: "person" },
  ],
  PCOS: [
    { id: "irregular", label: "Irregular periods", icon: "event-busy" },
    { id: "hair_acne", label: "Excess facial hair or acne", icon: "face" },
  ],
};

export const DEFAULT_SYMPTOMS: Symptom[] = [
  { id: "fatigue", label: "Fatigue", icon: "bedtime" },
  { id: "bloat", label: "Bloating", icon: "cloud" },
  { id: "mood_general", label: "Mild Mood Changes", icon: "sentiment-neutral" },
  { id: "none_sym", label: "None", icon: "check-circle" },
];
