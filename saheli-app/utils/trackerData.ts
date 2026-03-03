import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Storage Keys ───
const KEYS = {
  ANEMIA_LOGS: "saheliAnemiaLogs",
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

// ─── Storage Helpers ───
export async function saveAnemiaLog(entry: AnemiaLogEntry): Promise<void> {
  try {
    const logs = await getAnemiaLogs();
    // Replace if same date exists
    const idx = logs.findIndex((l) => l.date === entry.date);
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    // Sort by date
    logs.sort((a, b) => a.date.localeCompare(b.date));
    await AsyncStorage.setItem(KEYS.ANEMIA_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save anemia log:", e);
  }
}

export async function getAnemiaLogs(): Promise<AnemiaLogEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.ANEMIA_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load anemia logs:", e);
    return [];
  }
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
