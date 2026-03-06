import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLatestAssessment } from "../services/healthService";
import { AssessmentData } from "../utils/data";
import { getPersonalizedInsights, InsightsData } from "../constants/recommendations";
import { LinearGradient } from "expo-linear-gradient";

export default function InsightsScreen() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AssessmentData | null>(null);
    const [insights, setInsights] = useState<InsightsData | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        try {
            setLoading(true);
            const latest = await getLatestAssessment();
            if (latest) {
                setData(latest);
                setInsights(getPersonalizedInsights(latest));
            }
        } catch (e) {
            console.error("Failed to load insights data:", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#ec4899" />
                <Text className="text-slate-500 mt-4">Analyzing your health data...</Text>
            </SafeAreaView>
        );
    }

    if (!data || !insights) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <MaterialIcons name="insights" size={48} color="#94a3b8" />
                <Text className="text-lg font-bold text-slate-800 mt-4">No Data Available</Text>
                <Text className="text-slate-500 text-center mt-2">
                    Complete your health assessment to get personalized insights and recommendations.
                </Text>
                <Pressable
                    onPress={() => router.replace("/screening/assessment")}
                    className="mt-6 bg-primary px-8 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold">Start Assessment</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const Section = ({ title, items, color, icon }: { title: string; items: any[]; color: string; icon: string }) => (
        <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4">
                <View className={`w-8 h-8 rounded-full items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                    <MaterialIcons name={icon as any} size={18} color={color} />
                </View>
                <Text className="text-slate-900 font-bold text-lg">{title}</Text>
            </View>

            {items.map((item, idx) => (
                <View key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
                    <View className="flex-row gap-4">
                        <View className={`w-10 h-10 rounded-xl items-center justify-center`} style={{ backgroundColor: `${color}10` }}>
                            <MaterialIcons name={item.icon} size={20} color={color} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-900 font-bold text-sm mb-1">{item.title}</Text>
                            <Text className="text-slate-500 text-xs leading-5">{item.description}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-slate-100">
                <Pressable onPress={() => router.back()} className="p-2">
                    <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                </Pressable>
                <Text className="text-lg font-bold text-slate-900">Trackers & Insights</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    {/* Highlight Card */}
                    <LinearGradient
                        colors={["#f4256a", "#ec4899"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-3xl p-6 mb-8 shadow-lg shadow-pink-200"
                    >
                        <View className="flex-row items-center gap-3 mb-2">
                            <MaterialIcons name="auto-awesome" size={20} color="white" />
                            <Text className="text-white/80 font-bold text-xs uppercase tracking-widest">Today's Focus</Text>
                        </View>
                        <Text className="text-white text-xl font-bold leading-8">
                            {insights.highlight}
                        </Text>
                    </LinearGradient>

                    {/* Sections */}
                    <Section title="AI Nutritionist" items={insights.diet} color="#f59e0b" icon="restaurant" />
                    <Section title="Move & Flow" items={insights.yoga} color="#10b981" icon="fitness-center" />
                    <Section title="Calm Corner" items={insights.meditation} color="#3b82f6" icon="self-improvement" />

                    {/* Quick Trackers */}
                    <View className="mb-10">
                        <Text className="text-slate-900 font-bold text-lg mb-4">Quick Trackers</Text>
                        <View className="flex-row justify-between">
                            {[
                                { label: "Period", path: "/tracker/periods", icon: "calendar-today", color: "#ec4899" },
                                { label: "BP", path: "/tracker/BP", icon: "favorite", color: "#ef4444" },
                                { label: "Glucose", path: "/tracker/Glucose", icon: "bloodtype", color: "#f97316" },
                                { label: "Mood", path: "/tracker/mood", icon: "sentiment-satisfied", color: "#8b5cf6" },
                            ].map((t) => (
                                <Pressable
                                    key={t.label}
                                    onPress={() => router.push(t.path as any)}
                                    className="items-center bg-white rounded-2xl p-3 flex-1 mx-1 border border-slate-100 shadow-sm"
                                >
                                    <View className="w-10 h-10 rounded-full items-center justify-center mb-1" style={{ backgroundColor: `${t.color}10` }}>
                                        <MaterialIcons name={t.icon as any} size={20} color={t.color} />
                                    </View>
                                    <Text className="text-slate-600 font-bold text-[10px]">{t.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
