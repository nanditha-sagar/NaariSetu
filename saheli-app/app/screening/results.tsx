import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Share } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import RiskBadge from "@/components/RiskBadge";
import ConfidenceBar from "@/components/ConfidenceBar";
import TestRecommendationCard from "@/components/TestRecommendationCard";
import { getScreenings, ScreeningEntry } from "@/utils/data";

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ id: string; fromHistory?: string }>();
  const [screening, setScreening] = useState<ScreeningEntry | null>(null);

  useEffect(() => {
    loadScreening();
  }, []);

  const loadScreening = async () => {
    const screenings = await getScreenings();
    const found = screenings.find((s) => s.id === params.id);
    if (found) {
      setScreening(found);
    } else if (screenings.length > 0) {
      setScreening(screenings[0]);
    }
  };

  const handleShare = async () => {
    if (!screening) return;
    try {
      await Share.share({
        message: `NaariSetu Health Screening\n\nCondition: ${screening.condition}\nRisk Level: ${screening.risk}\nConfidence: ${screening.confidence}%\n\nRecommended Tests:\n${screening.tests.map((t) => `• ${t.name}`).join("\n")}\n\n⚠️ This is not a medical diagnosis.`,
      });
    } catch (e) {
      console.error("Share error:", e);
    }
  };

  const handleGoBack = () => {
    if (params.fromHistory === "true") {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  if (!screening) {
    return (
      <SafeAreaView className="flex-1 bg-bg-light items-center justify-center">
        <MaterialIcons name="hourglass-top" size={32} color="#f471b5" />
        <Text className="text-slate-500 mt-4">Loading results...</Text>
      </SafeAreaView>
    );
  }

  const getExplanation = () => {
    switch (screening.condition) {
      case "Iron Deficiency":
      case "Anemia":
        return "Based on the visible paleness in your nail beds and your reported symptoms of persistent fatigue, our AI has identified patterns consistent with low iron levels.";
      case "PCOS":
        return "Based on your reported symptoms including irregular periods and hormonal indicators, our AI has identified patterns that may be associated with polycystic ovary syndrome.";
      case "Thyroid Disorder":
        return "Based on your symptoms of cold intolerance, fatigue, and weight changes, our AI has identified patterns that may suggest thyroid function imbalance.";
      default:
        return "Based on the combined analysis of your symptoms and nail scan, our AI has identified health patterns that may require further medical evaluation.";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Navigation */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable
          onPress={handleGoBack}
          className="w-10 h-10 rounded-full bg-primary-10 items-center justify-center"
        >
          <MaterialIcons name="chevron-left" size={26} color="#f471b5" />
        </Pressable>
        <Text className="text-sm font-semibold text-slate-800 uppercase tracking-widest">
          Analysis Result
        </Text>
        <Pressable
          onPress={handleShare}
          className="w-10 h-10 rounded-full bg-primary-10 items-center justify-center"
        >
          <MaterialIcons name="share" size={20} color="#f471b5" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Result Header Card */}
        <View className="mt-4 bg-primary-5 rounded-xl p-6 items-center border border-primary-10">
          <View className="mb-4 w-16 h-16 bg-white rounded-full items-center justify-center">
            <MaterialIcons name="analytics" size={30} color="#f471b5" />
          </View>
          <Text className="text-2xl font-bold text-slate-800 mb-2 text-center leading-tight">
            {screening.condition === "Iron Deficiency"
              ? "Potential Iron\nDeficiency"
              : `Potential ${screening.condition}`}
          </Text>
          <View className="mt-3">
            <RiskBadge risk={screening.risk} size="md" />
          </View>
        </View>

        {/* AI Confidence */}
        <View className="mt-8">
          <Text className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
            AI Analysis Confidence
          </Text>
          <ConfidenceBar confidence={screening.confidence} />
          <Text className="mt-4 text-sm text-slate-500 leading-6">
            {getExplanation()}
          </Text>
        </View>

        {/* Recommended Next Steps */}
        <View className="mt-8">
          <Text className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Recommended Next Steps
          </Text>
          {screening.tests.map((test, index) => (
            <TestRecommendationCard
              key={index}
              name={test.name}
              description={test.description}
              icon={test.icon}
            />
          ))}
        </View>

        {/* Motivational Banner */}
        <View className="mt-8 rounded-xl overflow-hidden h-28 bg-primary-5 items-center justify-center relative">
          <View className="absolute top-2 right-4 opacity-20">
            <MaterialIcons name="add" size={80} color="#f471b5" />
          </View>
          <Text className="text-xs font-medium italic text-slate-600 px-6 text-center leading-5">
            "Prioritizing your health is a beautiful act of self-care."
          </Text>
        </View>

        {/* Disclaimer */}
        <View className="mt-8 mb-6 p-4 bg-slate-50 rounded-lg border-l-4 border-primary-30">
          <View className="flex-row gap-3">
            <MaterialIcons name="info" size={18} color="#f471b5" />
            <Text className="flex-1 text-[11px] leading-5 text-slate-500 italic">
              This is not a medical diagnosis. Our AI provides insights to help
              you start a conversation with your doctor. Please consult a
              healthcare professional before making any medical decisions.
            </Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Fixed Footer */}
      <View className="px-6 py-4 bg-white-90 border-t border-primary-5">
        <Pressable
          onPress={handleGoBack}
          className="w-full bg-primary py-4 rounded-xl items-center active:opacity-90"
        >
          <Text className="text-white font-semibold">
            {params.fromHistory === "true"
              ? "Back to History"
              : "Schedule Professional Review"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
