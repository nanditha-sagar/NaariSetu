import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLatestAssessment } from "../../services/healthService";
import { AssessmentData } from "../../utils/data";

export default function AssessmentResultsScreen() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AssessmentData | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            setLoading(true);
            const latest = await getLatestAssessment();
            setData(latest);
        } catch (e) {
            console.error("Failed to load assessment data:", e);
        } finally {
            setLoading(false);
        }
    };

    const calculateBMI = (height: string, weight: string) => {
        // More robust parsing for weight (e.g., "62 kg" -> 62)
        const w = parseFloat(weight.replace(/[^0-9.]/g, ""));

        // More robust parsing for height
        let hCm = 0;
        if (height.includes("'")) {
            // Handle "5' 6\"" format
            const parts = height.split("'");
            const ft = parseFloat(parts[0]);
            const inches = parts[1] ? parseFloat(parts[1].replace(/[^0-9.]/g, "")) : 0;
            hCm = (ft * 30.48) + (inches * 2.54);
        } else {
            // Handle "170 cm" or "170"
            hCm = parseFloat(height.replace(/[^0-9.]/g, ""));
        }

        if (!hCm || !w) return null;
        const hM = hCm / 100;
        return (w / (hM * hM)).toFixed(1);
    };

    const getBMICategory = (bmi: string) => {
        const val = parseFloat(bmi);
        if (val < 18.5) return { label: "Underweight", color: "#3b82f6" };
        if (val < 25) return { label: "Normal", color: "#10b981" };
        if (val < 30) return { label: "Overweight", color: "#f59e0b" };
        return { label: "Obese", color: "#ef4444" };
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#ec4899" />
                <Text className="text-slate-500 mt-4">Generating your health profile...</Text>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <MaterialIcons name="error-outline" size={48} color="#94a3b8" />
                <Text className="text-lg font-bold text-slate-800 mt-4">No Assessment Found</Text>
                <Text className="text-slate-500 text-center mt-2">Finish your health checkup to see your summary.</Text>
                <Pressable
                    onPress={() => router.replace("/screening/assessment")}
                    className="mt-6 bg-primary px-8 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold">Start Assessment</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const bmi = calculateBMI(data.height, data.weight);
    const bmiCat = bmi ? getBMICategory(bmi) : null;

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-slate-100">
                <Pressable onPress={() => router.replace("/home")} className="p-2">
                    <MaterialIcons name="close" size={24} color="#0f172a" />
                </Pressable>
                <Text className="text-lg font-bold text-slate-900">Health Profile</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    {/* Vitals Summary Card */}
                    <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                        <View className="flex-row justify-between mb-6">
                            <View>
                                <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Current Goals</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {Array.isArray(data.primaryGoal) ? data.primaryGoal.map((goal, i) => (
                                        <View key={i} className="bg-pink-50/50 px-2 py-1 rounded-lg border border-pink-100">
                                            <Text className="text-slate-900 font-bold text-[10px]">{goal}</Text>
                                        </View>
                                    )) : (
                                        <View className="bg-pink-50/50 px-2 py-1 rounded-lg border border-pink-100">
                                            <Text className="text-slate-900 font-bold text-[10px]">{data.primaryGoal}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className="w-12 h-12 bg-pink-50 rounded-2xl items-center justify-center">
                                <MaterialIcons name="favorite" size={24} color="#ec4899" />
                            </View>
                        </View>

                        <View className="flex-row justify-between">
                            <View className="items-center border-r border-slate-50 flex-1">
                                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Height</Text>
                                <Text className="text-slate-900 font-bold text-base">{data.height} cm</Text>
                            </View>
                            <View className="items-center border-r border-slate-50 flex-1">
                                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Weight</Text>
                                <Text className="text-slate-900 font-bold text-base">{data.weight} kg</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Blood</Text>
                                <Text className="text-slate-900 font-bold text-base">{data.bloodGroup}</Text>
                            </View>
                        </View>

                        {bmi && (
                            <View className="mt-6 pt-6 border-t border-slate-50 flex-row items-center justify-between">
                                <View>
                                    <Text className="text-slate-900 font-bold text-xl">{bmi}</Text>
                                    <Text className="text-slate-400 text-xs">Body Mass Index</Text>
                                </View>
                                <View
                                    className="px-4 py-2 rounded-full"
                                    style={{ backgroundColor: `${bmiCat?.color}15` }}
                                >
                                    <Text className="font-bold text-xs" style={{ color: bmiCat?.color }}>{bmiCat?.label}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Medical Profile */}
                    <View className="mb-6">
                        <Text className="text-slate-900 font-bold text-lg mb-4 px-1">Medical Background</Text>

                        <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 gap-4">
                            <View>
                                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-2">Existing Conditions</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {Array.isArray(data.medicalConditions) ? data.medicalConditions.map((c, i) => (
                                        <View key={i} className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                            <Text className="text-slate-700 text-xs font-medium">{c}</Text>
                                        </View>
                                    )) : <Text className="text-slate-700 text-xs font-medium">{data.medicalConditions}</Text>}
                                </View>
                            </View>

                            <View>
                                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-2">Nutritional Deficiencies</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {Array.isArray(data.vitaminDeficiencies) && data.vitaminDeficiencies.length > 0 ? data.vitaminDeficiencies.map((d, i) => (
                                        <View key={i} className="bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                            <Text className="text-amber-700 text-xs font-medium">{d}</Text>
                                        </View>
                                    )) : (typeof data.vitaminDeficiencies === 'string' && data.vitaminDeficiencies) ? (
                                        <View className="bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                            <Text className="text-amber-700 text-xs font-medium">{data.vitaminDeficiencies}</Text>
                                        </View>
                                    ) : <Text className="text-slate-400 text-xs italic">No deficiencies reported</Text>}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Symptoms & Family History */}
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                            <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mb-3">
                                <MaterialIcons name="coronavirus" size={20} color="#ef4444" />
                            </View>
                            <Text className="text-slate-900 font-bold text-sm mb-1">Active Symptoms</Text>
                            <Text className="text-slate-500 text-xs leading-5">
                                {Array.isArray(data.currentSymptoms) ? (data.currentSymptoms.length > 0 ? data.currentSymptoms.join(", ") : "None reported") : data.currentSymptoms || "None reported"}
                            </Text>
                        </View>

                        <View className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-3">
                                <MaterialIcons name="family-restroom" size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-slate-900 font-bold text-sm mb-1">Family History</Text>
                            <Text className="text-slate-500 text-xs leading-5">
                                {Array.isArray(data.familyHistory) ? (data.familyHistory.length > 0 ? data.familyHistory.join(", ") : "No prior history") : data.familyHistory || "No prior history"}
                            </Text>
                        </View>
                    </View>

                    {/* Menstrual & Lifestyle */}
                    <View className="mb-6">
                        <Text className="text-slate-900 font-bold text-lg mb-4 px-1">Menstrual & Lifestyle</Text>
                        <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 gap-6">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-pink-50 items-center justify-center">
                                        <MaterialIcons name="calendar-today" size={16} color="#ec4899" />
                                    </View>
                                    <View>
                                        <Text className="text-slate-900 font-semibold text-sm">Menstrual Cycle</Text>
                                        <Text className="text-slate-400 text-xs">{data.periodRegularity}</Text>
                                    </View>
                                </View>
                                <Text className="text-slate-900 font-bold">{data.avgCycleLength} Days</Text>
                            </View>

                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                                        <MaterialIcons name="bedtime" size={16} color="#3b82f6" />
                                    </View>
                                    <View>
                                        <Text className="text-slate-900 font-semibold text-sm">Sleep Quality</Text>
                                        <Text className="text-slate-400 text-xs">Daily average</Text>
                                    </View>
                                </View>
                                <Text className="text-slate-900 font-bold">{data.sleepHours}</Text>
                            </View>

                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center">
                                        <MaterialIcons name="bolt" size={16} color="#f59e0b" />
                                    </View>
                                    <View>
                                        <Text className="text-slate-900 font-semibold text-sm">Stress Level</Text>
                                        <Text className="text-slate-400 text-xs">Reported impact</Text>
                                    </View>
                                </View>
                                <View className="bg-slate-100 w-24 h-2 rounded-full overflow-hidden">
                                    <View className="bg-orange-400 h-full" style={{ width: `${data.stressLevel}%` }} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3 mb-10">
                        <Pressable
                            onPress={() => router.push("/insights")}
                            className="bg-primary py-4 rounded-2xl items-center shadow-lg shadow-pink-200"
                        >
                            <Text className="text-white font-bold text-base">View Trackers & Insights</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.replace("/screening/assessment")}
                            className="bg-white py-4 rounded-2xl items-center border border-slate-100"
                        >
                            <Text className="text-slate-600 font-bold text-base">Update Assessment</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
