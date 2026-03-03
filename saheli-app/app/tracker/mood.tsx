import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  MoodLogEntry,
  MoodInsights,
  getMoodLogs,
  saveMoodLog,
  generateMoodInsights,
  getToday,
} from "@/utils/trackerData";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function MoodTrackerScreen() {
  const [valence, setValence] = useState<number>(5);
  const [anhedonia, setAnhedonia] = useState<MoodLogEntry["anhedonia"]>("none");
  const [anxiety, setAnxiety] = useState<MoodLogEntry["anxiety"]>("calm");
  const [irritability, setIrritability] = useState<boolean>(false);
  const [sleep, setSleep] = useState<MoodLogEntry["sleep"]>("normal");
  const [appetite, setAppetite] = useState<MoodLogEntry["appetite"]>("normal");
  const [focus, setFocus] = useState<MoodLogEntry["focus"]>("normal");
  const [safetyCheck, setSafetyCheck] =
    useState<MoodLogEntry["safetyCheck"]>("no");
  const [isPostpartum, setIsPostpartum] = useState<boolean>(false);

  const [insights, setInsights] = useState<MoodInsights | null>(null);

  const loadData = useCallback(async () => {
    const logs = await getMoodLogs();
    const today = getToday();
    const todayLog = logs.find((l) => l.date === today);

    if (todayLog) {
      setValence(todayLog.valence);
      setAnhedonia(todayLog.anhedonia);
      setAnxiety(todayLog.anxiety);
      setIrritability(todayLog.irritability);
      setSleep(todayLog.sleep);
      setAppetite(todayLog.appetite);
      setFocus(todayLog.focus);
      setSafetyCheck(todayLog.safetyCheck);
      if (todayLog.isPostpartum !== undefined)
        setIsPostpartum(todayLog.isPostpartum);
      setInsights(generateMoodInsights(todayLog));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    const entry: MoodLogEntry = {
      date: getToday(),
      valence,
      anhedonia,
      anxiety,
      irritability,
      sleep,
      appetite,
      focus,
      safetyCheck,
      isPostpartum,
      timestamp: new Date().toISOString(),
    };

    await saveMoodLog(entry);
    setInsights(generateMoodInsights(entry));
    if (entry.safetyCheck !== "no") {
      Alert.alert(
        "Crisis Support",
        "Please reach out to professional help immediately. You are not alone.",
        [
          { text: "Call 988", onPress: () => Linking.openURL("tel:988") },
          { text: "OK" },
        ],
      );
    } else {
      Alert.alert("Success", "Mood log saved successfully!");
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
            Mood Tracker
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
            {insights.triageZone === "Red" && (
              <Pressable
                onPress={() => Linking.openURL("tel:988")}
                className="mt-4 bg-red-600 p-4 rounded-xl flex-row items-center justify-center gap-2"
              >
                <MaterialIcons name="phone" size={24} color="white" />
                <Text className="text-white font-bold text-lg">
                  TALK TO A CRISIS COUNSELOR
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Valence Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-6">
            How do you feel overall?
          </Text>

          <View className="flex-row justify-between mb-4 px-2">
            <Text className="text-2xl">😞</Text>
            <Text className="text-2xl">😐</Text>
            <Text className="text-2xl">😊</Text>
          </View>

          <View className="flex-row gap-1.5 h-12 items-end">
            {[...Array(10)].map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setValence(i + 1)}
                className="flex-1 rounded-t-lg"
                style={{
                  height: `${30 + i * 7}%`,
                  backgroundColor: valence >= i + 1 ? "#f59e0b" : "#f1f5f9",
                }}
              />
            ))}
          </View>
          <Text className="text-center text-xs font-bold text-slate-400 mt-4 uppercase tracking-tighter">
            Scale: {valence}/10
          </Text>
        </View>

        {/* Vitals Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <SegmentedSelector
            label="Finding enjoyment in things?"
            options={[
              { label: "Yes", value: "none" },
              { label: "A little", value: "little" },
              { label: "Not at all", value: "yes", color: "#ef4444" },
            ]}
            selectedValue={anhedonia}
            onSelect={(v) => setAnhedonia(v as any)}
          />

          <View className="h-6" />

          <SegmentedSelector
            label="Anxiety/Tension Level"
            options={[
              { label: "Calm", value: "calm" },
              { label: "Mild", value: "mild" },
              {
                label: "Physical",
                value: "physical_tightness",
                color: "#f59e0b",
              },
              { label: "Panic", value: "panic", color: "#ef4444" },
            ]}
            selectedValue={anxiety}
            onSelect={(v) => setAnxiety(v as any)}
          />

          <View className="h-6" />

          <SegmentedSelector
            label="Easily annoyed/angry?"
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes", color: "#f59e0b" },
            ]}
            selectedValue={irritability ? "yes" : "no"}
            onSelect={(v) => setIrritability(v === "yes")}
          />
        </View>

        {/* Biological Markers */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-6">
            Biological Markers
          </Text>

          <SegmentedSelector
            label="Sleep Quality"
            options={[
              { label: "Normal", value: "normal" },
              { label: "Insomnia", value: "insomnia", color: "#f59e0b" },
              { label: "Hypersomnia", value: "hypersomnia", color: "#ef4444" },
            ]}
            selectedValue={sleep}
            onSelect={(v) => setSleep(v as any)}
          />

          <View className="h-6" />

          <SegmentedSelector
            label="Appetite"
            options={[
              { label: "Normal", value: "normal" },
              { label: "Comfort", value: "comfort" },
              { label: "None", value: "none", color: "#ef4444" },
            ]}
            selectedValue={appetite}
            onSelect={(v) => setAppetite(v as any)}
          />

          <View className="h-6" />

          <SegmentedSelector
            label="Focus"
            options={[
              { label: "Normal", value: "normal" },
              { label: "Foggy", value: "brain_fog" },
              { label: "Racing", value: "racing", color: "#f59e0b" },
            ]}
            selectedValue={focus}
            onSelect={(v) => setFocus(v as any)}
          />
        </View>

        {/* Women Specific */}
        <View className="bg-amber-50 rounded-2xl p-6 border border-amber-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="pregnant-woman" size={20} color="#d97706" />
            <Text className="text-lg font-bold text-amber-900">
              Women's Health
            </Text>
          </View>

          <SegmentedSelector
            label="Are you postpartum?"
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes", color: "#d97706" },
            ]}
            selectedValue={isPostpartum ? "yes" : "no"}
            onSelect={(v) => setIsPostpartum(v === "yes")}
          />
        </View>

        {/* Safety Check */}
        <View className="bg-red-50 rounded-2xl p-6 border border-red-100 mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="security" size={20} color="#dc2626" />
            <Text className="text-lg font-bold text-red-900">Safety Check</Text>
          </View>
          <Text className="text-sm text-red-800 mb-4">
            Have you had thoughts of hurting yourself?
          </Text>

          <Pressable
            onPress={() => setSafetyCheck("no")}
            className={`p-4 rounded-xl mb-2 flex-row items-center justify-between ${safetyCheck === "no" ? "bg-white border-2 border-red-500" : "bg-red-100/50"}`}
          >
            <Text className="font-bold text-slate-700">No</Text>
            {safetyCheck === "no" && (
              <MaterialIcons name="check-circle" size={20} color="#ef4444" />
            )}
          </Pressable>

          <Pressable
            onPress={() => setSafetyCheck("passive")}
            className={`p-4 rounded-xl mb-2 flex-row items-center justify-between ${safetyCheck === "passive" ? "bg-white border-2 border-red-500" : "bg-red-100/50"}`}
          >
            <Text className="font-bold text-slate-700">
              Passive thoughts (e.g. "I wish I wouldn't wake up")
            </Text>
            {safetyCheck === "passive" && (
              <MaterialIcons name="warning" size={20} color="#ef4444" />
            )}
          </Pressable>

          <Pressable
            onPress={() => setSafetyCheck("active")}
            className={`p-4 rounded-xl flex-row items-center justify-between ${safetyCheck === "active" ? "bg-white border-2 border-red-500" : "bg-red-100/50"}`}
          >
            <Text className="font-bold text-slate-700">
              Active thoughts/Planning
            </Text>
            {safetyCheck === "active" && (
              <MaterialIcons name="error" size={20} color="#ef4444" />
            )}
          </Pressable>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl mb-8 items-center shadow-lg shadow-pink-200"
        >
          <Text className="text-white font-bold text-lg">Save Mood Log</Text>
        </Pressable>

        <Text className="text-slate-400 text-xs text-center mb-12 italic">
          Disclaimer: This app tracks mood trends. It is not a replacement for
          therapy or medication.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
