import React, { useState, useEffect, useCallback } from "react";
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
  AnemiaLogEntry,
  AnemiaInsights,
  getAnemiaLogs,
  getTodayLog,
  saveAnemiaLog,
  generateAnemiaInsights,
  computeDailyRiskScore,
  getToday,
  getRiskColor,
  getTrendIcon,
} from "@/utils/trackerData";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function AnemiaTrackerScreen() {
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [breathlessness, setBreathlessness] =
    useState<AnemiaLogEntry["breathlessness"]>("none");
  const [dizziness, setDizziness] =
    useState<AnemiaLogEntry["dizziness"]>("none");
  const [heartRate, setHeartRate] =
    useState<AnemiaLogEntry["heartRate"]>("none");
  const [pallor, setPallor] = useState<AnemiaLogEntry["pallor"]>("normal");
  const [coldExtremities, setColdExtremities] = useState<boolean>(false);
  const [isOnPeriod, setIsOnPeriod] = useState<boolean>(false);
  const [periodFlow, setPeriodFlow] =
    useState<AnemiaLogEntry["periodFlow"]>("medium");
  const [pregnancySpotting, setPregnancySpotting] = useState<boolean>(false);
  const [stoolColorBlack, setStoolColorBlack] = useState<boolean>(false);
  const [suppUsage, setSuppUsage] =
    useState<AnemiaLogEntry["supplementUsage"]>("no");
  const [hemoglobin, setHemoglobin] = useState<string>("");

  const [insights, setInsights] = useState<AnemiaInsights | null>(null);
  const [weekScores, setWeekScores] = useState<
    { date: string; score: number }[]
  >([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const loadData = useCallback(async () => {
    const logs = await getAnemiaLogs();
    const todayLog = await getTodayLog();

    if (todayLog) {
      setEnergyLevel(todayLog.energyLevel);
      setBreathlessness(todayLog.breathlessness);
      setDizziness(todayLog.dizziness);
      setHeartRate(todayLog.heartRate);
      setPallor(todayLog.pallor);
      setColdExtremities(todayLog.coldExtremities);
      setIsOnPeriod(todayLog.isOnPeriod);
      if (todayLog.periodFlow) setPeriodFlow(todayLog.periodFlow);
      if (todayLog.pregnancySpotting !== undefined)
        setPregnancySpotting(todayLog.pregnancySpotting);
      setStoolColorBlack(todayLog.stoolColorBlack);
      setSuppUsage(todayLog.supplementUsage);
      if (todayLog.hemoglobin) setHemoglobin(String(todayLog.hemoglobin));
      setHasLoggedToday(true);
    }

    if (logs.length > 0) {
      setInsights(generateAnemiaInsights(logs));
    }

    const last7: { date: string; score: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const log = logs.find((l) => l.date === dateStr);
      last7.push({
        date: dateStr,
        score: log ? computeDailyRiskScore(log) : 0,
      });
    }
    setWeekScores(last7);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    const entry: AnemiaLogEntry = {
      date: getToday(),
      energyLevel,
      breathlessness,
      dizziness,
      heartRate,
      pallor,
      coldExtremities,
      isOnPeriod,
      periodFlow: isOnPeriod ? periodFlow : undefined,
      pregnancySpotting: pregnancySpotting || undefined,
      stoolColorBlack,
      supplementUsage: suppUsage,
      hemoglobin: hemoglobin ? parseFloat(hemoglobin) : undefined,
      timestamp: new Date().toISOString(),
    };

    await saveAnemiaLog(entry);
    setHasLoggedToday(true);
    await loadData();
    Alert.alert("Saved!", "Today's anemia log has been recorded.");
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <View className="flex-row items-center px-6 py-3 gap-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <MaterialIcons name="arrow-back-ios" size={20} color="#64748b" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-900">
            🩸 Anemia Tracker
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Clinical daily health check-in
          </Text>
        </View>
        {hasLoggedToday && (
          <View className="px-3 py-1 rounded-full bg-emerald-50">
            <Text className="text-xs font-semibold text-emerald-600">
              ✓ Logged
            </Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Triage Insights */}
        {insights ? (
          <TriageZoneCard
            zone={insights.triageZone}
            message={insights.triageMessage}
            suggestions={insights.triageSuggestions}
          />
        ) : (
          <View className="bg-white rounded-2xl p-6 border border-slate-100 mb-5 items-center">
            <MaterialIcons name="insights" size={32} color="#cbd5e1" />
            <Text className="text-sm text-slate-400 mt-2">
              Log data to see AI triage
            </Text>
          </View>
        )}

        {/* 7-Day Overview */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            7-Day Risk Trend
          </Text>
          <View className="flex-row items-end justify-between h-24 px-1">
            {weekScores.map((item, i) => {
              const barH = Math.max(item.score * 0.8, 4);
              const dayIdx = new Date(item.date).getDay();
              return (
                <View key={i} className="items-center flex-1">
                  <View
                    className="w-6 rounded-t-md"
                    style={{
                      height: barH,
                      backgroundColor:
                        item.score > 0 ? getRiskColor(item.score) : "#f1f5f9",
                    }}
                  />
                  <Text className="text-[10px] mt-1 text-slate-400">
                    {dayLabels[dayIdx]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Questionnaire */}
        <View className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-900 mb-6">
            Daily Questionnaire
          </Text>

          {/* SECTION A: THE VITALS */}
          <Text className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            A. The Vitals
          </Text>

          <SegmentedSelector
            label="Energy Level (1=Exhausted, 10=High)"
            options={[
              { label: "1", value: "1", color: "#ef4444" },
              { label: "2", value: "2", color: "#f87171" },
              { label: "3", value: "3", color: "#fb923c" },
              { label: "4", value: "4", color: "#fbbf24" },
              { label: "5", value: "5", color: "#eab308" },
              { label: "6", value: "6", color: "#84cc16" },
              { label: "7", value: "7", color: "#4ade80" },
              { label: "8", value: "8", color: "#22c55e" },
              { label: "9", value: "9", color: "#16a34a" },
              { label: "10", value: "10", color: "#15803d" },
            ]}
            selectedValue={String(energyLevel)}
            onSelect={(v) => setEnergyLevel(parseInt(v))}
          />

          <SegmentedSelector
            label="Breathlessness"
            options={[
              { label: "No", value: "none", color: "#10b981" },
              { label: "Exercise Only", value: "exercise", color: "#f59e0b" },
              { label: "Chores/Walking", value: "chores", color: "#f97316" },
              { label: "While Resting", value: "resting", color: "#ef4444" },
            ]}
            selectedValue={breathlessness}
            onSelect={(v) => setBreathlessness(v as any)}
          />

          <SegmentedSelector
            label="Dizziness"
            options={[
              { label: "No", value: "none", color: "#10b981" },
              { label: "Standing Up", value: "standing", color: "#f59e0b" },
              { label: "Constant", value: "constant", color: "#f97316" },
              { label: "I Fainted", value: "fainted", color: "#ef4444" },
            ]}
            selectedValue={dizziness}
            onSelect={(v) => setDizziness(v as any)}
          />

          <View className="h-px bg-slate-100 my-6" />

          {/* SECTION B: PHYSICAL SIGNS */}
          <Text className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            B. Physical Signs
          </Text>

          <SegmentedSelector
            label="Heart Rate"
            options={[
              { label: "Normal", value: "none", color: "#10b981" },
              {
                label: "Occasionally",
                value: "occasionally",
                color: "#f59e0b",
              },
              { label: "Constantly", value: "constantly", color: "#ef4444" },
            ]}
            selectedValue={heartRate}
            onSelect={(v) => setHeartRate(v as any)}
          />

          <SegmentedSelector
            label="Pallor Check (Skin/Eyes)"
            options={[
              { label: "Normal", value: "normal", color: "#10b981" },
              { label: "Slightly Pale", value: "slightly", color: "#f59e0b" },
              { label: "Very Pale", value: "very", color: "#ef4444" },
            ]}
            selectedValue={pallor}
            onSelect={(v) => setPallor(v as any)}
          />

          <SegmentedSelector
            label="Cold Hands/Feet"
            options={[
              { label: "No", value: "no", color: "#10b981" },
              { label: "Yes", value: "yes", color: "#3b82f6" },
            ]}
            selectedValue={coldExtremities ? "yes" : "no"}
            onSelect={(v) => setColdExtremities(v === "yes")}
          />

          <View className="h-px bg-slate-100 my-6" />

          {/* SECTION C: WOMEN-SPECIFIC */}
          <Text className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            C. Women-Specific
          </Text>

          <SegmentedSelector
            label="Are you on your period?"
            options={[
              { label: "No", value: "no", color: "#64748b" },
              { label: "Yes", value: "yes", color: "#ec4899" },
            ]}
            selectedValue={isOnPeriod ? "yes" : "no"}
            onSelect={(v) => setIsOnPeriod(v === "yes")}
          />

          {isOnPeriod && (
            <SegmentedSelector
              label="Flow Intensity"
              options={[
                { label: "Light", value: "light", color: "#f9a8d4" },
                { label: "Medium", value: "medium", color: "#f471b5" },
                { label: "Heavy", value: "heavy", color: "#db2777" },
                { label: "Very Heavy", value: "very_heavy", color: "#9d174d" },
              ]}
              selectedValue={periodFlow || "medium"}
              onSelect={(v) => setPeriodFlow(v as any)}
            />
          )}

          <SegmentedSelector
            label="Are you pregnant?"
            options={[
              { label: "No", value: "no", color: "#10b981" },
              { label: "Yes", value: "yes", color: "#ef4444" },
            ]}
            selectedValue={pregnancySpotting ? "yes" : "no"}
            onSelect={(v) => setPregnancySpotting(v === "yes")}
          />

          <View className="h-px bg-slate-100 my-6" />

          {/* SECTION D: COMPLIANCE & RED FLAGS */}
          <Text className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">
            D. Critical Checks
          </Text>

          <SegmentedSelector
            label="Black or tarry stools?"
            options={[
              { label: "No", value: "no", color: "#10b981" },
              { label: "Yes", value: "yes", color: "#000000" },
            ]}
            selectedValue={stoolColorBlack ? "yes" : "no"}
            onSelect={(v) => setStoolColorBlack(v === "yes")}
          />

          <SegmentedSelector
            label="Took Iron Supplement?"
            options={[
              { label: "No", value: "no", color: "#ef4444" },
              { label: "Yes", value: "yes", color: "#10b981" },
            ]}
            selectedValue={suppUsage}
            onSelect={(v) => setSuppUsage(v as any)}
          />

          <Text className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
            Hemoglobin (Hb) - Optional
          </Text>
          <View className="flex-row items-center gap-2 mb-4">
            <TextInput
              className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-800 border border-slate-200"
              placeholder="e.g. 11.5"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={hemoglobin}
              onChangeText={setHemoglobin}
            />
            <Text className="text-sm text-slate-400 font-bold">g/dL</Text>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="w-full bg-primary py-4 rounded-2xl items-center mb-6 shadow-sm active:opacity-90"
          style={{ backgroundColor: "#ec4899" }}
        >
          <Text className="text-white font-bold text-lg">
            {hasLoggedToday ? "Update Today's Log" : "Save Daily Log"}
          </Text>
        </Pressable>

        {/* Disclaimer */}
        <View className="bg-slate-100 p-4 rounded-xl mb-10">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialIcons name="info" size={16} color="#64748b" />
            <Text className="text-xs font-bold text-slate-500 uppercase">
              Medical Disclaimer
            </Text>
          </View>
          <Text className="text-[10px] text-slate-500 leading-4">
            This analysis is based on your inputs and is for informational
            purposes only. It does not replace professional medical advice. In
            an emergency, call your local emergency number immediately.
          </Text>
        </View>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
