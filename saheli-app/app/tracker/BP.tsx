import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Redirect } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";

import {
  saveBPReading,
  getBPReadings,
  type BPReading,
} from "@/services/healthService";
import {
  classifyBP,
  calculateAverages,
  groupReadingsByDate,
  type BPCategory,
  type AlertStatus,
} from "@/utils/bpLogic";
import MultiSelect from "@/components/MultiSelect";
import { getToday } from "@/utils/trackerData";
import SegmentedSelector from "@/components/SegmentedSelector";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function BPTrackerScreen() {
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [chartType, setChartType] = useState<"Weekly" | "Monthly">("Weekly");
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);

  // Form State
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [position, setPosition] = useState<BPReading["position"]>("Sitting");
  const [arm, setArm] = useState<BPReading["arm"]>("Left");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [stressLevel, setStressLevel] =
    useState<BPReading["stressLevel"]>("Low");
  const [notes, setNotes] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getBPReadings();
    setReadings(data);
    if (
      data.length > 0 &&
      data[0].timestamp &&
      data[0].timestamp.split("T")[0] === getToday()
    ) {
      setHasLoggedToday(true);
    } else {
      setHasLoggedToday(false);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const isValid = useMemo(() => {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    const p = parseInt(pulse);
    return s >= 70 && s <= 250 && d >= 40 && d <= 150 && p >= 30 && p <= 220;
  }, [systolic, diastolic, pulse]);

  const handleSave = async () => {
    if (!isValid) return;

    const classification = classifyBP(parseInt(systolic), parseInt(diastolic));
    const now = new Date();

    const reading: Omit<BPReading, "userId"> = {
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: parseInt(pulse),
      position,
      arm,
      symptoms: selectedSymptoms,
      stressLevel,
      notes,
      category: classification.category,
      alertStatus: classification.alertStatus,
      timestamp: now.toISOString(),
    };

    try {
      await saveBPReading(reading);

      if (classification.category === "Crisis") {
        Alert.alert(
          "🚨 EMERGENCY",
          "Hypertensive Crisis detected! Seek medical attention immediately.",
          [{ text: "OK" }],
        );
      } else {
        Alert.alert("Saved!", "Reading saved successfully!");
      }
      setHasLoggedToday(true);

      setShowEntryForm(false);
      resetForm();
      loadData();
      router.navigate("/(tabs)/home");
    } catch (e) {
      Alert.alert("Error", "Failed to save reading. Please try again.");
    }
  };

  const resetForm = () => {
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setPosition("Sitting");
    setArm("Left");
    setSelectedSymptoms([]);
    setStressLevel("Low");
    setNotes("");
  };

  const latestReading = readings[0];
  const averages = useMemo(() => calculateAverages(readings), [readings]);

  const chartData = useMemo(() => {
    const filteredReadings =
      chartType === "Weekly"
        ? readings.slice(0, 7).reverse()
        : readings.slice(0, 30).reverse();

    if (filteredReadings.length === 0) return null;

    return {
      labels: filteredReadings.map((r) =>
        new Date(r.timestamp).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        }),
      ),
      datasets: [
        {
          data: filteredReadings.map((r) => r.systolic),
          color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`, // Pink
          strokeWidth: 2,
        },
        {
          data: filteredReadings.map((r) => r.diastolic),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
          strokeWidth: 2,
        },
      ],
      legend: ["Systolic", "Diastolic"],
    };
  }, [readings, chartType]);

  const getAlertColor = (status: string) => {
    switch (status) {
      case "green":
        return "#10b981";
      case "orange":
        return "#f59e0b";
      case "red":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-6 mb-8">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-4">
              <MaterialIcons name="arrow-back" size={24} color="#334155" />
            </Pressable>
            <Text className="text-2xl font-bold text-slate-900">
              BP Tracker
            </Text>
          </View>
          <Pressable
            onPress={() => setShowEntryForm(true)}
            className="bg-primary px-4 py-2 rounded-full shadow-sm"
          >
            <Text className="text-white font-bold">+ New</Text>
          </Pressable>
        </View>

        {/* Latest Reading Card */}
        {latestReading && (
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Latest Reading
                </Text>
                <Text className="text-3xl font-bold text-slate-900 mt-1">
                  {latestReading.systolic}/{latestReading.diastolic}{" "}
                  <Text className="text-lg font-normal text-slate-400">
                    mmHg
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: getAlertColor(latestReading.alertStatus),
                }}
                className="px-3 py-1 rounded-full"
              >
                <Text className="text-white font-bold text-xs">
                  {latestReading.category}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4 text-slate-500">
              <View className="flex-row items-center">
                <Ionicons name="heart" size={16} color="#ef4444" />
                <Text className="ml-1 text-sm font-medium">
                  {latestReading.pulse} BPM
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="#64748b" />
                <Text className="ml-1 text-sm font-medium">
                  {new Date(latestReading.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Statistics Grid */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-slate-900 p-5 rounded-3xl">
            <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
              Weekly Avg
            </Text>
            <Text className="text-white text-xl font-bold">
              {averages.avgSystolic}/{averages.avgDiastolic}
            </Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <Text className="text-slate-500 text-[10px] font-bold uppercase mb-1">
              Avg Pulse
            </Text>
            <Text className="text-slate-900 text-xl font-bold">
              {averages.avgPulse} BPM
            </Text>
          </View>
        </View>

        {/* Trend Chart */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-slate-800">BP Trend</Text>
            <View className="flex-row bg-slate-100 rounded-full p-1">
              <Pressable
                onPress={() => setChartType("Weekly")}
                className={`px-3 py-1 rounded-full ${chartType === "Weekly" ? "bg-white shadow-sm" : ""}`}
              >
                <Text
                  className={`text-xs font-bold ${chartType === "Weekly" ? "text-slate-900" : "text-slate-500"}`}
                >
                  Weekly
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setChartType("Monthly")}
                className={`px-3 py-1 rounded-full ${chartType === "Monthly" ? "bg-white shadow-sm" : ""}`}
              >
                <Text
                  className={`text-xs font-bold ${chartType === "Monthly" ? "text-slate-900" : "text-slate-500"}`}
                >
                  Monthly
                </Text>
              </Pressable>
            </View>
          </View>

          {chartData ? (
            <LineChart
              data={chartData}
              width={SCREEN_WIDTH - 88}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          ) : (
            <View className="h-40 items-center justify-center">
              <Text className="text-slate-400">
                Not enough data for trend chart
              </Text>
            </View>
          )}
        </View>

        {/* History List Header */}
        <Text className="text-lg font-bold text-slate-800 mb-4">
          Reading History
        </Text>
        {readings.map((r, i) => (
          <View
            key={i}
            className="bg-white p-4 rounded-2xl mb-3 border border-slate-100 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-slate-900 font-bold">
                {r.systolic}/{r.diastolic} mmHg
              </Text>
              <Text className="text-slate-500 text-xs mt-1">
                {new Date(r.timestamp).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View
              style={{ backgroundColor: getAlertColor(r.alertStatus) + "20" }}
              className="px-2 py-1 rounded-md"
            >
              <Text
                style={{ color: getAlertColor(r.alertStatus) }}
                className="text-[10px] font-bold uppercase"
              >
                {r.category}
              </Text>
            </View>
          </View>
        ))}

        <View className="h-10" />
      </ScrollView>

      {/* Entry Form Modal */}
      <Modal
        visible={showEntryForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEntryForm(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 px-6">
            <View className="flex-row justify-between items-center py-6 border-b border-slate-100 mb-6">
              <Text className="text-xl font-bold text-slate-900">
                New Reading
              </Text>
              <Pressable
                onPress={() => {
                  setShowEntryForm(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={28} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Vitals Section */}
              <View className="flex-row gap-4 mb-6">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                    Systolic
                  </Text>
                  <TextInput
                    className={`bg-slate-50 p-4 rounded-2xl text-xl font-bold text-slate-900 border ${systolic && (parseInt(systolic) < 70 || parseInt(systolic) > 250) ? "border-red-500" : "border-slate-100"}`}
                    keyboardType="numeric"
                    value={systolic}
                    onChangeText={setSystolic}
                    placeholder="120"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                    Diastolic
                  </Text>
                  <TextInput
                    className={`bg-slate-50 p-4 rounded-2xl text-xl font-bold text-slate-900 border ${diastolic && (parseInt(diastolic) < 40 || parseInt(diastolic) > 150) ? "border-red-500" : "border-slate-100"}`}
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
                  className={`bg-slate-50 p-4 rounded-2xl text-xl font-bold text-slate-900 border ${pulse && (parseInt(pulse) < 30 || parseInt(pulse) > 220) ? "border-red-500" : "border-slate-100"}`}
                  keyboardType="numeric"
                  value={pulse}
                  onChangeText={setPulse}
                  placeholder="72"
                />
              </View>

              {/* Context Fields */}
              <SegmentedSelector
                label="Measurement Position"
                options={[
                  { label: "Sitting", value: "Sitting" },
                  { label: "Standing", value: "Standing" },
                  { label: "Lying down", value: "Lying down" },
                ]}
                selectedValue={position}
                onSelect={(v) => setPosition(v as any)}
              />

              <View className="h-6" />

              <SegmentedSelector
                label="Measurement Arm"
                options={[
                  { label: "Left", value: "Left" },
                  { label: "Right", value: "Right" },
                ]}
                selectedValue={arm}
                onSelect={(v) => setArm(v as any)}
              />

              <View className="h-6" />

              <MultiSelect
                label="Symptoms"
                options={[
                  "Headache",
                  "Dizziness",
                  "Chest Pain",
                  "Shortness of Breath",
                  "None",
                ]}
                selectedValues={selectedSymptoms}
                onToggle={(val) => {
                  if (val === "None") setSelectedSymptoms(["None"]);
                  else {
                    const filtered = selectedSymptoms.filter(
                      (s) => s !== "None",
                    );
                    if (filtered.includes(val))
                      setSelectedSymptoms(filtered.filter((s) => s !== val));
                    else setSelectedSymptoms([...filtered, val]);
                  }
                }}
              />

              <SegmentedSelector
                label="Stress Level"
                options={[
                  { label: "Low", value: "Low" },
                  { label: "Medium", value: "Medium" },
                  { label: "High", value: "High" },
                ]}
                selectedValue={stressLevel}
                onSelect={(v) => setStressLevel(v as any)}
              />

              <View className="h-6" />

              <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                Notes (Max 300 chars)
              </Text>
              <TextInput
                className="bg-slate-50 p-4 rounded-2xl text-slate-900 border border-slate-100"
                multiline
                maxLength={300}
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special observations..."
                textAlignVertical="top"
              />

              <Pressable
                onPress={handleSave}
                disabled={!isValid}
                className={`p-5 rounded-2xl my-10 items-center shadow-lg ${isValid ? "bg-primary" : "bg-slate-300"}`}
              >
                <Text className="text-white font-bold text-lg">
                  Save Reading
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
