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
  symptoms: Record<string, Severity>;
  ironFoodFrequency: "daily" | "sometimes" | "rarely" | "never";
  supplementUsage: "yes" | "sometimes" | "no";
  hemoglobin?: number; // optional g/dL
  timestamp: string;
}

export interface AnemiaInsights {
  riskScore: number; // 0–100
  riskLevel: "Low" | "Medium" | "High";
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
  let totalScore = 0;
  let maxScore = 0;

  // Symptom scores (6 symptoms × max 3 = 18)
  for (const symptom of ANEMIA_SYMPTOMS) {
    const severity = entry.symptoms[symptom.id] || "none";
    const opt = SEVERITY_OPTIONS.find((o) => o.value === severity);
    totalScore += opt?.score || 0;
    maxScore += 3;
  }

  // Lifestyle scores
  const foodOpt = FOOD_FREQUENCY_OPTIONS.find(
    (o) => o.value === entry.ironFoodFrequency,
  );
  totalScore += foodOpt?.score || 0;
  maxScore += 3;

  const suppOpt = SUPPLEMENT_OPTIONS.find(
    (o) => o.value === entry.supplementUsage,
  );
  totalScore += suppOpt?.score || 0;
  maxScore += 2;

  // Hemoglobin bonus (if provided)
  if (entry.hemoglobin !== undefined) {
    if (entry.hemoglobin < 7) {
      totalScore += 4;
      maxScore += 4;
    } else if (entry.hemoglobin < 10) {
      totalScore += 3;
      maxScore += 4;
    } else if (entry.hemoglobin < 12) {
      totalScore += 1;
      maxScore += 4;
    } else {
      maxScore += 4;
    }
  }

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

// ─── Insights Generation ───
export function generateAnemiaInsights(logs: AnemiaLogEntry[]): AnemiaInsights {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeekLogs = logs.filter((l) => new Date(l.date) >= weekAgo);
  const prevWeekLogs = logs.filter(
    (l) => new Date(l.date) >= twoWeeksAgo && new Date(l.date) < weekAgo,
  );

  // Weekly averages
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
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (weekAvg > 60) riskLevel = "High";
  else if (weekAvg > 30) riskLevel = "Medium";

  // Trend
  let trend: AnemiaInsights["trend"] = "Not enough data";
  if (thisWeekScores.length >= 2 && prevWeekScores.length >= 2) {
    const diff = weekAvg - prevWeekAvg;
    if (diff < -5) trend = "Improving";
    else if (diff > 5) trend = "Worsening";
    else trend = "Stable";
  } else if (thisWeekScores.length >= 3) {
    trend = "Stable";
  }

  // Alerts
  const alerts: string[] = [];
  if (riskLevel === "High") {
    alerts.push("Your anemia risk is elevated. Consider consulting a doctor.");
  }
  if (trend === "Worsening") {
    alerts.push("Symptoms are worsening compared to last week.");
  }

  // Check for persistent severe symptoms
  const latestLog = thisWeekLogs[thisWeekLogs.length - 1];
  if (latestLog) {
    const severeCount = Object.values(latestLog.symptoms).filter(
      (s) => s === "severe",
    ).length;
    if (severeCount >= 3) {
      alerts.push(
        "Multiple severe symptoms detected. Please seek medical attention.",
      );
    }
  }

  return { riskScore: weekAvg, riskLevel, trend, alerts, weekAvg, prevWeekAvg };
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
