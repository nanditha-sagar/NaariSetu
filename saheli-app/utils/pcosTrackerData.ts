import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Storage Keys ───
const KEYS = {
  PCOS_LOGS: "saheliPcosLogs",
};

// ─── Types ───
export type Severity = "none" | "mild" | "moderate" | "severe";

export interface SymptomDef {
  id: string;
  label: string;
  icon: string;
  category: "menstrual" | "physical" | "metabolic" | "mood";
}

export interface PCOSLogEntry {
  date: string; // YYYY-MM-DD
  symptoms: Record<string, Severity>;
  cycleLength?: number; // days
  timestamp: string;
}

export interface PCOSInsights {
  riskScore: number; // 0–100
  riskLevel: "Low" | "Medium" | "High";
  trend: "Improving" | "Stable" | "Worsening" | "Not enough data";
  alerts: string[];
  weekAvg: number;
  prevWeekAvg: number;
  patternNote: string | null;
}

// ─── Constants ───
export const PCOS_CATEGORIES = [
  { id: "menstrual", label: "Menstrual", emoji: "🩸" },
  { id: "physical", label: "Physical", emoji: "👤" },
  { id: "metabolic", label: "Metabolic", emoji: "⚡" },
  { id: "mood", label: "Mood", emoji: "🧠" },
] as const;

export const PCOS_SYMPTOMS: SymptomDef[] = [
  // Menstrual
  {
    id: "cycle_irregular",
    label: "Irregular Cycles",
    icon: "event-busy",
    category: "menstrual",
  },
  {
    id: "missed_period",
    label: "Missed Periods",
    icon: "event-available",
    category: "menstrual",
  },
  {
    id: "heavy_bleeding",
    label: "Heavy Bleeding",
    icon: "water-drop",
    category: "menstrual",
  },
  // Physical
  {
    id: "weight_change",
    label: "Weight Changes",
    icon: "monitor-weight",
    category: "physical",
  },
  { id: "acne", label: "Acne", icon: "healing", category: "physical" },
  {
    id: "facial_hair",
    label: "Facial Hair Growth",
    icon: "face-retouching-natural",
    category: "physical",
  },
  {
    id: "hair_thinning",
    label: "Hair Thinning",
    icon: "content-cut",
    category: "physical",
  },
  // Metabolic
  {
    id: "sugar_cravings",
    label: "Sugar Cravings",
    icon: "cake",
    category: "metabolic",
  },
  { id: "fatigue", label: "Fatigue", icon: "bolt", category: "metabolic" },
  // Mood
  {
    id: "irritability",
    label: "Irritability",
    icon: "mood-bad",
    category: "mood",
  },
  { id: "anxiety", label: "Anxiety", icon: "psychology", category: "mood" },
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

// ─── Risk Scoring ───
export function computeDailyPCOSScore(entry: PCOSLogEntry): number {
  let totalScore = 0;
  let maxScore = 0;

  for (const symptom of PCOS_SYMPTOMS) {
    const severity = entry.symptoms[symptom.id] || "none";
    const opt = SEVERITY_OPTIONS.find((o) => o.value === severity);
    totalScore += opt?.score || 0;
    maxScore += 3;
  }

  // Cycle length penalty (normal = 21–35 days)
  if (entry.cycleLength !== undefined) {
    if (entry.cycleLength < 21 || entry.cycleLength > 35) {
      totalScore += 3; // very irregular
    } else if (entry.cycleLength < 24 || entry.cycleLength > 32) {
      totalScore += 1; // slightly irregular
    }
    maxScore += 3;
  }

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

// ─── Pattern Detection ───
function detectPattern(entry: PCOSLogEntry): string | null {
  const s = entry.symptoms;
  const hasIrregularCycle =
    s.cycle_irregular === "moderate" || s.cycle_irregular === "severe";
  const hasWeightChange =
    s.weight_change === "moderate" || s.weight_change === "severe";
  const hasAcne = s.acne === "moderate" || s.acne === "severe";
  const hasFacialHair =
    s.facial_hair === "mild" ||
    s.facial_hair === "moderate" ||
    s.facial_hair === "severe";
  const hasHairThinning =
    s.hair_thinning === "moderate" || s.hair_thinning === "severe";

  if (hasIrregularCycle && hasWeightChange && hasAcne) {
    return "Irregular cycles + weight gain + acne → Possible PCOS pattern detected.";
  }
  if (hasIrregularCycle && hasFacialHair) {
    return "Irregular cycles + facial hair → Hormonal imbalance signs detected.";
  }
  if (hasAcne && hasHairThinning && hasWeightChange) {
    return "Acne + hair thinning + weight changes → Consider hormonal screening.";
  }
  if (hasIrregularCycle && hasWeightChange) {
    return "Irregular cycles + weight changes → Monitor for PCOS indicators.";
  }
  return null;
}

// ─── Insights ───
export function generatePCOSInsights(logs: PCOSLogEntry[]): PCOSInsights {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeekLogs = logs.filter((l) => new Date(l.date) >= weekAgo);
  const prevWeekLogs = logs.filter(
    (l) => new Date(l.date) >= twoWeeksAgo && new Date(l.date) < weekAgo,
  );

  const thisWeekScores = thisWeekLogs.map(computeDailyPCOSScore);
  const prevWeekScores = prevWeekLogs.map(computeDailyPCOSScore);

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

  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (weekAvg > 55) riskLevel = "High";
  else if (weekAvg > 28) riskLevel = "Medium";

  let trend: PCOSInsights["trend"] = "Not enough data";
  if (thisWeekScores.length >= 2 && prevWeekScores.length >= 2) {
    const diff = weekAvg - prevWeekAvg;
    if (diff < -5) trend = "Improving";
    else if (diff > 5) trend = "Worsening";
    else trend = "Stable";
  } else if (thisWeekScores.length >= 3) {
    trend = "Stable";
  }

  const alerts: string[] = [];
  if (riskLevel === "High") {
    alerts.push(
      "PCOS risk indicators are elevated. Consider consulting a gynecologist.",
    );
  }
  if (trend === "Worsening") {
    alerts.push("Symptoms trending worse compared to last week.");
  }

  // Pattern from latest log
  const latestLog =
    thisWeekLogs[thisWeekLogs.length - 1] || logs[logs.length - 1];
  const patternNote = latestLog ? detectPattern(latestLog) : null;
  if (patternNote) {
    alerts.push(patternNote);
  }

  // Lifestyle suggestions
  if (riskLevel !== "Low") {
    alerts.push(
      "💡 Tip: Regular exercise and a low-glycemic diet may help manage PCOS symptoms.",
    );
  }

  return {
    riskScore: weekAvg,
    riskLevel,
    trend,
    alerts,
    weekAvg,
    prevWeekAvg,
    patternNote,
  };
}

// ─── Storage ───
export async function savePCOSLog(entry: PCOSLogEntry): Promise<void> {
  try {
    const logs = await getPCOSLogs();
    const idx = logs.findIndex((l) => l.date === entry.date);
    if (idx >= 0) logs[idx] = entry;
    else logs.push(entry);
    logs.sort((a, b) => a.date.localeCompare(b.date));
    await AsyncStorage.setItem(KEYS.PCOS_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save PCOS log:", e);
  }
}

export async function getPCOSLogs(): Promise<PCOSLogEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PCOS_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load PCOS logs:", e);
    return [];
  }
}

export async function getTodayPCOSLog(): Promise<PCOSLogEntry | null> {
  const today = new Date().toISOString().split("T")[0];
  const logs = await getPCOSLogs();
  return logs.find((l) => l.date === today) || null;
}

// ─── Helpers ───
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getRiskColor(score: number): string {
  if (score > 55) return "#ef4444";
  if (score > 28) return "#f59e0b";
  return "#10b981";
}

export function getTrendIcon(trend: PCOSInsights["trend"]): {
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

export function getSymptomsByCategory(cat: string): SymptomDef[] {
  return PCOS_SYMPTOMS.filter((s) => s.category === cat);
}
