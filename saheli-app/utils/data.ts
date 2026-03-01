// Types
export interface SymptomEntry {
  id: string;
  symptoms: string[];
  severity: number;
  timestamp: string;
}

export interface ScreeningEntry {
  id: string;
  type: "nail_analysis" | "symptom_track";
  condition: string;
  risk: "Low" | "Medium" | "High";
  confidence: number;
  tests: TestRecommendation[];
  imageUri?: string;
  timestamp: string;
  answers?: QuestionnaireAnswers;
}

export interface TestRecommendation {
  name: string;
  description: string;
  icon: string;
}

export interface DailyLog {
  [date: string]: {
    mood?: number;
    energy?: number;
    cycle?: boolean;
    hydration?: number;
    sleep?: number;
  };
}

export interface AssessmentData {
  dob: string;
  maritalStatus: string;
  bloodGroup: string;
  occupation: string;
  height: string;
  weight: string;
  activityLevel: string;
  dietType: string;
  waterIntake: string;
  medicalConditions: string[];
  currentSymptoms: string[];
  vitaminDeficiencies: string[];
  lastPeriodDate: string;
  avgCycleLength: string;
  periodRegularity: string;
  bleedingDuration: string;
  periodFlow: string;
  familyHistory: string[];
  stressLevel: number;
  sleepHours: string;
  alcohol: boolean;
  smoking: boolean;
  primaryGoal: string;
  cravings: string;
  moodSwings: string;
  periodAcne: string;
  periodActiveness: string;
  periodCramps: string;
}

// ─── Questionnaire Types ───
export interface QuestionOption {
  label: string;
  value: string;
  score: number; // 0 = healthy, higher = more concerning
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  emoji: string;
  questions: Question[];
}

export type QuestionnaireAnswers = Record<string, string>; // questionId -> selected value

// ─── Questionnaire Data ───
export const QUESTIONNAIRE_SECTIONS: QuestionnaireSection[] = [
  {
    id: "fatigue",
    title: "Fatigue & Energy",
    emoji: "😴",
    questions: [
      {
        id: "q_tired",
        text: "How often do you feel tired or weak?",
        options: [
          { label: "Never", value: "never", score: 0 },
          { label: "Sometimes", value: "sometimes", score: 1 },
          { label: "Often", value: "often", score: 2 },
          { label: "Almost always", value: "always", score: 3 },
        ],
      },
      {
        id: "q_exhausted_sleep",
        text: "Do you feel exhausted even after adequate sleep?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Occasionally", value: "occasionally", score: 1 },
          { label: "Frequently", value: "frequently", score: 3 },
        ],
      },
    ],
  },
  {
    id: "dizziness",
    title: "Dizziness & Head Symptoms",
    emoji: "🧠",
    questions: [
      {
        id: "q_dizzy",
        text: "Do you experience dizziness or lightheadedness?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Rarely", value: "rarely", score: 1 },
          { label: "Sometimes", value: "sometimes", score: 2 },
          { label: "Frequently", value: "frequently", score: 3 },
        ],
      },
      {
        id: "q_headaches",
        text: "Do you get headaches often?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Occasionally", value: "occasionally", score: 1 },
          { label: "Frequently", value: "frequently", score: 3 },
        ],
      },
    ],
  },
  {
    id: "heart",
    title: "Heart & Breathing",
    emoji: "❤️",
    questions: [
      {
        id: "q_breath",
        text: "Do you feel shortness of breath during normal activity?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Mild", value: "mild", score: 1 },
          { label: "Moderate", value: "moderate", score: 2 },
          { label: "Severe", value: "severe", score: 3 },
        ],
      },
      {
        id: "q_palpitations",
        text: "Do you notice rapid heartbeat or palpitations?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Sometimes", value: "sometimes", score: 1 },
          { label: "Frequently", value: "frequently", score: 3 },
        ],
      },
    ],
  },
  {
    id: "appearance",
    title: "Skin, Nails & Appearance",
    emoji: "👁️",
    questions: [
      {
        id: "q_pale",
        text: "Have you noticed pale skin, lips, or inner eyelids?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Slightly", value: "slightly", score: 1 },
          { label: "Very pale", value: "very_pale", score: 3 },
        ],
      },
      {
        id: "q_nails",
        text: "Are your nails brittle or spoon-shaped?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Yes", value: "yes", score: 3 },
          { label: "Not sure", value: "not_sure", score: 1 },
        ],
      },
      {
        id: "q_hairfall",
        text: "Do you experience hair fall?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Mild", value: "mild", score: 1 },
          { label: "Severe", value: "severe", score: 3 },
        ],
      },
    ],
  },
  {
    id: "diet",
    title: "Diet & Nutrition",
    emoji: "🍽️",
    questions: [
      {
        id: "q_iron_foods",
        text: "How often do you eat iron-rich foods (green vegetables, beans, meat, jaggery)?",
        options: [
          { label: "Daily", value: "daily", score: 0 },
          { label: "3–4 times/week", value: "moderate", score: 1 },
          { label: "Rarely", value: "rarely", score: 2 },
          { label: "Never", value: "never", score: 3 },
        ],
      },
      {
        id: "q_diet_type",
        text: "Are you vegetarian or vegan?",
        options: [
          { label: "Non-vegetarian", value: "non_veg", score: 0 },
          { label: "Vegetarian", value: "vegetarian", score: 1 },
          { label: "Vegan", value: "vegan", score: 2 },
        ],
      },
      {
        id: "q_supplements",
        text: "Do you take iron supplements?",
        options: [
          { label: "Yes, regularly", value: "regularly", score: 0 },
          { label: "Sometimes", value: "sometimes", score: 1 },
          { label: "No", value: "no", score: 2 },
        ],
      },
    ],
  },
  {
    id: "menstrual",
    title: "Menstrual & Bleeding History",
    emoji: "🩸",
    questions: [
      {
        id: "q_flow",
        text: "How would you describe your menstrual flow?",
        options: [
          { label: "Light", value: "light", score: 0 },
          { label: "Normal", value: "normal", score: 0 },
          { label: "Heavy", value: "heavy", score: 2 },
          { label: "Very heavy", value: "very_heavy", score: 3 },
        ],
      },
      {
        id: "q_period_duration",
        text: "How long does your period usually last?",
        options: [
          { label: "< 3 days", value: "short", score: 0 },
          { label: "3–5 days", value: "normal", score: 0 },
          { label: "6–7 days", value: "long", score: 1 },
          { label: "More than 7 days", value: "very_long", score: 3 },
        ],
      },
      {
        id: "q_bleeding_between",
        text: "Do you experience bleeding between periods?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Occasionally", value: "occasionally", score: 1 },
          { label: "Frequently", value: "frequently", score: 3 },
        ],
      },
    ],
  },
  {
    id: "medical",
    title: "Medical History & Lab",
    emoji: "🏥",
    questions: [
      {
        id: "q_anemia_before",
        text: "Have you been diagnosed with anemia before?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Yes", value: "yes", score: 2 },
          { label: "Not sure", value: "not_sure", score: 1 },
        ],
      },
      {
        id: "q_chronic",
        text: "Do you have any chronic diseases?",
        options: [
          { label: "None", value: "none", score: 0 },
          { label: "Kidney disease", value: "kidney", score: 3 },
          { label: "Thyroid disorder", value: "thyroid", score: 2 },
          { label: "Diabetes", value: "diabetes", score: 2 },
          { label: "Other", value: "other", score: 1 },
        ],
      },
      {
        id: "q_surgery",
        text: "Have you recently had surgery or major blood loss?",
        options: [
          { label: "No", value: "no", score: 0 },
          { label: "Yes", value: "yes", score: 3 },
        ],
      },
      {
        id: "q_hemoglobin",
        text: "Do you know your recent Hemoglobin (Hb) level?",
        options: [
          { label: "Above 12 g/dL", value: "normal", score: 0 },
          { label: "10–12 g/dL", value: "mild_low", score: 1 },
          { label: "7–10 g/dL", value: "moderate_low", score: 2 },
          { label: "Below 7 g/dL", value: "severe_low", score: 3 },
          { label: "Don't know", value: "unknown", score: 0 },
        ],
      },
    ],
  },
];

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Old symptom list kept for backward compat
export const SYMPTOMS_LIST = [
  {
    id: "fatigue",
    name: "Fatigue",
    description: "General tiredness or low energy",
    icon: "bolt",
  },
  {
    id: "brittleness",
    name: "Brittleness",
    description: "Nails cracking or splitting easily",
    icon: "content-cut",
  },
  {
    id: "discoloration",
    name: "Discoloration",
    description: "Yellowing or white spots",
    icon: "palette",
  },
  {
    id: "ridges",
    name: "Ridges",
    description: "Vertical or horizontal lines",
    icon: "reorder",
  },
  {
    id: "hair_loss",
    name: "Hair Loss",
    description: "Unusual thinning or shedding",
    icon: "face",
  },
  {
    id: "irregular_periods",
    name: "Irregular Periods",
    description: "Missed or delayed cycles",
    icon: "calendar-today",
  },
  {
    id: "weight_gain",
    name: "Weight Gain",
    description: "Unexplained weight changes",
    icon: "monitor-weight",
  },
  {
    id: "acne",
    name: "Acne",
    description: "Breakouts on face or body",
    icon: "healing",
  },
  {
    id: "cold_intolerance",
    name: "Cold Intolerance",
    description: "Feeling cold more than usual",
    icon: "ac-unit",
  },
];

// Condition-to-test mapping (SRS Table)
const TEST_MAPPINGS: Record<string, TestRecommendation[]> = {
  Anemia: [
    {
      name: "Complete Blood Count (CBC)",
      description:
        "A complete blood count will confirm hemoglobin and ferritin levels.",
      icon: "biotech",
    },
    {
      name: "Hemoglobin Test",
      description: "Measures hemoglobin levels to detect iron deficiency.",
      icon: "science",
    },
  ],
  "Iron Deficiency": [
    {
      name: "Blood Test (CBC)",
      description:
        "A complete blood count will confirm hemoglobin and ferritin levels.",
      icon: "biotech",
    },
    {
      name: "Consult Physician",
      description:
        "Discuss these results with your GP to develop a personalized care plan.",
      icon: "medical-services",
    },
  ],
  PCOS: [
    {
      name: "Pelvic Ultrasound",
      description: "Ultrasound imaging to check for ovarian cysts.",
      icon: "monitor-heart",
    },
    {
      name: "LH & FSH Levels",
      description:
        "Hormone tests to assess luteinizing and follicle-stimulating hormones.",
      icon: "biotech",
    },
  ],
  "Thyroid Disorder": [
    {
      name: "TSH Test",
      description:
        "Thyroid-stimulating hormone test to evaluate thyroid function.",
      icon: "biotech",
    },
    {
      name: "T3 & T4 Levels",
      description: "Measures active thyroid hormones in the blood.",
      icon: "science",
    },
  ],
};

// ─── Mock AI Analysis (Questionnaire-based) ───
export function runMockAnalysis(
  answers: QuestionnaireAnswers,
  _legacySymptoms?: string[],
  _legacySeverity?: number,
): ScreeningEntry {
  // Score answers by category
  const categoryScores: Record<string, number> = {};
  let totalScore = 0;
  let maxPossible = 0;

  for (const section of QUESTIONNAIRE_SECTIONS) {
    let sectionScore = 0;
    let sectionMax = 0;
    for (const question of section.questions) {
      const selectedValue = answers[question.id];
      if (selectedValue) {
        const option = question.options.find((o) => o.value === selectedValue);
        if (option) {
          sectionScore += option.score;
        }
      }
      // Max score for this question
      sectionMax += Math.max(...question.options.map((o) => o.score));
    }
    categoryScores[section.id] = sectionScore;
    totalScore += sectionScore;
    maxPossible += sectionMax;
  }

  // Determine condition based on category patterns
  let condition = "Iron Deficiency";

  const fatigueScore = categoryScores["fatigue"] || 0;
  const dizzinessScore = categoryScores["dizziness"] || 0;
  const heartScore = categoryScores["heart"] || 0;
  const appearanceScore = categoryScores["appearance"] || 0;
  const dietScore = categoryScores["diet"] || 0;
  const menstrualScore = categoryScores["menstrual"] || 0;
  const medicalScore = categoryScores["medical"] || 0;

  // Check for thyroid indicators
  const hasThyroid = answers["q_chronic"] === "thyroid";
  const hasHairfall = answers["q_hairfall"] === "severe";

  // Check for PCOS indicators
  const hasMenstrualIssues = menstrualScore >= 4;
  const hasBleedingBetween = answers["q_bleeding_between"] === "frequently";

  // Check for severe anemia
  const hasLowHb =
    answers["q_hemoglobin"] === "moderate_low" ||
    answers["q_hemoglobin"] === "severe_low";
  const hasPreviousAnemia = answers["q_anemia_before"] === "yes";

  if (hasThyroid || (hasHairfall && fatigueScore >= 3)) {
    condition = "Thyroid Disorder";
  } else if (hasMenstrualIssues && hasBleedingBetween) {
    condition = "PCOS";
  } else if (hasLowHb || hasPreviousAnemia) {
    condition = "Anemia";
  } else if (
    fatigueScore >= 3 ||
    dizzinessScore >= 3 ||
    (dietScore >= 3 && appearanceScore >= 2)
  ) {
    condition = "Iron Deficiency";
  } else if (heartScore >= 3) {
    condition = "Anemia";
  }

  // Risk based on total score percentage
  const scorePercent = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
  let risk: "Low" | "Medium" | "High" = "Low";
  if (scorePercent > 50) risk = "High";
  else if (scorePercent > 25) risk = "Medium";

  // Confidence: higher when more questions answered
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUESTIONNAIRE_SECTIONS.reduce(
    (sum, s) => sum + s.questions.length,
    0,
  );
  const completionRatio = answeredCount / totalQuestions;
  const confidence = Math.floor(55 + completionRatio * 40);

  const tests = TEST_MAPPINGS[condition] || TEST_MAPPINGS["Iron Deficiency"];

  return {
    id: generateId(),
    type: "symptom_track",
    condition,
    risk,
    confidence,
    tests,
    timestamp: new Date().toISOString(),
    answers,
  };
}

// Health tips
export const HEALTH_TIPS = [
  "Nail ridges can sometimes indicate hydration levels or nutrient absorption. Remember to drink at least 2L of water today!",
  "Pale nail beds may suggest low iron levels. Include leafy greens and lentils in your diet.",
  "Brittle nails can be a sign of thyroid issues. A simple TSH blood test can help rule this out.",
  "Regular exercise can help balance hormones linked to PCOS. Even a 30-minute walk counts!",
  "Cold hands and fatigue together could suggest thyroid imbalance. Track your symptoms daily.",
  "Healthy nails grow about 3mm per month. Changes in growth rate can indicate health shifts.",
  "Vitamin B12 deficiency can cause nail discoloration. Consider a blood test if you notice changes.",
  "Getting 7-8 hours of sleep helps your body recover and maintain hormonal balance.",
];

export function getRandomTip(): string {
  return HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
}
