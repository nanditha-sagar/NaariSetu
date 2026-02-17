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
  ANEMIA_SYMPTOMS,
  SEVERITY_OPTIONS,
  FOOD_FREQUENCY_OPTIONS,
  SUPPLEMENT_OPTIONS,
  AnemiaLogEntry,
  AnemiaInsights,
  Severity,
  getAnemiaLogs,
  getTodayLog,
  saveAnemiaLog,
  generateAnemiaInsights,
  computeDailyRiskScore,
  getToday,
  getRiskColor,
  getTrendIcon,
} from "@/utils/trackerData";

export default function AnemiaTrackerScreen() {
  const [symptoms, setSymptoms] = useState<Record<string, Severity>>({});
  const [foodFreq, setFoodFreq] = useState<string>("sometimes");
  const [suppUsage, setSuppUsage] = useState<string>("no");
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
      setSymptoms(todayLog.symptoms);
      setFoodFreq(todayLog.ironFoodFrequency);
      setSuppUsage(todayLog.supplementUsage);
      if (todayLog.hemoglobin) setHemoglobin(String(todayLog.hemoglobin));
      setHasLoggedToday(true);
    } else {
      // Initialize symptoms to "none"
      const init: Record<string, Severity> = {};
      ANEMIA_SYMPTOMS.forEach((s) => (init[s.id] = "none"));
      setSymptoms(init);
      setHasLoggedToday(false);
    }

    // Insights
    if (logs.length > 0) {
      setInsights(generateAnemiaInsights(logs));
    }

    // Week scores for chart
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
      symptoms,
      ironFoodFrequency: foodFreq as any,
      supplementUsage: suppUsage as any,
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
      {/* Header */}
      <View className="flex-row items-center px-6 py-3 gap-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <MaterialIcons name="arrow-back-ios" size={20} color="#64748b" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-900">
            🩸 Anemia Tracker
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Track symptoms & get AI insights
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
        {/* ─── AI Insights Card ─── */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-5">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="auto-awesome" size={18} color="#f471b5" />
            <Text className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              AI Insights
            </Text>
          </View>

          {insights ? (
            <View>
              {/* Risk Score + Trend Row */}
              <View className="flex-row items-center justify-between mb-4">
                {/* Risk Gauge */}
                <View className="items-center">
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center border-4"
                    style={{ borderColor: getRiskColor(insights.riskScore) }}
                  >
                    <Text
                      className="text-2xl font-bold"
                      style={{ color: getRiskColor(insights.riskScore) }}
                    >
                      {insights.riskScore}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                    Risk Score
                  </Text>
                </View>

                {/* Risk Level */}
                <View className="items-center">
                  <View
                    className="px-4 py-2 rounded-full"
                    style={{
                      backgroundColor:
                        insights.riskLevel === "High"
                          ? "rgba(239,68,68,0.1)"
                          : insights.riskLevel === "Medium"
                            ? "rgba(245,158,11,0.1)"
                            : "rgba(16,185,129,0.1)",
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{
                        color: getRiskColor(
                          insights.riskLevel === "High"
                            ? 70
                            : insights.riskLevel === "Medium"
                              ? 40
                              : 10,
                        ),
                      }}
                    >
                      {insights.riskLevel} Risk
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

              {/* Alerts */}
              {insights.alerts.length > 0 && (
                <View>
                  {insights.alerts.map((alert, i) => (
                    <View
                      key={i}
                      className="flex-row items-start gap-2 p-3 rounded-lg mb-2"
                      style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
                    >
                      <MaterialIcons name="warning" size={16} color="#ef4444" />
                      <Text className="flex-1 text-xs text-red-700 leading-5">
                        {alert}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
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
            7-Day Risk Overview
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
                    style={{ color: getRiskColor(item.score) }}
                  >
                    {item.score > 0 ? item.score : ""}
                  </Text>
                  <View
                    className="w-6 rounded-t-md"
                    style={{
                      height: barH,
                      backgroundColor:
                        item.score > 0 ? getRiskColor(item.score) : "#e2e8f0",
                    }}
                  />
                  <Text
                    className={`text-[10px] mt-1 ${isToday ? "font-bold text-primary" : "text-slate-400"}`}
                  >
                    {dayLabels[dayIdx]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ─── Daily Log Section ─── */}
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

          {/* Symptoms */}
          <Text className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
            Symptoms
          </Text>
          {ANEMIA_SYMPTOMS.map((symptom) => (
            <View key={symptom.id} className="mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialIcons
                  name={symptom.icon as any}
                  size={16}
                  color="#64748b"
                />
                <Text className="text-sm font-medium text-slate-700">
                  {symptom.label}
                </Text>
              </View>
              <View className="flex-row gap-2">
                {SEVERITY_OPTIONS.map((opt) => {
                  const isSelected = symptoms[symptom.id] === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() =>
                        setSymptoms((prev) => ({
                          ...prev,
                          [symptom.id]: opt.value,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg border items-center ${isSelected ? "border-transparent" : "border-slate-200"
                        }`}
                      style={
                        isSelected
                          ? { backgroundColor: opt.color }
                          : { backgroundColor: "white" }
                      }
                    >
                      <Text
                        className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-500"
                          }`}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Divider */}
          <View className="h-px bg-slate-100 my-4" />

          {/* Lifestyle */}
          <Text className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
            Lifestyle
          </Text>

          {/* Iron-rich food */}
          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="restaurant" size={16} color="#64748b" />
              <Text className="text-sm font-medium text-slate-700">
                Iron-rich food intake
              </Text>
            </View>
            <View className="flex-row gap-2">
              {FOOD_FREQUENCY_OPTIONS.map((opt) => {
                const isSelected = foodFreq === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setFoodFreq(opt.value)}
                    className={`flex-1 py-2 rounded-lg border items-center ${isSelected
                        ? "bg-primary border-primary"
                        : "border-slate-200 bg-white"
                      }`}
                    style={
                      isSelected
                        ? { backgroundColor: "#f471b5", borderColor: "#f471b5" }
                        : undefined
                    }
                  >
                    <Text
                      className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-500"
                        }`}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Supplements */}
          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="medication" size={16} color="#64748b" />
              <Text className="text-sm font-medium text-slate-700">
                Iron supplements
              </Text>
            </View>
            <View className="flex-row gap-2">
              {SUPPLEMENT_OPTIONS.map((opt) => {
                const isSelected = suppUsage === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setSuppUsage(opt.value)}
                    className={`flex-1 py-2 rounded-lg border items-center ${isSelected
                        ? "bg-primary border-primary"
                        : "border-slate-200 bg-white"
                      }`}
                    style={
                      isSelected
                        ? { backgroundColor: "#f471b5", borderColor: "#f471b5" }
                        : undefined
                    }
                  >
                    <Text
                      className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-500"
                        }`}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-slate-100 my-4" />

          {/* Optional Lab */}
          <Text className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
            Lab Value (Optional)
          </Text>
          <View className="flex-row items-center gap-3 mb-2">
            <MaterialIcons name="science" size={16} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">
              Hemoglobin (Hb)
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-800 border border-slate-200"
              placeholder="e.g. 11.5"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={hemoglobin}
              onChangeText={setHemoglobin}
            />
            <Text className="text-sm text-slate-400 font-medium">g/dL</Text>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="w-full bg-primary py-4 rounded-xl items-center mb-6 active:opacity-90"
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
