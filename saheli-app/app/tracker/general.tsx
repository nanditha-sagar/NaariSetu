import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  MOOD_OPTIONS,
  ENERGY_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  GeneralLogEntry,
  GeneralInsights,
  MoodType,
  EnergyLevel,
  SleepQuality,
  getGeneralLogs,
  getTodayGeneralLog,
  saveGeneralLog,
  generateGeneralInsights,
  computeDailyScore,
  getToday,
  getScoreColor,
  getTrendIcon,
} from "@/utils/generalTrackerData";

export default function GeneralHealthScreen() {
  const [sleepHours, setSleepHours] = useState("7");
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>("good");
  const [mood, setMood] = useState<MoodType>("neutral");
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [waterGlasses, setWaterGlasses] = useState("4");
  const [exerciseMin, setExerciseMin] = useState("0");
  const [screenTime, setScreenTime] = useState("4");
  const [insights, setInsights] = useState<GeneralInsights | null>(null);
  const [weekScores, setWeekScores] = useState<
    { date: string; score: number }[]
  >([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const loadData = useCallback(async () => {
    const logs = await getGeneralLogs();
    const todayLog = await getTodayGeneralLog();

    if (todayLog) {
      setSleepHours(String(todayLog.sleepHours));
      setSleepQuality(todayLog.sleepQuality);
      setMood(todayLog.mood);
      setEnergy(todayLog.energy);
      setWaterGlasses(String(todayLog.waterGlasses));
      setExerciseMin(String(todayLog.exerciseMinutes));
      setScreenTime(String(todayLog.screenTimeHours));
      setHasLoggedToday(true);
    } else {
      setHasLoggedToday(false);
    }

    if (logs.length > 0) setInsights(generateGeneralInsights(logs));

    const last7: { date: string; score: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const log = logs.find((l) => l.date === ds);
      last7.push({ date: ds, score: log ? computeDailyScore(log) : 0 });
    }
    setWeekScores(last7);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    const entry: GeneralLogEntry = {
      date: getToday(),
      sleepHours: parseFloat(sleepHours) || 0,
      sleepQuality,
      mood,
      energy,
      waterGlasses: parseInt(waterGlasses) || 0,
      exerciseMinutes: parseInt(exerciseMin) || 0,
      screenTimeHours: parseFloat(screenTime) || 0,
      timestamp: new Date().toISOString(),
    };
    await saveGeneralLog(entry);
    setHasLoggedToday(true);
    await loadData();
    Alert.alert("Saved!", "Today's wellness log has been recorded.");
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      {/* Header */}
      <View className="flex-row items-center px-6 py-3 gap-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <MaterialIcons name="arrow-back-ios" size={20} color="#64748b" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-900">
            💤 General Health
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Sleep, mood & lifestyle
          </Text>
        </View>
        {hasLoggedToday && (
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
          >
            <Text className="text-xs font-semibold text-emerald-600">
              ✓ Logged
            </Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* ─── AI Insights ─── */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="auto-awesome" size={18} color="#7ed3d4" />
            <Text className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              AI Insights
            </Text>
          </View>

          {insights ? (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                {/* Score Gauge */}
                <View className="items-center">
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center border-4"
                    style={{
                      borderColor: getScoreColor(insights.lifestyleScore),
                    }}
                  >
                    <Text
                      className="text-2xl font-bold"
                      style={{ color: getScoreColor(insights.lifestyleScore) }}
                    >
                      {insights.lifestyleScore}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                    Wellness
                  </Text>
                </View>

                {/* Level */}
                <View className="items-center">
                  <View
                    className="px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: `${getScoreColor(insights.lifestyleScore)}15`,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: getScoreColor(insights.lifestyleScore) }}
                    >
                      {insights.scoreLevel}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                    Level
                  </Text>
                </View>

                {/* Trend */}
                <View className="items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: `${getTrendIcon(insights.trend).color}15`,
                    }}
                  >
                    <MaterialIcons
                      name={getTrendIcon(insights.trend).icon as any}
                      size={24}
                      color={getTrendIcon(insights.trend).color}
                    />
                  </View>
                  <Text className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                    {insights.trend}
                  </Text>
                </View>
              </View>

              {/* Burnout badge */}
              {insights.burnoutRisk && (
                <View
                  className="flex-row items-center gap-2 p-3 rounded-lg mb-2"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
                >
                  <MaterialIcons
                    name="local-fire-department"
                    size={18}
                    color="#ef4444"
                  />
                  <Text className="text-xs font-bold text-red-700">
                    BURNOUT RISK DETECTED
                  </Text>
                </View>
              )}

              {/* Alerts */}
              {insights.alerts.map((alert, i) => (
                <View
                  key={i}
                  className="flex-row items-start gap-2 p-3 rounded-lg mb-2"
                  style={{
                    backgroundColor:
                      alert.startsWith("💡") ||
                        alert.startsWith("💧") ||
                        alert.startsWith("🏃")
                        ? "rgba(126,211,212,0.08)"
                        : "rgba(239,68,68,0.08)",
                  }}
                >
                  <Text className="flex-1 text-xs leading-5 text-slate-700">
                    {alert}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-6">
              <MaterialIcons name="insights" size={36} color="#cbd5e1" />
              <Text className="text-sm text-slate-400 mt-2">
                Log your first entry to see insights
              </Text>
            </View>
          )}
        </View>

        {/* ─── 7-Day Chart ─── */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
          <Text className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            7-Day Wellness
          </Text>
          <View className="flex-row items-end justify-between h-28 px-2">
            {weekScores.map((item, i) => {
              const barH = Math.max(item.score * 1.0, 4);
              const dayIdx = new Date(item.date).getDay();
              const isToday = item.date === getToday();
              return (
                <View key={i} className="items-center flex-1">
                  <Text
                    className="text-[9px] font-bold mb-1"
                    style={{ color: getScoreColor(item.score) }}
                  >
                    {item.score > 0 ? item.score : ""}
                  </Text>
                  <View
                    className="w-6 rounded-t-md"
                    style={{
                      height: barH,
                      backgroundColor:
                        item.score > 0 ? getScoreColor(item.score) : "#e2e8f0",
                    }}
                  />
                  <Text
                    className={`text-[10px] mt-1 ${isToday ? "font-bold text-teal-500" : "text-slate-400"}`}
                  >
                    {dayLabels[dayIdx]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ─── Daily Log ─── */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Today's Log
            </Text>
            <Text className="text-xs text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* ── Sleep ── */}
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-base">😴</Text>
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Sleep
            </Text>
          </View>

          <View className="flex-row items-center gap-3 mb-3">
            <MaterialIcons name="bedtime" size={14} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">
              Hours slept
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput
              className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-800 border border-slate-200"
              placeholder="e.g. 7"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={sleepHours}
              onChangeText={setSleepHours}
            />
            <Text className="text-sm text-slate-400 font-medium">hrs</Text>
          </View>

          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="star" size={14} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">
              Sleep quality
            </Text>
          </View>
          <View className="flex-row gap-2 mb-4">
            {SLEEP_QUALITY_OPTIONS.map((opt) => {
              const sel = sleepQuality === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setSleepQuality(opt.value)}
                  className={`flex-1 py-2 rounded-lg border items-center ${sel ? "border-transparent" : "border-slate-200"}`}
                  style={
                    sel
                      ? { backgroundColor: "#7ed3d4" }
                      : { backgroundColor: "white" }
                  }
                >
                  <Text
                    className={`text-xs font-semibold ${sel ? "text-white" : "text-slate-500"}`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="h-px bg-slate-100 my-3" />

          {/* ── Mood ── */}
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-base">🧠</Text>
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Mood
            </Text>
          </View>
          <View className="flex-row gap-2 mb-4">
            {MOOD_OPTIONS.map((opt) => {
              const sel = mood === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setMood(opt.value)}
                  className={`flex-1 py-3 rounded-lg border items-center ${sel ? "border-transparent" : "border-slate-200"}`}
                  style={
                    sel
                      ? { backgroundColor: "#7ed3d4" }
                      : { backgroundColor: "white" }
                  }
                >
                  <Text className="text-lg mb-0.5">{opt.emoji}</Text>
                  <Text
                    className={`text-[10px] font-semibold ${sel ? "text-white" : "text-slate-500"}`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="h-px bg-slate-100 my-3" />

          {/* ── Energy ── */}
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-base">⚡</Text>
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Energy Level
            </Text>
          </View>
          <View className="flex-row gap-2 mb-4">
            {ENERGY_OPTIONS.map((opt) => {
              const sel = energy === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setEnergy(opt.value)}
                  className={`flex-1 py-2 rounded-lg border items-center ${sel ? "border-transparent" : "border-slate-200"}`}
                  style={
                    sel
                      ? { backgroundColor: opt.color }
                      : { backgroundColor: "white" }
                  }
                >
                  <Text
                    className={`text-xs font-semibold ${sel ? "text-white" : "text-slate-500"}`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="h-px bg-slate-100 my-3" />

          {/* ── Lifestyle ── */}
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-base">🏃</Text>
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Lifestyle
            </Text>
          </View>

          {/* Water */}
          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="water-drop" size={14} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">
              Water intake
            </Text>
          </View>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput
              className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-800 border border-slate-200"
              placeholder="e.g. 8"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={waterGlasses}
              onChangeText={setWaterGlasses}
            />
            <Text className="text-sm text-slate-400 font-medium">glasses</Text>
          </View>

          {/* Exercise */}
          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="fitness-center" size={14} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">Exercise</Text>
          </View>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput
              className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-800 border border-slate-200"
              placeholder="e.g. 30"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
              value={exerciseMin}
              onChangeText={setExerciseMin}
            />
            <Text className="text-sm text-slate-400 font-medium">min</Text>
          </View>

          {/* Screen time */}
          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="phone-android" size={14} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">
              Screen time
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-800 border border-slate-200"
              placeholder="e.g. 4"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={screenTime}
              onChangeText={setScreenTime}
            />
            <Text className="text-sm text-slate-400 font-medium">hrs</Text>
          </View>
        </View>

        {/* Save */}
        <Pressable
          onPress={handleSave}
          className="w-full py-4 rounded-xl items-center mb-6 active:opacity-90"
          style={{ backgroundColor: "#7ed3d4" }}
        >
          <Text className="text-white font-semibold text-base">
            {hasLoggedToday ? "Update Today's Log" : "Save Today's Log"}
          </Text>
        </Pressable>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
