import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Storage ───
const KEYS = { GENERAL_LOGS: "saheliGeneralLogs" };

// ─── Types ───
export type MoodType = "happy" | "neutral" | "stressed" | "sad";
export type EnergyLevel = "low" | "medium" | "high";
export type SleepQuality = "poor" | "fair" | "good" | "great";

export interface GeneralLogEntry {
  date: string; // YYYY-MM-DD
  sleepHours: number;
  sleepQuality: SleepQuality;
  mood: MoodType;
  energy: EnergyLevel;
  waterGlasses: number; // 0–12
  exerciseMinutes: number;
  screenTimeHours: number;
  timestamp: string;
}

export interface GeneralInsights {
  lifestyleScore: number; // 0–100
  scoreLevel: "Poor" | "Fair" | "Good" | "Excellent";
  trend: "Improving" | "Stable" | "Worsening" | "Not enough data";
  burnoutRisk: boolean;
  alerts: string[];
  weekAvg: number;
  prevWeekAvg: number;
}

// ─── Option Constants ───
export const MOOD_OPTIONS: {
  value: MoodType;
  label: string;
  emoji: string;
  score: number;
}[] = [
  { value: "happy", label: "Happy", emoji: "😊", score: 3 },
  { value: "neutral", label: "Neutral", emoji: "😐", score: 2 },
  { value: "stressed", label: "Stressed", emoji: "😰", score: 1 },
  { value: "sad", label: "Sad", emoji: "😢", score: 0 },
];

export const ENERGY_OPTIONS: {
  value: EnergyLevel;
  label: string;
  color: string;
  score: number;
}[] = [
  { value: "low", label: "Low", color: "#ef4444", score: 0 },
  { value: "medium", label: "Medium", color: "#f59e0b", score: 1 },
  { value: "high", label: "High", color: "#10b981", score: 2 },
];

export const SLEEP_QUALITY_OPTIONS: {
  value: SleepQuality;
  label: string;
  score: number;
}[] = [
  { value: "poor", label: "Poor", score: 0 },
  { value: "fair", label: "Fair", score: 1 },
  { value: "good", label: "Good", score: 2 },
  { value: "great", label: "Great", score: 3 },
];

// ─── Scoring ───
export function computeDailyScore(entry: GeneralLogEntry): number {
  let score = 0;
  let max = 0;

  // Sleep hours (ideal 7–9)
  if (entry.sleepHours >= 7 && entry.sleepHours <= 9) score += 3;
  else if (entry.sleepHours >= 6) score += 2;
  else if (entry.sleepHours >= 5) score += 1;
  max += 3;

  // Sleep quality
  const sqOpt = SLEEP_QUALITY_OPTIONS.find(
    (o) => o.value === entry.sleepQuality,
  );
  score += sqOpt?.score || 0;
  max += 3;

  // Mood
  const moodOpt = MOOD_OPTIONS.find((o) => o.value === entry.mood);
  score += moodOpt?.score || 0;
  max += 3;

  // Energy
  const engOpt = ENERGY_OPTIONS.find((o) => o.value === entry.energy);
  score += engOpt?.score || 0;
  max += 2;

  // Water (ideal 8+ glasses)
  if (entry.waterGlasses >= 8) score += 3;
  else if (entry.waterGlasses >= 5) score += 2;
  else if (entry.waterGlasses >= 3) score += 1;
  max += 3;

  // Exercise (ideal 30+ min)
  if (entry.exerciseMinutes >= 30) score += 3;
  else if (entry.exerciseMinutes >= 15) score += 2;
  else if (entry.exerciseMinutes > 0) score += 1;
  max += 3;

  // Screen time (lower is better, ideal < 4h)
  if (entry.screenTimeHours <= 3) score += 3;
  else if (entry.screenTimeHours <= 5) score += 2;
  else if (entry.screenTimeHours <= 7) score += 1;
  max += 3;

  return max > 0 ? Math.round((score / max) * 100) : 0;
}

// ─── Insights ───
export function generateGeneralInsights(
  logs: GeneralLogEntry[],
): GeneralInsights {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeek = logs.filter((l) => new Date(l.date) >= weekAgo);
  const prevWeek = logs.filter(
    (l) => new Date(l.date) >= twoWeeksAgo && new Date(l.date) < weekAgo,
  );

  const thisScores = thisWeek.map(computeDailyScore);
  const prevScores = prevWeek.map(computeDailyScore);

  const weekAvg =
    thisScores.length > 0
      ? Math.round(thisScores.reduce((a, b) => a + b, 0) / thisScores.length)
      : 0;
  const prevWeekAvg =
    prevScores.length > 0
      ? Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length)
      : 0;

  // Score level
  let scoreLevel: GeneralInsights["scoreLevel"] = "Poor";
  if (weekAvg >= 75) scoreLevel = "Excellent";
  else if (weekAvg >= 55) scoreLevel = "Good";
  else if (weekAvg >= 35) scoreLevel = "Fair";

  // Trend
  let trend: GeneralInsights["trend"] = "Not enough data";
  if (thisScores.length >= 2 && prevScores.length >= 2) {
    const diff = weekAvg - prevWeekAvg;
    if (diff > 5) trend = "Improving";
    else if (diff < -5) trend = "Worsening";
    else trend = "Stable";
  } else if (thisScores.length >= 3) {
    trend = "Stable";
  }

  // Burnout detection
  const recentStressed = thisWeek.filter(
    (l) => l.mood === "stressed" || l.mood === "sad",
  ).length;
  const recentPoorSleep = thisWeek.filter(
    (l) => l.sleepHours < 6 || l.sleepQuality === "poor",
  ).length;
  const burnoutRisk =
    recentStressed >= 4 || (recentStressed >= 2 && recentPoorSleep >= 3);

  // Alerts
  const alerts: string[] = [];
  if (burnoutRisk) {
    alerts.push(
      "⚠️ Burnout risk detected. Consider taking a break and practicing self-care.",
    );
  }
  if (recentPoorSleep >= 3) {
    alerts.push(
      `Poor sleep detected for ${recentPoorSleep} of last ${thisWeek.length} days. Try a consistent sleep routine.`,
    );
  }
  if (recentStressed >= 3) {
    alerts.push(
      `High stress for ${recentStressed} days. Consider relaxation techniques like meditation or deep breathing.`,
    );
  }
  const lowWater = thisWeek.filter((l) => l.waterGlasses < 4).length;
  if (lowWater >= 3) {
    alerts.push("💧 Low water intake this week. Aim for 8 glasses daily.");
  }
  const noExercise = thisWeek.filter((l) => l.exerciseMinutes === 0).length;
  if (noExercise >= 4) {
    alerts.push(
      "🏃 Very little exercise this week. Even 15 min of walking helps!",
    );
  }
  if (weekAvg < 35 && thisScores.length >= 3) {
    alerts.push(
      "💡 Your lifestyle score is low. Small daily improvements can make a big difference.",
    );
  }

  return {
    lifestyleScore: weekAvg,
    scoreLevel,
    trend,
    burnoutRisk,
    alerts,
    weekAvg,
    prevWeekAvg,
  };
}

// ─── Storage Helpers ───
export async function saveGeneralLog(entry: GeneralLogEntry): Promise<void> {
  try {
    const logs = await getGeneralLogs();
    const idx = logs.findIndex((l) => l.date === entry.date);
    if (idx >= 0) logs[idx] = entry;
    else logs.push(entry);
    logs.sort((a, b) => a.date.localeCompare(b.date));
    await AsyncStorage.setItem(KEYS.GENERAL_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save general log:", e);
  }
}

export async function getGeneralLogs(): Promise<GeneralLogEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.GENERAL_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load general logs:", e);
    return [];
  }
}

export async function getTodayGeneralLog(): Promise<GeneralLogEntry | null> {
  const today = new Date().toISOString().split("T")[0];
  const logs = await getGeneralLogs();
  return logs.find((l) => l.date === today) || null;
}

// ─── Helpers ───
export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 55) return "#7ed3d4";
  if (score >= 35) return "#f59e0b";
  return "#ef4444";
}

export function getTrendIcon(trend: GeneralInsights["trend"]): {
  icon: string;
  color: string;
} {
  switch (trend) {
    case "Improving":
      return { icon: "trending-up", color: "#10b981" };
    case "Worsening":
      return { icon: "trending-down", color: "#ef4444" };
    case "Stable":
      return { icon: "trending-flat", color: "#f59e0b" };
    default:
      return { icon: "remove", color: "#94a3b8" };
  }
}
