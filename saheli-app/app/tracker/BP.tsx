import React, { useState, useEffect, useCallback } from "react";
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
  BPLogEntry,
  BPInsights,
  getBPLogs,
  getTodayBPLog,
  saveBPLog,
  generateBPInsights,
  computeBPScore,
  getToday,
} from "@/utils/trackerData";
import TriageZoneCard from "@/components/TriageZoneCard";
import SegmentedSelector from "@/components/SegmentedSelector";

export default function BPTrackerScreen() {
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");
  const [pulse, setPulse] = useState<string>("");
  const [position, setPosition] = useState<BPLogEntry["position"]>("Sitting");
  const [arm, setArm] = useState<BPLogEntry["arm"]>("Left");
  const [rested, setRested] = useState<boolean>(true);

  const [headache, setHeadache] = useState<BPLogEntry["headache"]>("none");
  const [vision, setVision] = useState<BPLogEntry["vision"]>("normal");
  const [chestBreathing, setChestBreathing] =
    useState<BPLogEntry["chestBreathing"]>("none");
  const [neurological, setNeurological] =
    useState<BPLogEntry["neurological"]>("none");

  const [highSalt, setHighSalt] = useState<boolean>(false);
  const [tookMeds, setTookMeds] = useState<boolean>(true);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [swelling, setSwelling] = useState<boolean>(false);
  const [bellyPain, setBellyPain] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  const [insights, setInsights] = useState<BPInsights | null>(null);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const loadData = useCallback(async () => {
    const logs = await getBPLogs();
    const todayLog = await getTodayBPLog();

    if (todayLog) {
      setSystolic(String(todayLog.systolic));
      setDiastolic(String(todayLog.diastolic));
      setPulse(String(todayLog.pulse));
      setPosition(todayLog.position || "Sitting");
      setArm(todayLog.arm || "Left");
      setRested(todayLog.rested5Min);
      setHeadache(todayLog.headache);
      setVision(todayLog.vision);
      setChestBreathing(todayLog.chestBreathing);
      setNeurological(todayLog.neurological);
      setHighSalt(todayLog.highSalt);
      setTookMeds(todayLog.tookMeds);
      setStressLevel(todayLog.stressLevel);
      setIsPregnant(todayLog.isPregnant);
      if (todayLog.preeclampsiaSwelling !== undefined)
        setSwelling(todayLog.preeclampsiaSwelling);
      if (todayLog.preeclampsiaBellyPain !== undefined)
        setBellyPain(todayLog.preeclampsiaBellyPain);
      if (todayLog.notes) setNotes(todayLog.notes);
      setHasLoggedToday(true);
    }

    if (logs.length > 0) {
      setInsights(generateBPInsights(logs));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleSave = async () => {
    if (!systolic || !diastolic || !pulse) {
      Alert.alert(
        "Missing Fields",
        "Please enter your Systolic, Diastolic, and Pulse readings.",
      );
      return;
    }

    const entry: BPLogEntry = {
      date: getToday(),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: parseInt(pulse),
      position,
      arm,
      rested5Min: rested,
      headache,
      vision,
      chestBreathing,
      neurological,
      highSalt,
      tookMeds,
      stressLevel,
      isPregnant,
      preeclampsiaSwelling: swelling,
      preeclampsiaBellyPain: bellyPain,
      notes,
      timestamp: new Date().toISOString(),
    };

    await saveBPLog(entry);
    Alert.alert("Success", "Daily BP log saved successfully!");
    loadData();
  };

  const callEmergency = () => {
    Linking.openURL("tel:102"); // Example emergency number for India (Ambulance)
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Normal":
        return "#10b981";
      case "Elevated":
        return "#f59e0b";
      case "Stage 1":
        return "#f97316";
      case "Stage 2":
        return "#ef4444";
      case "Crisis":
        return "#b91c1c";
      case "Low":
        return "#3b82f6";
      default:
        return "#64748b";
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
          <Text className="text-2xl font-bold text-slate-900">BP Tracker</Text>
        </View>

        {/* Categories / Insights Table */}
        {insights && (
          <View className="mb-8">
            <TriageZoneCard
              zone={
                insights.triageZone === "Yellow"
                  ? "Amber"
                  : insights.triageZone === "Orange"
                    ? "Amber"
                    : insights.triageZone
              }
              message={insights.triageMessage}
              suggestions={insights.triageSuggestions}
            />

            <View className="flex-row items-center justify-between bg-white p-4 rounded-xl mt-4 border border-slate-100 shadow-sm">
              <Text className="text-slate-600 font-bold">
                Clinical Category:
              </Text>
              <View
                style={{ backgroundColor: getCategoryColor(insights.category) }}
                className="px-3 py-1 rounded-full"
              >
                <Text className="text-white font-bold text-xs">
                  {insights.category}
                </Text>
              </View>
            </View>

            {/* Averages Section */}
            <View className="bg-slate-900 rounded-2xl p-6 mt-4">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                Averages & Trends
              </Text>
              <View className="flex-row gap-6">
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">
                    {insights.dailyAvg.systolic}/{insights.dailyAvg.diastolic}
                  </Text>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold">
                    Today's Avg
                  </Text>
                </View>
                <View className="flex-1 border-l border-slate-800 pl-6">
                  <Text className="text-white text-2xl font-bold">
                    {insights.weekAvg.systolic}/{insights.weekAvg.diastolic}
                  </Text>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold">
                    Weekly Avg
                  </Text>
                </View>
              </View>
            </View>

            {insights.triageZone === "Red" && (
              <Pressable
                onPress={callEmergency}
                className="mt-4 bg-red-600 p-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-red-200"
              >
                <MaterialIcons name="phone" size={24} color="white" />
                <Text className="text-white font-bold text-lg uppercase">
                  Get Emergency Help
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Vitals Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="monitor-heart" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Mandatory Vitals
            </Text>
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                Systolic (mmHg)
              </Text>
              <TextInput
                className="bg-slate-50 p-4 rounded-xl text-xl font-bold text-slate-900 border border-slate-100"
                keyboardType="numeric"
                value={systolic}
                onChangeText={setSystolic}
                placeholder="120"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                Diastolic (mmHg)
              </Text>
              <TextInput
                className="bg-slate-50 p-4 rounded-xl text-xl font-bold text-slate-900 border border-slate-100"
                keyboardType="numeric"
                value={diastolic}
                onChangeText={setDiastolic}
                placeholder="80"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
              Pulse Rate (BPM)
            </Text>
            <TextInput
              className="bg-slate-50 p-4 rounded-xl text-xl font-bold text-slate-900 border border-slate-100"
              keyboardType="numeric"
              value={pulse}
              onChangeText={setPulse}
              placeholder="72"
            />
          </View>

          <SegmentedSelector
            label="Did you rest (quietly) for 5 mins?"
            options={[
              { label: "Yes", value: "yes", color: "#10b981" },
              { label: "No", value: "no", color: "#f59e0b" },
            ]}
            selectedValue={rested ? "yes" : "no"}
            onSelect={(v) => {
              if (v === "no")
                Alert.alert(
                  "Accuracy Tip",
                  "Resting improves measurement accuracy. Try to sit quietly for 5 minutes before your next check.",
                );
              setRested(v === "yes");
            }}
          />
        </View>

        {/* Contextual Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="chair" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Measurement Context
            </Text>
          </View>

          <SegmentedSelector
            label="Measurement Position"
            options={[
              { label: "Sitting", value: "Sitting" },
              { label: "Standing", value: "Standing" },
              { label: "Lying Down", value: "Lying Down" },
            ]}
            selectedValue={position}
            onSelect={(v) => setPosition(v as any)}
          />

          <View className="h-6" />

          <SegmentedSelector
            label="Which arm was used?"
            options={[
              { label: "Left Arm", value: "Left" },
              { label: "Right Arm", value: "Right" },
            ]}
            selectedValue={arm}
            onSelect={(v) => setArm(v as any)}
          />
        </View>

        {/* Symptoms Section */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="warning" size={20} color="#ec4899" />
            <Text className="text-lg font-bold text-slate-800">
              Symptom Log (Optional)
            </Text>
          </View>

          <SegmentedSelector
            label="Headache?"
            options={[
              { label: "None", value: "none" },
              { label: "Mild", value: "mild", color: "#f59e0b" },
              { label: "Severe", value: "severe", color: "#ef4444" },
              { label: "Severe+", value: "thunderclap", color: "#b91c1c" },
            ]}
            selectedValue={headache}
            onSelect={(v) => setHeadache(v as any)}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Vision Changes"
            options={[
              { label: "Normal", value: "normal" },
              { label: "Blurry", value: "blurry", color: "#f59e0b" },
              { label: "Spots", value: "spots", color: "#ef4444" },
            ]}
            selectedValue={vision}
            onSelect={(v) => setVision(v as any)}
          />

          <View className="h-4" />

          <SegmentedSelector
            label="Chest/Breathing"
            options={[
              { label: "Normal", value: "none" },
              { label: "Shortness", value: "shortness", color: "#f59e0b" },
              { label: "Pain", value: "pain", color: "#ef4444" },
            ]}
            selectedValue={chestBreathing}
            onSelect={(v) => setChestBreathing(v as any)}
          />
        </View>

        {/* Women Specific Section */}
        <View className="bg-pink-50 rounded-2xl p-6 border border-pink-100 mb-6">
          <View className="flex-row items-center gap-2 mb-6">
            <MaterialIcons name="pregnant-woman" size={20} color="#db2777" />
            <Text className="text-lg font-bold text-pink-900">
              Women's Health
            </Text>
          </View>

          <SegmentedSelector
            label="Are you pregnant?"
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes", color: "#db2777" },
            ]}
            selectedValue={isPregnant ? "yes" : "no"}
            onSelect={(v) => setIsPregnant(v === "yes")}
          />

          {isPregnant && (
            <View className="mt-4 pt-4 border-t border-pink-200">
              <SegmentedSelector
                label="Swelling in face or hands?"
                options={[
                  { label: "No", value: "no" },
                  { label: "Yes", value: "yes", color: "#ef4444" },
                ]}
                selectedValue={swelling ? "yes" : "no"}
                onSelect={(v) => setSwelling(v === "yes")}
              />
              <View className="h-4" />
              <SegmentedSelector
                label="Pain in upper right belly?"
                options={[
                  { label: "No", value: "no" },
                  { label: "Yes", value: "yes", color: "#ef4444" },
                ]}
                selectedValue={bellyPain ? "yes" : "no"}
                onSelect={(v) => setBellyPain(v === "yes")}
              />
            </View>
          )}
        </View>

        {/* Extra Context */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-6">
            Additional Context
          </Text>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs font-semibold text-slate-500 uppercase">
                Stress Level
              </Text>
              <Text className="text-xs font-bold text-slate-700">
                {stressLevel}/10
              </Text>
            </View>
            <View className="flex-row gap-1">
              {[...Array(10)].map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setStressLevel(i + 1)}
                  className={`flex-1 h-2 rounded-full ${stressLevel >= i + 1 ? "bg-pink-500" : "bg-slate-100"}`}
                />
              ))}
            </View>
          </View>

          <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
            Notes
          </Text>
          <TextInput
            className="bg-slate-50 p-4 rounded-xl text-slate-900 border border-slate-100"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            placeholder="Write any observation or dietary notes here..."
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          className="bg-primary p-5 rounded-2xl mb-8 items-center shadow-lg shadow-pink-200"
        >
          <Text className="text-white font-bold text-lg">
            Save Blood Pressure Log
          </Text>
        </Pressable>

        {/* Disclaimer */}
        <View className="bg-slate-100 p-6 rounded-2xl mb-12">
          <Text className="text-slate-500 text-xs text-center leading-5 italic">
            This app tracks trends and provides information based on clinical
            guidelines. It is not a substitute for clinical judgment.
            {"\n"}
            {"\n"}
            If you are in immediate distress, call emergency services.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
