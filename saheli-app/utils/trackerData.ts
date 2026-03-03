import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Storage Keys ───
const KEYS = {
  ANEMIA_LOGS: "saheliAnemiaLogs",
  BP_LOGS: "saheliBPLogs",
  GLUCOSE_LOGS: "saheliGlucoseLogs",
  SKIN_LOGS: "saheliSkinLogs",
  MOOD_LOGS: "saheliMoodLogs",
  PERIOD_LOGS: "saheliPeriodLogs",
};

// ─── Types ───
export type Severity = "none" | "mild" | "moderate" | "severe";

export interface SymptomDef {
  id: string;
  label: string;
  icon: string;
}

export interface AnemiaLogEntry {
  date: string; // YYYY-MM-DD
  energyLevel: number; // 1-10
  breathlessness: "none" | "exercise" | "chores" | "resting";
  dizziness: "none" | "standing" | "constant" | "fainted";
  heartRate: "none" | "occasionally" | "constantly";
  pallor: "normal" | "slightly" | "very";
  coldExtremities: boolean;
  isOnPeriod: boolean;
  periodFlow?: "light" | "medium" | "heavy" | "very_heavy";
  pregnancySpotting?: boolean;
  stoolColorBlack: boolean;
  supplementUsage: "yes" | "no";
  hemoglobin?: number; // optional g/dL
  timestamp: string;
}

export interface AnemiaInsights {
  riskScore: number; // 0–100
  riskLevel: "Low" | "Medium" | "High";
  triageZone: "Green" | "Amber" | "Red";
  triageMessage: string;
  triageSuggestions: string[];
  trend: "Improving" | "Stable" | "Worsening" | "Not enough data";
  alerts: string[];
  weekAvg: number;
  prevWeekAvg: number;
}

export interface BPLogEntry {
  date: string; // YYYY-MM-DD
  systolic: number;
  diastolic: number;
  pulse: number;
  position: "Sitting" | "Standing" | "Lying Down";
  arm: "Left" | "Right";
  rested5Min: boolean;
  headache: "none" | "mild" | "severe" | "thunderclap";
  vision: "normal" | "blurry" | "spots";
  chestBreathing: "none" | "shortness" | "pain";
  neurological: "none" | "weakness_diff_speaking";
  highSalt: boolean;
  tookMeds: boolean;
  stressLevel: number; // 1-10
  isPregnant: boolean;
  preeclampsiaSwelling?: boolean;
  preeclampsiaBellyPain?: boolean;
  notes?: string;
  timestamp: string;
}

export interface BPInsights {
  riskScore: number; // 0–100 mapping
  riskLevel: "Optimal" | "Elevated" | "High" | "Crisis" | "Low";
  category: "Normal" | "Elevated" | "Stage 1" | "Stage 2" | "Crisis" | "Low";
  triageZone: "Green" | "Yellow" | "Orange" | "Red";
  triageMessage: string;
  triageSuggestions: string[];
  trend: "Improving" | "Stable" | "Worsening" | "Not enough data";
  alerts: string[];
  weekAvg: {
    systolic: number;
    diastolic: number;
    pulse: number;
  };
  dailyAvg: {
    systolic: number;
    diastolic: number;
  };
}

// ─── Glucose Types ───
export type GlucoseTiming =
  | "fasting"
  | "before_meal"
  | "after_meal_1h"
  | "after_meal_2h"
  | "random";
export type GlucoseSource = "glucometer" | "lab" | "cgm";

export interface GlucoseLogEntry {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  value: number; // mg/dL
  unit: "mg/dL";
  timing: GlucoseTiming;
  source: GlucoseSource;

  // CGM Specific (Auto)
  isCGM?: boolean;
  avgGlucose?: number;
  trend?: "up" | "down" | "stable";
  timeInRange?: number; // percentage

  // Optional
  symptoms: string[];
  insulinMedication: boolean;
  mealType?: string;
  activity: boolean;
  notes?: string;

  // Women Factors
  cyclePhase?: string;
  stressLevel?: "low" | "medium" | "high";
  isPregnant: boolean;
  hasPCOS: boolean;

  timestamp: string;
}

export interface GlucoseInsights {
  category: "Normal" | "Prediabetes" | "Diabetes" | "Emergency";
  alertStatus: "Green" | "Amber" | "Red" | "Crisis";
  triageZone: "Green" | "Amber" | "Red";
  triageMessage: string;
  triageSuggestions: string[];
  trend: "up" | "down" | "stable" | "none";
}

// ─── Skin Types ───
export interface SkinLogEntry {
  date: string;
  itching: number; // 1-10
  pain: "none" | "mild" | "throbbing";
  heatCheck: boolean; // Hotter than surrounding skin
  texture: "smooth" | "dry_flaky" | "rough_bumpy" | "weeping";
  isTrackingSpot: boolean;
  spotChanges?: ("size" | "color" | "bleeding")[];
  dietTriggers: ("sugar" | "dairy" | "new_product")[];
  stressLevel: number;
  timestamp: string;
}

export interface SkinInsights {
  triageZone: "Green" | "Yellow" | "Red";
  triageMessage: string;
  triageSuggestions: string[];
}

// ─── Mood Types ───
export interface MoodLogEntry {
  date: string;
  valence: number; // 1-10
  anhedonia: "yes" | "little" | "none";
  anxiety: "calm" | "mild" | "physical_tightness" | "panic";
  irritability: boolean;
  sleep: "normal" | "insomnia" | "hypersomnia";
  appetite: "normal" | "comfort" | "none";
  focus: "normal" | "brain_fog" | "racing";
  safetyCheck: "no" | "passive" | "active";
  isPostpartum?: boolean;
  isPerimenopause?: boolean;
  timestamp: string;
}

export interface MoodInsights {
  triageZone: "Green" | "Yellow" | "Orange" | "Red";
  triageMessage: string;
  triageSuggestions: string[];
  stats?: {
    weeklyAvg: number;
    topMood: string;
    sleepCorrelation: string;
    cycleCorrelation?: string;
    stressPattern: string;
  };
}

export const MOOD_SUGGESTIONS = {
  Sad: [
    "Walk",
    "Call someone",
    "Music",
    "3 gratitudes",
    "Warm shower",
    "PMS → Be gentle, it's hormonal.",
  ],
  Angry: ["4-7-8 breathe", "Pause", "Stretch", "Water", "Avoid reacting"],
  Anxious: [
    "Box breathing",
    "Less caffeine",
    "Write worries",
    "Meditate",
    "5-4-3-2-1",
  ],
  Tired: ["Sleep check", "Water", "Snack", "10-min nap", "Sunlight"],
  Happy: ["Keep routine", "Note why", "Gratitude", "Share positivity"],
};

export const MOOD_CARE_DATA = [
  {
    activity: "Do a 5-minute stretch",
    affirmation: "I am doing my best.",
    tip: "Drink a glass of water now.",
  },
  {
    activity: "Write down 3 things you're grateful for",
    affirmation: "I am enough.",
    tip: "Take 3 deep breaths.",
  },
  {
    activity: "Listen to your favorite song",
    affirmation: "I am resilient.",
    tip: "Step outside for fresh air.",
  },
  {
    activity: "Organize one small space",
    affirmation: "I am at peace.",
    tip: "Dim the lights for 10 minutes.",
  },
];

// ─── Period Types ───
export interface PeriodLogEntry {
  date: string; // YYYY-MM-DD
  isStart: boolean;
  isEnd: boolean;
  flow: "none" | "light" | "moderate" | "heavy";
  symptoms: {
    cramps: Severity;
    mood: boolean;
    bloating: boolean;
    breastTenderness: boolean;
    headache: boolean;
    backPain: boolean;
    acne: boolean;
    fatigue: boolean;
  };
  additionalData: {
    spotting: boolean;
    clotting: boolean;
    irregularCycle: boolean;
    missedPeriod: boolean;
  };
  notes?: string;
  timestamp: string;
}

export interface PeriodInsights {
  phase: "Menstruation" | "Follicular" | "Ovulation" | "Luteal" | "Unknown";
  triageZone: "Green" | "Amber" | "Red";
  triageMessage: string;
  triageSuggestions: string[];
  cycleDetails: {
    currentCycleLength: number;
    avgCycleLength: number;
    ovulationDate: string;
    nextPeriodDate: string;
    regularityStatus: string;
    fertileWindow: string[];
    pmsDays: string[];
  };
  historyTimeline: { date: string; type: string; flow?: string }[];
  alerts: string[];
}

// ─── Constants ───
export const ANEMIA_SYMPTOMS: SymptomDef[] = [
  { id: "fatigue", label: "Fatigue", icon: "bolt" },
  { id: "dizziness", label: "Dizziness", icon: "rotate-right" },
  { id: "breath", label: "Shortness of Breath", icon: "air" },
  { id: "pale_skin", label: "Pale Skin", icon: "face" },
  { id: "headache", label: "Headache", icon: "psychology" },
  { id: "hair_fall", label: "Hair Fall", icon: "content-cut" },
];

export const SEVERITY_OPTIONS: {
  value: Severity;
  label: string;
  score: number;
  color: string;
}[] = [
    { value: "none", label: "None", score: 0, color: "#10b981" },
    { value: "mild", label: "Mild", score: 1, color: "#f59e0b" },
    { value: "moderate", label: "Moderate", score: 2, color: "#f97316" },
    { value: "severe", label: "Severe", score: 3, color: "#ef4444" },
  ];

export const FOOD_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily", score: 0 },
  { value: "sometimes", label: "3-4x/week", score: 1 },
  { value: "rarely", label: "Rarely", score: 2 },
  { value: "never", label: "Never", score: 3 },
] as const;

export const SUPPLEMENT_OPTIONS = [
  { value: "yes", label: "Yes", score: 0 },
  { value: "sometimes", label: "Sometimes", score: 1 },
  { value: "no", label: "No", score: 2 },
] as const;

// ─── Risk Scoring ───
export function computeDailyRiskScore(entry: AnemiaLogEntry): number {
  let score = 0;

  // High weights for Red Flags
  if (entry.breathlessness === "resting") score += 40;
  if (entry.dizziness === "fainted") score += 40;
  if (entry.periodFlow === "very_heavy") score += 40;
  if (entry.stoolColorBlack) score += 40;
  if (entry.pregnancySpotting) score += 50;

  // Medium weights
  if (entry.breathlessness === "chores") score += 20;
  if (entry.dizziness === "constant") score += 20;
  if (entry.heartRate === "constantly") score += 20;
  if (entry.pallor === "very") score += 20;

  // Low weights
  if (entry.energyLevel <= 3) score += 15;
  else if (entry.energyLevel <= 6) score += 10;

  if (entry.breathlessness === "exercise") score += 5;
  if (entry.dizziness === "standing") score += 5;
  if (entry.heartRate === "occasionally") score += 5;
  if (entry.pallor === "slightly") score += 5;
  if (entry.coldExtremities) score += 5;

  return Math.min(score, 100);
}

// ─── Insights Generation ───
export function generateAnemiaInsights(logs: AnemiaLogEntry[]): AnemiaInsights {
  const latestLog = logs[logs.length - 1];
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeekLogs = logs.filter((l) => new Date(l.date) >= weekAgo);
  const prevWeekLogs = logs.filter(
    (l) => new Date(l.date) >= twoWeeksAgo && new Date(l.date) < weekAgo,
  );

  const thisWeekScores = thisWeekLogs.map(computeDailyRiskScore);
  const prevWeekScores = prevWeekLogs.map(computeDailyRiskScore);

  const weekAvg =
    thisWeekScores.length > 0
      ? Math.round(
        thisWeekScores.reduce((a, b) => a + b, 0) / thisWeekScores.length,
      )
      : 0;
  const prevWeekAvg =
    prevWeekScores.length > 0
      ? Math.round(
        prevWeekScores.reduce((a, b) => a + b, 0) / prevWeekScores.length,
      )
      : 0;

  // Risk level
  let riskLevel: AnemiaInsights["riskLevel"] = "Low";
  if (weekAvg > 60) riskLevel = "High";
  else if (weekAvg > 30) riskLevel = "Medium";

  // Zone Logic (Phase 2)
  let triageZone: AnemiaInsights["triageZone"] = "Green";
  let triageMessage = "You are doing well today. Keep up the good work.";
  let triageSuggestions = [
    "Focus on maintaining your iron-rich diet.",
    "Try to include Vitamin C (like oranges) with your meals to boost absorption.",
  ];

  if (latestLog) {
    // Red Flags
    const hasRedFlag =
      latestLog.breathlessness === "resting" ||
      latestLog.dizziness === "fainted" ||
      latestLog.periodFlow === "very_heavy" ||
      latestLog.stoolColorBlack ||
      latestLog.pregnancySpotting;

    if (hasRedFlag) {
      triageZone = "Red";
      triageMessage =
        "ALERT: Your symptoms indicate a need for medical assessment.";
      triageSuggestions = [
        "Please visit your doctor or closest clinic.",
        "Do not drive yourself if you are feeling dizzy.",
      ];
    } else if (
      latestLog.energyLevel <= 5 ||
      latestLog.breathlessness === "chores" ||
      latestLog.heartRate === "constantly" ||
      latestLog.periodFlow === "heavy"
    ) {
      triageZone = "Amber";
      triageMessage = "Your symptoms are flaring up. Take it easy today.";
      triageSuggestions = [
        "Avoid strenuous exercise today. Prioritize sleep.",
        "Ensure you take your iron supplement. Avoid coffee/tea/calcium immediately after the pill.",
        "If you feel dizzy, sit down immediately.",
      ];
    }
  }

  // Trend (Phase 3)
  let trend: AnemiaInsights["trend"] = "Not enough data";
  if (thisWeekScores.length >= 2 && prevWeekScores.length >= 2) {
    const diff = weekAvg - prevWeekAvg;
    if (diff < -5) trend = "Improving";
    else if (diff > 5) trend = "Worsening";
    else trend = "Stable";
  }

  const alerts: string[] = [];
  if (triageZone === "Red")
    alerts.push("Immediate medical attention recommended based on red flags.");

  // Period Crash Prediction
  if (
    latestLog?.isOnPeriod &&
    (latestLog.energyLevel < 5 || latestLog.breathlessness !== "none")
  ) {
    alerts.push(
      "Detected cycle-related fatigue spike. Proactive rest recommended.",
    );
  }

  return {
    riskScore: latestLog ? computeDailyRiskScore(latestLog) : 0,
    riskLevel,
    triageZone,
    triageMessage,
    triageSuggestions,
    trend,
    alerts,
    weekAvg,
    prevWeekAvg,
  };
}

// ─── BP Logic ───
export function computeBPScore(entry: BPLogEntry): number {
  const sysScore = Math.max(0, (entry.systolic - 100) * 1.25);
  const diaScore = Math.max(0, (entry.diastolic - 60) * 1.6);
  return Math.min(100, Math.round((sysScore + diaScore) / 2));
}

export function generateBPInsights(logs: BPLogEntry[]): BPInsights {
  const latestLog = logs[logs.length - 1];
  const today = getToday();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const thisWeekLogs = logs.filter((l) => new Date(l.date) >= weekAgo);
  const todayLogs = logs.filter((l) => l.date === today);

  const calcAvg = (entries: BPLogEntry[]) => {
    if (entries.length === 0) return { systolic: 0, diastolic: 0, pulse: 0 };
    return {
      systolic: Math.round(
        entries.reduce((a, b) => a + b.systolic, 0) / entries.length,
      ),
      diastolic: Math.round(
        entries.reduce((a, b) => a + b.diastolic, 0) / entries.length,
      ),
      pulse: Math.round(
        entries.reduce((a, b) => a + b.pulse, 0) / entries.length,
      ),
    };
  };

  const weekAvg = calcAvg(thisWeekLogs);
  const dailyAvg = calcAvg(todayLogs);

  let triageZone: BPInsights["triageZone"] = "Green";
  let riskLevel: BPInsights["riskLevel"] = "Optimal";
  let category: BPInsights["category"] = "Normal";
  let triageMessage =
    "Perfect reading. Cardiovascular system is under low stress.";
  let triageSuggestions = [
    "Maintain your current lifestyle.",
    "Keep your sodium intake low to stay in this zone.",
  ];

  if (latestLog) {
    const sys = latestLog.systolic;
    const dia = latestLog.diastolic;
    const isPregnant = latestLog.isPregnant;

    // Determine Category (AHA Standards)
    if (sys >= 180 || dia >= 120) category = "Crisis";
    else if (sys >= 140 || dia >= 90) category = "Stage 2";
    else if (sys >= 130 || dia >= 80) category = "Stage 1";
    else if (sys >= 120 && dia < 80) category = "Elevated";
    else if (sys < 90 || dia < 60) category = "Low";
    else category = "Normal";

    // Crisis / Emergency Red Flag
    const hasRedFlagSymptom =
      latestLog.headache === "severe" ||
      latestLog.headache === "thunderclap" ||
      latestLog.vision === "spots" ||
      latestLog.chestBreathing === "pain" ||
      latestLog.neurological === "weakness_diff_speaking";

    const isCrisisNumbers = sys >= 180 || dia >= 120;

    if (isCrisisNumbers || hasRedFlagSymptom) {
      triageZone = "Red";
      riskLevel = "Crisis";
      category = "Crisis";
      triageMessage =
        "CRITICAL ALERT: Your reading or symptoms indicate a medical emergency.";
      triageSuggestions = [
        "SEEK EMERGENCY CARE IMMEDIATELY.",
        "Do not drive yourself to the hospital.",
        "You are in a hypertensive crisis zone.",
      ];
    }
    // Preeclampsia Mode
    else if (
      isPregnant &&
      (sys >= 140 || dia >= 90) &&
      (latestLog.preeclampsiaSwelling || latestLog.preeclampsiaBellyPain)
    ) {
      triageZone = "Red";
      riskLevel = "Crisis";
      triageMessage =
        "PREECLAMPSIA ALERT: High BP + swelling/pain in pregnancy is an emergency.";
      triageSuggestions = [
        "Go to the Emergency Room or contact your OB-GYN immediately.",
        "This threatens both mother and baby.",
      ];
    }
    // High / Stage 2 (Using User's trigger 140/90)
    else if (sys >= 140 || dia >= 90) {
      triageZone = "Orange";
      riskLevel = "High";
      triageMessage = "Your blood pressure is high (Stage 2).";
      triageSuggestions = [
        "Sit in a quiet room for 15 minutes and re-measure.",
        "If the re-measure is still high, contact your healthcare provider today.",
        "Did you miss your medication?",
      ];
    }
    // Elevated / Stage 1
    else if (sys >= 130 || dia >= 80) {
      triageZone = "Yellow";
      riskLevel = "High"; // Standardizing risk level
      triageMessage = "Your BP is in Stage 1 hypertension range.";
      triageSuggestions = [
        "Monitor closely over the next few days.",
        "Try a 10-minute deep breathing session.",
        "Reduction in salt and caffeine may help.",
      ];
    } else if (sys >= 120) {
      triageZone = "Yellow";
      riskLevel = "Elevated";
      triageMessage = "Your BP is slightly elevated.";
      triageSuggestions = [
        "Check your hydration levels.",
        "Ensure you are getting enough sleep.",
      ];
    }
    // Hypotension
    else if (sys <= 90 || dia <= 60) {
      triageZone = "Yellow";
      riskLevel = "Low";
      category = "Low";
      triageMessage = "Your blood pressure is low.";
      triageSuggestions = [
        "Drink 500ml of water immediately.",
        "Add a pinch of salt to your next meal.",
        "Lie down with legs raised if feeling dizzy.",
      ];
    }
  }

  return {
    riskScore: latestLog ? computeBPScore(latestLog) : 0,
    riskLevel,
    category,
    triageZone,
    triageMessage,
    triageSuggestions,
    trend: "Stable",
    alerts: [],
    weekAvg, // updated to object
    dailyAvg,
  };
}

// ─── BP Storage Helpers ───
export async function saveBPLog(entry: BPLogEntry): Promise<void> {
  try {
    const logs = await getBPLogs();
    const idx = logs.findIndex((l) => l.date === entry.date);
    if (idx >= 0) logs[idx] = entry;
    else logs.push(entry);
    logs.sort((a, b) => a.date.localeCompare(b.date));
    await AsyncStorage.setItem(KEYS.BP_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save BP log:", e);
  }
}

export async function getBPLogs(): Promise<BPLogEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.BP_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export async function getTodayBPLog(): Promise<BPLogEntry | null> {
  const today = getToday();
  const logs = await getBPLogs();
  return logs.find((l) => l.date === today) || null;
}

// ─── Glucose Logic ───
export function generateGlucoseInsights(
  entry: GlucoseLogEntry,
): GlucoseInsights {
  const val = entry.value;
  const timing = entry.timing;

  let category: GlucoseInsights["category"] = "Normal";
  let alertStatus: GlucoseInsights["alertStatus"] = "Green";
  let triageMessage = "Your glucose levels are within a healthy range.";
  let triageSuggestions: string[] = ["Keep maintaining your routine."];

  // Emergency Checks
  if (val < 70) {
    category = "Emergency";
    alertStatus = "Crisis";
    triageMessage = "Low blood sugar detected (Hypoglycemia).";
    triageSuggestions = [
      "Rule of 15: Eat 15g fast carbs (juice/honey).",
      "Wait 15 mins and recheck.",
      "If still <70, repeat.",
    ];
  } else if (val > 300) {
    category = "Emergency";
    alertStatus = "Crisis";
    triageMessage = "Critical high blood sugar level.";
    triageSuggestions = [
      "🚨 Consult a doctor immediately.",
      "Drink plenty of water.",
      "Check for ketones if recommended by your doctor.",
    ];
  }
  // Diagnostic Ranges
  else if (timing === "fasting") {
    if (val >= 126) {
      category = "Diabetes";
      alertStatus = "Red";
      triageMessage = "Fasting glucose is in the diabetes range.";
      triageSuggestions = ["Discuss these readings with your doctor."];
    } else if (val >= 100) {
      category = "Prediabetes";
      alertStatus = "Amber";
      triageMessage = "Fasting glucose is in the prediabetes range.";
      triageSuggestions = ["Monitor sugar intake and consistency."];
    }
  } else if (timing === "after_meal_2h") {
    if (val >= 200) {
      category = "Diabetes";
      alertStatus = "Red";
      triageMessage = "Post-meal glucose is in the diabetes range.";
      triageSuggestions = ["High readings after meals need medical review."];
    } else if (val >= 140) {
      category = "Prediabetes";
      alertStatus = "Amber";
      triageMessage = "Post-meal glucose is in the prediabetes range.";
      triageSuggestions = ["Consider walk after meals to lower spike."];
    }
  } else if (val >= 200) {
    // Random or 1h post-meal
    category = "Diabetes";
    alertStatus = "Red";
    triageMessage = "High glucose level detected.";
    triageSuggestions = ["Water, walk, and check medications."];
  }

  // Women specific suggestions
  if (entry.hasPCOS && (category === "Prediabetes" || category === "Diabetes")) {
    triageSuggestions.push("PCOS can increase insulin resistance.");
  }
  if (entry.isPregnant && alertStatus !== "Green") {
    triageSuggestions.push("Monitor closely for gestational health.");
  }

  return {
    category,
    alertStatus,
    triageZone: alertStatus === "Crisis" ? "Red" : alertStatus === "Red" ? "Red" : alertStatus === "Amber" ? "Amber" : "Green",
    triageMessage,
    triageSuggestions,
    trend: entry.trend || "none",
  };
}

// ─── Skin Logic ───
export function generateSkinInsights(entry: SkinLogEntry): SkinInsights {
  if (entry.heatCheck || entry.pain === "throbbing") {
    return {
      triageZone: "Red",
      triageMessage: "ALERT: Potential Infection or Severe Reaction.",
      triageSuggestions: [
        "Please see a doctor immediately.",
        "Heat + Pain can indicate Cellulitis, which is an urgency.",
        "If you have trouble breathing, go to the ER.",
      ],
    };
  }

  if (
    entry.itching > 5 ||
    entry.texture === "weeping" ||
    entry.texture === "dry_flaky"
  ) {
    return {
      triageZone: "Yellow",
      triageMessage: "It looks like you're having a flare-up.",
      triageSuggestions: [
        "Simplify your routine: gentle cleanser and moisturizer only.",
        "Avoid active ingredients (retinol/acids) on irritated skin.",
        "Change your pillowcase tonight.",
      ],
    };
  }

  return {
    triageZone: "Green",
    triageMessage: "Your skin seems calm today.",
    triageSuggestions: [
      "Consistency is key. Apply sunscreen as usual.",
      "Don't pick at any healing spots.",
    ],
  };
}

// ─── Mood Logic ───
export function generateMoodInsights(
  entry: MoodLogEntry,
  allLogs: MoodLogEntry[] = [],
): MoodInsights {
  // Stats calculation
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLogs = allLogs.filter((l) => new Date(l.date) >= weekAgo);

  const weeklyAvg =
    weekLogs.length > 0
      ? Number(
        (
          weekLogs.reduce((acc, l) => acc + l.valence, 0) / weekLogs.length
        ).toFixed(1),
      )
      : entry.valence;

  const moodCounts: Record<number, number> = {};
  weekLogs.forEach((l) => {
    moodCounts[l.valence] = (moodCounts[l.valence] || 0) + 1;
  });
  const topMoodVal = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];
  const topMood = topMoodVal ? `${topMoodVal}/10` : "No data";

  const sleepIssues = weekLogs.filter((l) => l.sleep !== "normal").length;
  const sleepCorrelation =
    sleepIssues > 3 ? "High impact from sleep" : "Sleep seems stable";

  const stressPattern =
    weekLogs.filter((l) => l.irritability).length > 3
      ? "High irritability pattern"
      : "Normal stress levels";

  const stats = {
    weeklyAvg,
    topMood,
    sleepCorrelation,
    stressPattern,
  };

  if (entry.safetyCheck !== "no") {
    return {
      triageZone: "Red",
      triageMessage: "CRITICAL: Please stay with us. You are important.",
      triageSuggestions: [
        "WE STRONGLY RECOMMEND PROFESSIONAL HELP IMMEDIATELY.",
        "Call 988 (Suicide Prevention Hotline) or reach out to a trusted friend.",
        "Resources are available 24/7.",
      ],
      stats,
    };
  }

  if (
    entry.valence < 4 ||
    entry.sleep !== "normal" ||
    entry.anxiety === "panic"
  ) {
    return {
      triageZone: "Orange",
      triageMessage:
        "You've been feeling low or anxious. It might be time for support.",
      triageSuggestions: [
        "Try 'Behavioral Activation': do one small thing today (e.g. wash your face).",
        "Consider booking a session with a therapist.",
        entry.isPostpartum
          ? "Postpartum depression is common and treatable. Talk to your OB-GYN."
          : "Action often precedes motivation.",
      ],
      stats,
    };
  }

  if (entry.valence <= 5 || entry.irritability) {
    return {
      triageZone: "Yellow",
      triageMessage: "It sounds like a heavy day. Be gentle with yourself.",
      triageSuggestions: [
        "Try Box Breathing (4-4-4-4) for 2 minutes.",
        "This feeling might be a natural reaction to stress, not a failure.",
      ],
      stats,
    };
  }

  return {
    triageZone: "Green",
    triageMessage: "You're in a good headspace.",
    triageSuggestions: [
      "Capture this moment. Write down one thing you are grateful for.",
      "This builds your 'psychological immune system'.",
    ],
    stats,
  };
}

// ─── Period Logic ───
export function generatePeriodInsights(
  entry: PeriodLogEntry,
  allLogs: PeriodLogEntry[] = [],
): PeriodInsights {
  // Sort logs by date
  const sortedLogs = [...allLogs].sort((a, b) => a.date.localeCompare(b.date));

  // Identify Start dates to calculate Cycles
  const startDates = sortedLogs
    .filter((l) => l.isStart)
    .map((l) => new Date(l.date));

  let avgCycleLength = 28;
  let currentCycleLength = 0;
  let regularityStatus = "Regular";

  if (startDates.length >= 2) {
    const intervals: number[] = [];
    for (let i = 1; i < startDates.length; i++) {
      const diff =
        (startDates[i].getTime() - startDates[i - 1].getTime()) /
        (1000 * 3600 * 24);
      intervals.push(diff);
    }
    avgCycleLength = Math.round(
      intervals.reduce((a, b) => a + b, 0) / intervals.length,
    );

    // Regularity: If variance is more than 7 days
    const min = Math.min(...intervals);
    const max = Math.max(...intervals);
    if (max - min > 7) regularityStatus = "Irregular";
  }

  // Next Period Prediction
  let nextPeriodDate = "Unknown";
  let ovulationDate = "Unknown";
  let fertileWindow: string[] = [];
  let pmsDays: string[] = [];

  const lastStart = startDates[startDates.length - 1];
  if (lastStart) {
    const next = new Date(lastStart);
    next.setDate(next.getDate() + avgCycleLength);
    nextPeriodDate = next.toISOString().split("T")[0];

    const ov = new Date(lastStart);
    ov.setDate(ov.getDate() + (avgCycleLength - 14));
    ovulationDate = ov.toISOString().split("T")[0];

    // Fertile window: 5 days before ovulation + ovulation day
    for (let i = -5; i <= 0; i++) {
      const d = new Date(ov);
      d.setDate(d.getDate() + i);
      fertileWindow.push(d.toISOString().split("T")[0]);
    }

    // PMS Days: 5 days before next period
    for (let i = -5; i < 0; i++) {
      const d = new Date(next);
      d.setDate(d.getDate() + i);
      pmsDays.push(d.toISOString().split("T")[0]);
    }

    // Current length
    currentCycleLength = Math.round(
      (new Date().getTime() - lastStart.getTime()) / (1000 * 3600 * 24),
    );
  }

  // History Timeline
  const historyTimeline = sortedLogs
    .filter((l) => l.isStart || l.isEnd || l.flow !== "none")
    .slice(-10)
    .map((l) => ({
      date: l.date,
      type: l.isStart ? "Start" : l.isEnd ? "End" : "Flow",
      flow: l.flow,
    }));

  // Phase Estimation
  let phase: PeriodInsights["phase"] = "Unknown";
  const today = getToday();
  if (lastStart) {
    const daysSinceStart = Math.round(
      (new Date(today).getTime() - lastStart.getTime()) / (1000 * 3600 * 24),
    );
    if (daysSinceStart >= 0 && daysSinceStart < 7 && entry?.flow !== "none")
      phase = "Menstruation";
    else if (daysSinceStart < avgCycleLength - 14) phase = "Follicular";
    else if (Math.abs(daysSinceStart - (avgCycleLength - 14)) <= 1)
      phase = "Ovulation";
    else if (daysSinceStart < avgCycleLength) phase = "Luteal";
  }

  // Triage & Suggestions
  let triageZone: PeriodInsights["triageZone"] = "Green";
  let triageMessage = "Your cycle seems balanced.";
  let triageSuggestions: string[] = [
    "Keep tracking to see your monthly trend.",
  ];
  const alerts: string[] = [];

  // Logic based on requirements
  if (phase === "Menstruation") {
    triageMessage = "You are currently in your period.";
    triageSuggestions = [
      "Stay hydrated",
      "Iron-rich foods",
      "Warm compress for cramps",
      "Adequate rest",
    ];
    if (entry?.flow === "heavy") {
      triageZone = "Amber";
      triageMessage = "Heavy flow detected. Monitor closely.";
    }
  } else if (pmsDays.includes(today)) {
    triageMessage = "You might be experiencing PMS symptoms.";
    triageSuggestions = [
      "Light exercise like yoga",
      "Reduce salt & caffeine",
      "Magnesium-rich foods (Dark chocolate, spinach)",
      "Relaxation techniques",
    ];
  } else if (phase === "Ovulation") {
    triageMessage = "You are in your fertile window (Ovulation).";
    triageSuggestions = [
      "Increased hydration",
      "Fertility window is open",
      "Mild cramps (Mittelschmerz) are normal",
    ];
  }

  // Special Alerts
  if (entry?.flow === "heavy") {
    // Check if heavy for > 7 days (simplified check)
    const recentLogs = sortedLogs.slice(-7);
    if (
      recentLogs.every((l) => l.flow === "heavy") &&
      recentLogs.length === 7
    ) {
      alerts.push("🚨 Heavy bleeding for >7 days. Consult a doctor.");
      triageZone = "Red";
    }
  }

  if (avgCycleLength > 35) alerts.push("⚠️ Long cycle (>35 days) detected.");
  if (avgCycleLength < 21 && avgCycleLength > 0)
    alerts.push("⚠️ Short cycle (<21 days) detected.");

  if (entry?.additionalData?.missedPeriod)
    alerts.push("🌸 Missed period alert.");
  if (entry?.additionalData?.irregularCycle || regularityStatus === "Irregular")
    alerts.push("⚠️ Irregular cycle warning.");

  if (entry?.symptoms?.cramps === "severe") {
    triageZone = "Red";
    triageMessage = "Severe Pain Alert.";
    triageSuggestions.push(
      "Severe cramps that stop you from working are NOT normal. Consult a specialist.",
    );
  }

  return {
    phase,
    triageZone,
    triageMessage,
    triageSuggestions,
    cycleDetails: {
      currentCycleLength,
      avgCycleLength,
      ovulationDate,
      nextPeriodDate,
      regularityStatus,
      fertileWindow,
      pmsDays,
    },
    historyTimeline,
    alerts,
  };
}

// ─── Final Storage Helpers ───
export async function saveGenericLog<T>(
  key: string,
  entry: T & { date: string },
): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(key);
    const logs: (T & { date: string })[] = data ? JSON.parse(data) : [];
    const idx = logs.findIndex((l) => l.date === entry.date);
    if (idx >= 0) logs[idx] = entry;
    else logs.push(entry);
    logs.sort((a, b) => a.date.localeCompare(b.date));
    await AsyncStorage.setItem(key, JSON.stringify(logs));
  } catch (e) {
    console.error(`Failed to save log for ${key}:`, e);
  }
}

export async function getGenericLogs<T>(key: string): Promise<T[]> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export const STORAGE_KEYS = KEYS;

// ─── Storage Helpers ───
export async function saveAnemiaLog(entry: AnemiaLogEntry): Promise<void> {
  await saveGenericLog(KEYS.ANEMIA_LOGS, entry);
}

export async function getAnemiaLogs(): Promise<AnemiaLogEntry[]> {
  return getGenericLogs(KEYS.ANEMIA_LOGS);
}

export async function saveGlucoseLog(entry: GlucoseLogEntry): Promise<void> {
  await saveGenericLog(KEYS.GLUCOSE_LOGS, entry);
}

export async function getGlucoseLogs(): Promise<GlucoseLogEntry[]> {
  return getGenericLogs(KEYS.GLUCOSE_LOGS);
}

export async function saveSkinLog(entry: SkinLogEntry): Promise<void> {
  await saveGenericLog(KEYS.SKIN_LOGS, entry);
}

export async function getSkinLogs(): Promise<SkinLogEntry[]> {
  return getGenericLogs(KEYS.SKIN_LOGS);
}

export async function saveMoodLog(entry: MoodLogEntry): Promise<void> {
  await saveGenericLog(KEYS.MOOD_LOGS, entry);
}

export async function getMoodLogs(): Promise<MoodLogEntry[]> {
  return getGenericLogs(KEYS.MOOD_LOGS);
}

export async function savePeriodLog(entry: PeriodLogEntry): Promise<void> {
  await saveGenericLog(KEYS.PERIOD_LOGS, entry);
}

export async function getPeriodLogs(): Promise<PeriodLogEntry[]> {
  return getGenericLogs(KEYS.PERIOD_LOGS);
}

export async function getTodayLog(): Promise<AnemiaLogEntry | null> {
  const today = new Date().toISOString().split("T")[0];
  const logs = await getAnemiaLogs();
  return logs.find((l) => l.date === today) || null;
}

export async function getWeekLogs(): Promise<AnemiaLogEntry[]> {
  const logs = await getAnemiaLogs();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return logs.filter((l) => new Date(l.date) >= weekAgo);
}

// ─── Helpers ───
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getRiskColor(score: number): string {
  if (score > 60) return "#ef4444";
  if (score > 30) return "#f59e0b";
  return "#10b981";
}

export function getTrendIcon(trend: AnemiaInsights["trend"]): {
  icon: string;
  color: string;
} {
  switch (trend) {
    case "Improving":
      return { icon: "trending-down", color: "#10b981" };
    case "Worsening":
      return { icon: "trending-up", color: "#ef4444" };
    case "Stable":
      return { icon: "trending-flat", color: "#f59e0b" };
    default:
      return { icon: "remove", color: "#94a3b8" };
  }
}
