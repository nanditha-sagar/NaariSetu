import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PeriodLogEntry,
  PeriodInsights,
  getPeriodLogs,
  savePeriodLog,
  generatePeriodInsights,
  getToday,
  Severity,
} from "@/utils/trackerData";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function PeriodTrackerScreen() {
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [flow, setFlow] = useState<PeriodLogEntry["flow"]>("none");

  const [cramps, setCramps] = useState<Severity>("none");
  const [mood, setMood] = useState<boolean>(false);
  const [bloating, setBloating] = useState<boolean>(false);
  const [breastTenderness, setBreastTenderness] = useState<boolean>(false);
  const [headache, setHeadache] = useState<boolean>(false);
  const [backPain, setBackPain] = useState<boolean>(false);
  const [acne, setAcne] = useState<boolean>(false);
  const [fatigue, setFatigue] = useState<boolean>(false);

  const [spotting, setSpotting] = useState<boolean>(false);
  const [clotting, setClotting] = useState<boolean>(false);
  const [irregularCycle, setIrregularCycle] = useState<boolean>(false);
  const [missedPeriod, setMissedPeriod] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  const [insights, setInsights] = useState<PeriodInsights | null>(null);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    const logs = await getPeriodLogs();
    const todayLog = logs.find((l) => l.date === getToday());

    if (todayLog) {
      setIsStart(todayLog.isStart);
      setIsEnd(todayLog.isEnd);
      setFlow(todayLog.flow);
      setCramps(todayLog.symptoms.cramps);
      setMood(todayLog.symptoms.mood);
      setBloating(todayLog.symptoms.bloating);
      setBreastTenderness(todayLog.symptoms.breastTenderness);
      setHeadache(todayLog.symptoms.headache);
      setBackPain(todayLog.symptoms.backPain);
      setAcne(todayLog.symptoms.acne);
      setFatigue(todayLog.symptoms.fatigue);
      setSpotting(todayLog.additionalData.spotting);
      setClotting(todayLog.additionalData.clotting);
      setIrregularCycle(todayLog.additionalData.irregularCycle);
      setMissedPeriod(todayLog.additionalData.missedPeriod);
      setNotes(todayLog.notes || "");
      setHasLoggedToday(true);
    } else {
      setHasLoggedToday(false);
    }
    setInsights(generatePeriodInsights(todayLog || ({} as any), logs));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    const entry: PeriodLogEntry = {
      date: getToday(),
      isStart,
      isEnd,
      flow,
      symptoms: {
        cramps,
        mood,
        bloating,
        breastTenderness,
        headache,
        backPain,
        acne,
        fatigue,
      },
      additionalData: {
        spotting,
        clotting,
        irregularCycle,
        missedPeriod,
      },
      notes,
      timestamp: new Date().toISOString(),
    };

    await savePeriodLog(entry);
    setHasLoggedToday(true);
    const logs = await getPeriodLogs();
    setInsights(generatePeriodInsights(entry, logs));
    Alert.alert("Saved!", "Your period log has been recorded.");
  };

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case "Menstruation":
        return "❄️";
      case "Follicular":
        return "🌱";
      case "Ovulation":
        return "☀️";
      case "Luteal":
        return "🍂";
      default:
        return "⏳";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mt-6 mb-8">
          <Pressable onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color="#334155" />
          </Pressable>
          <Text className="text-2xl font-bold text-slate-900">
            Period Tracker
          </Text>
          {hasLoggedToday && (
            <View className="ml-auto px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <Text className="text-[10px] font-bold text-emerald-600">
                ✓ LOGGED
              </Text>
            </View>
          )}
        </View>

        {/* Triage Card */}
        {insights && (
          <View className="mb-8">
            <TriageZoneCard
              zone={insights.triageZone}
              message={insights.triageMessage}
              suggestions={insights.triageSuggestions}
            />

            {/* Special Alerts */}
            {insights.alerts.map((alert, i) => (
              <View
                key={i}
                className="bg-red-50 p-4 rounded-xl flex-row items-center gap-2 mb-2 border border-red-100"
              >
                <MaterialIcons name="error-outline" size={20} color="#dc2626" />
                <Text className="text-red-700 font-bold text-sm">{alert}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Predictions & Stats Section */}
        {insights?.cycleDetails && (
          <View className="bg-slate-900 rounded-3xl p-6 mb-8 shadow-xl">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Current Phase
                </Text>
                <Text className="text-pink-400 text-xl font-bold">
                  {insights.phase} {getPhaseEmoji(insights.phase)}
                </Text>
              </View>
              <View className="bg-white/10 px-3 py-1.5 rounded-full">
                <Text className="text-white text-xs font-bold">
                  {insights.cycleDetails.regularityStatus}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-4">
              <View className="w-[45%] bg-white/10 p-4 rounded-2xl">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                  Next Period
                </Text>
                <Text className="text-white text-sm font-bold">
                  {new Date(
                    insights.cycleDetails.nextPeriodDate,
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View className="w-[45%] bg-white/10 p-4 rounded-2xl">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                  Ovulation
                </Text>
                <Text className="text-white text-sm font-bold">
                  {new Date(
                    insights.cycleDetails.ovulationDate,
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View className="w-[45%] bg-white/10 p-4 rounded-2xl">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                  Cycle Length
                </Text>
                <Text className="text-white text-lg font-bold">
                  {insights.cycleDetails.avgCycleLength} Days
                </Text>
              </View>
              <View className="w-[45%] bg-white/10 p-4 rounded-2xl">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                  Current Day
                </Text>
                <Text className="text-white text-lg font-bold">
                  Day {insights.cycleDetails.currentCycleLength}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* History Timeline */}
        {insights?.historyTimeline && insights.historyTimeline.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Period History
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3 px-1">
                {insights.historyTimeline.reverse().map((h, i) => (
                  <View
                    key={i}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm items-center min-w-[100px]"
                  >
                    <Text className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                      {new Date(h.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mb-2 ${h.type === "Start" ? "bg-pink-100" : h.type === "End" ? "bg-slate-100" : "bg-red-50"}`}
                    >
                      <MaterialIcons
                        name={
                          h.type === "Start"
                            ? "play-arrow"
                            : h.type === "End"
                              ? "stop"
                              : "water-drop"
                        }
                        size={16}
                        color={h.type === "End" ? "#64748b" : "#ec4899"}
                      />
                    </View>
                    <Text className="text-slate-700 font-bold text-xs">
                      {h.type}
                    </Text>
                    {h.flow && h.flow !== "none" && (
                      <Text className="text-pink-500 text-[10px] font-medium mt-1">
                        {h.flow}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Mandatory Data */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="calendar-today" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Today's Flow
            </Text>
          </View>

          <SegmentedSelector
            label="Flow Level per Day"
            options={[
              { label: "None", value: "none" },
              { label: "Light", value: "light" },
              { label: "Moderate", value: "moderate" },
              { label: "Heavy", value: "heavy", color: "#ef4444" },
            ]}
            selectedValue={flow}
            onSelect={(v) => setFlow(v as any)}
          />

          <View className="h-6" />

          <View className="flex-row gap-4">
            <Pressable
              onPress={() => setIsStart(!isStart)}
              className={`flex-1 p-4 rounded-2xl border flex-row items-center justify-center gap-2 ${isStart ? "bg-pink-100 border-pink-200" : "bg-slate-50 border-slate-100"}`}
            >
              <MaterialIcons
                name={isStart ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={isStart ? "#ec4899" : "#64748b"}
              />
              <Text
                className={`font-bold ${isStart ? "text-pink-700" : "text-slate-600"}`}
              >
                Period Start
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setIsEnd(!isEnd)}
              className={`flex-1 p-4 rounded-2xl border flex-row items-center justify-center gap-2 ${isEnd ? "bg-pink-100 border-pink-200" : "bg-slate-50 border-slate-100"}`}
            >
              <MaterialIcons
                name={isEnd ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={isEnd ? "#ec4899" : "#64748b"}
              />
              <Text
                className={`font-bold ${isEnd ? "text-pink-700" : "text-slate-600"}`}
              >
                Period End
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Symptoms Tracking */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="health-and-safety" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">Symptoms</Text>
          </View>

          <SegmentedSelector
            label="Cramps Intensity"
            options={[
              { label: "None", value: "none" },
              { label: "Mild", value: "mild" },
              { label: "Moderate", value: "moderate", color: "#f59e0b" },
              { label: "Severe", value: "severe", color: "#ef4444" },
            ]}
            selectedValue={cramps}
            onSelect={(v) => setCramps(v as any)}
          />

          <View className="h-6" />

          <Text className="text-xs font-bold text-slate-400 uppercase mb-4">
            Other Observations
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              {
                id: "mood",
                label: "Mood Changes",
                state: mood,
                setter: setMood,
              },
              {
                id: "bloating",
                label: "Bloating",
                state: bloating,
                setter: setBloating,
              },
              {
                id: "breast",
                label: "Breast Tenderness",
                state: breastTenderness,
                setter: setBreastTenderness,
              },
              {
                id: "headache",
                label: "Headache",
                state: headache,
                setter: setHeadache,
              },
              {
                id: "back",
                label: "Back Pain",
                state: backPain,
                setter: setBackPain,
              },
              { id: "acne", label: "Acne", state: acne, setter: setAcne },
              {
                id: "fatigue",
                label: "Fatigue",
                state: fatigue,
                setter: setFatigue,
              },
            ].map((s) => (
              <Pressable
                key={s.id}
                onPress={() => s.setter(!s.state)}
                className={`px-4 py-3 rounded-2xl border ${s.state ? "bg-purple-100 border-purple-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${s.state ? "text-purple-700 font-bold" : "text-slate-600"}`}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Additional Health Data */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="assignment" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Cycle Detail
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {[
              {
                id: "spotting",
                label: "Spotting",
                state: spotting,
                setter: setSpotting,
              },
              {
                id: "clotting",
                label: "Clotting",
                state: clotting,
                setter: setClotting,
              },
              {
                id: "irregular",
                label: "Irregular Cycle",
                state: irregularCycle,
                setter: setIrregularCycle,
              },
              {
                id: "missed",
                label: "Missed Period",
                state: missedPeriod,
                setter: setMissedPeriod,
              },
            ].map((d) => (
              <Pressable
                key={d.id}
                onPress={() => d.setter(!d.state)}
                className={`px-4 py-3 rounded-2xl border ${d.state ? "bg-amber-100 border-amber-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${d.state ? "text-amber-700 font-bold" : "text-slate-600"}`}
                >
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="h-6" />

          <Text className="text-xs font-bold text-slate-400 uppercase mb-3">
            Notes
          </Text>
          <TextInput
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Log anything specific..."
            className="bg-slate-50 p-4 rounded-2xl min-h-[100px] border border-slate-100 text-slate-800"
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="bg-pink-500 p-5 rounded-2xl mb-8 items-center shadow-lg shadow-pink-200"
        >
          <Text className="text-white font-bold text-lg">Save Cycle Log</Text>
        </Pressable>

        <Text className="text-slate-400 text-xs text-center mb-12 italic leading-5">
          Disclaimer: Cycle patterns vary per individual. 21-35 days is the
          medical "normal". If you experience sudden changes or extreme pain,
          please consult a gynecologist.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
