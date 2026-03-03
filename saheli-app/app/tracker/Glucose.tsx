import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GlucoseLogEntry,
  GlucoseInsights,
  getGlucoseLogs,
  saveGlucoseLog,
  generateGlucoseInsights,
  getToday,
} from "@/utils/trackerData";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function GlucoseTrackerScreen() {
  const [value, setValue] = useState<string>("");
  const [timing, setTiming] = useState<GlucoseLogEntry["timing"]>("fasting");
  const [hypoSymptoms, setHypoSymptoms] = useState<
    GlucoseLogEntry["hypoSymptoms"]
  >([]);
  const [hyperSymptoms, setHyperSymptoms] = useState<
    GlucoseLogEntry["hyperSymptoms"]
  >([]);
  const [carbIntake, setCarbIntake] =
    useState<GlucoseLogEntry["carbIntake"]>("medium");
  const [exercise, setExercise] = useState<boolean>(false);
  const [tookMeds, setTookMeds] = useState<boolean>(true);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);

  const [insights, setInsights] = useState<GlucoseInsights | null>(null);

  const loadData = useCallback(async () => {
    const logs = await getGlucoseLogs();
    const today = getToday();
    const todayLog = logs.find((l) => l.date === today);

    if (todayLog) {
      setValue(String(todayLog.value));
      setTiming(todayLog.timing);
      setHypoSymptoms(todayLog.hypoSymptoms);
      setHyperSymptoms(todayLog.hyperSymptoms);
      setCarbIntake(todayLog.carbIntake);
      setExercise(todayLog.exercise);
      setTookMeds(todayLog.tookMeds);
      setIsPregnant(todayLog.isPregnant);
      setInsights(generateGlucoseInsights(todayLog));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    if (!value) {
      Alert.alert("Missing Value", "Please enter your glucose reading.");
      return;
    }

    const entry: GlucoseLogEntry = {
      date: getToday(),
      value: parseFloat(value),
      unit: "mg/dL",
      timing,
      hypoSymptoms,
      hyperSymptoms,
      carbIntake,
      exercise,
      tookMeds,
      isPregnant,
      timestamp: new Date().toISOString(),
    };

    await saveGlucoseLog(entry);
    setInsights(generateGlucoseInsights(entry));
    Alert.alert("Success", "Glucose log saved successfully!");
  };

  const toggleHypoSymptom = (sym: GlucoseLogEntry["hypoSymptoms"][0]) => {
    setHypoSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
  };

  const toggleHyperSymptom = (sym: GlucoseLogEntry["hyperSymptoms"][0]) => {
    setHyperSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
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
            Glucose Tracker
          </Text>
        </View>

        {/* Triage Card */}
        {insights && (
          <View className="mb-8">
            <TriageZoneCard
              zone={
                insights.triageZone === "Yellow" ||
                insights.triageZone === "Orange"
                  ? "Amber"
                  : (insights.triageZone as any)
              }
              message={insights.triageMessage}
              suggestions={insights.triageSuggestions}
            />
          </View>
        )}

        {/* Vitals Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="straighten" size={20} color="#a855f7" />
            <Text className="text-lg font-bold text-slate-800">
              Reading (mg/dL)
            </Text>
          </View>

          <TextInput
            className="bg-slate-50 p-4 rounded-xl text-3xl font-bold text-slate-900 text-center mb-6"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
            placeholder="100"
          />

          <SegmentedSelector
            label="When was this measured?"
            options={[
              { label: "Fasting", value: "fasting" },
              { label: "Pre-Meal", value: "pre_meal" },
              { label: "Post-Meal", value: "post_meal" },
              { label: "Bedtime", value: "bedtime" },
            ]}
            selectedValue={timing}
            onSelect={(v) => setTiming(v as any)}
          />
        </View>

        {/* Symptoms Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">
            Are you feeling...?
          </Text>

          <Text className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">
            Hypoglycemia (Low)
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {[
              { id: "shaky", label: "Shaky" },
              { id: "sweaty", label: "Sweaty" },
              { id: "heart_racing", label: "Racing Heart" },
              { id: "hungry", label: "Intense Hunger" },
              { id: "confused", label: "Confused" },
            ].map((s) => (
              <Pressable
                key={s.id}
                onPress={() => toggleHypoSymptom(s.id as any)}
                className={`px-4 py-2 rounded-full border ${hypoSymptoms.includes(s.id as any) ? "bg-red-100 border-red-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${hypoSymptoms.includes(s.id as any) ? "text-red-700 font-bold" : "text-slate-600"}`}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">
            Hyperglycemia (High)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              { id: "thirsty", label: "Thirsty" },
              { id: "frequent_urination", label: "Frequent Urination" },
              { id: "blurry_vision", label: "Blurry Vision" },
              { id: "nausea", label: "Nausea" },
              { id: "stomach_pain", label: "Stomach Pain" },
            ].map((s) => (
              <Pressable
                key={s.id}
                onPress={() => toggleHyperSymptom(s.id as any)}
                className={`px-4 py-2 rounded-full border ${hyperSymptoms.includes(s.id as any) ? "bg-orange-100 border-orange-200" : "bg-slate-50 border-slate-100"}`}
              >
                <Text
                  className={`text-sm ${hyperSymptoms.includes(s.id as any) ? "text-orange-700 font-bold" : "text-slate-600"}`}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Context Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-6">Context</Text>

          <SegmentedSelector
            label="Carb Intake recently?"
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "Heavy", value: "heavy", color: "#f59e0b" },
            ]}
            selectedValue={carbIntake}
            onSelect={(v) => setCarbIntake(v as any)}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Did you exercise today?"
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes", color: "#10b981" },
            ]}
            selectedValue={exercise ? "yes" : "no"}
            onSelect={(v) => setExercise(v === "yes")}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Took your medications?"
            options={[
              { label: "Yes", value: "yes", color: "#10b981" },
              { label: "No", value: "no", color: "#ef4444" },
            ]}
            selectedValue={tookMeds ? "yes" : "no"}
            onSelect={(v) => setTookMeds(v === "yes")}
          />
        </View>

        {/* Women Specific */}
        <View className="bg-purple-50 rounded-2xl p-6 border border-purple-100 mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="pregnant-woman" size={20} color="#9333ea" />
            <Text className="text-lg font-bold text-purple-900">
              Women's Health
            </Text>
          </View>

          <SegmentedSelector
            label="Are you pregnant? (Gestational mode)"
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes", color: "#9333ea" },
            ]}
            selectedValue={isPregnant ? "yes" : "no"}
            onSelect={(v) => setIsPregnant(v === "yes")}
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl mb-8 items-center shadow-lg shadow-pink-200"
        >
          <Text className="text-white font-bold text-lg">Save Glucose Log</Text>
        </Pressable>

        <Text className="text-slate-400 text-xs text-center mb-12 italic">
          Disclaimer: This app tracks trends. Adjusting insulin based solely on
          an app without doctor input is dangerous.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
