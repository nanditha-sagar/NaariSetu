import React, { useState, useRef } from "react";
import { View, Text, ScrollView, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import QuestionCard from "@/components/QuestionCard";
import {
  QUESTIONNAIRE_SECTIONS,
  QuestionnaireAnswers,
  runMockAnalysis,
} from "@/utils/data";
import { saveScreening } from "@/services/healthService";

export default function SymptomsScreen() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const scrollRef = useRef<ScrollView>(null);

  const totalSections = QUESTIONNAIRE_SECTIONS.length;
  const section = QUESTIONNAIRE_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / totalSections) * 100;

  // Count answered questions in current section
  const currentSectionAnswered = section.questions.filter(
    (q) => answers[q.id],
  ).length;
  const currentSectionTotal = section.questions.length;

  // Global question numbering
  let globalOffset = 0;
  for (let i = 0; i < currentSection; i++) {
    globalOffset += QUESTIONNAIRE_SECTIONS[i].questions.length;
  }

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const goNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFinish = async () => {
    // Run analysis and save
    const result = runMockAnalysis(answers);
    await saveScreening(result);

    // Navigate to optional scan or directly to results
    router.push({
      pathname: "/screening/scan",
      params: {
        screeningId: result.id,
        answersJson: JSON.stringify(answers),
      },
    });
  };

  const handleSkipToResults = async () => {
    const result = runMockAnalysis(answers);
    await saveScreening(result);

    router.replace({
      pathname: "/screening/results",
      params: { id: result.id },
    });
  };

  const isLastSection = currentSection === totalSections - 1;

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      {/* Top Navigation */}
      <View className="flex-row items-center justify-between px-6 py-3">
        <Pressable
          onPress={() => {
            if (currentSection > 0) goPrev();
            else router.back();
          }}
          className="p-2 -ml-2"
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#64748b" />
        </Pressable>

        {/* Progress */}
        <View className="flex-1 mx-4">
          <View
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(244,113,181,0.12)" }}
          >
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <Text className="text-xs font-semibold text-slate-400">
          {currentSection + 1}/{totalSections}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View className="mb-6 mt-2">
          <View className="flex-row items-center gap-3 mb-2">
            <Text className="text-3xl">{section.emoji}</Text>
            <Text className="text-2xl font-bold text-slate-900">
              {section.title}
            </Text>
          </View>
          <Text className="text-slate-400 text-sm">
            Answer the questions below • {currentSectionAnswered}/
            {currentSectionTotal} answered
          </Text>
        </View>

        {/* Questions */}
        {section.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={globalOffset + index + 1}
            selectedValue={answers[question.id]}
            onSelect={handleSelect}
          />
        ))}

        {/* Spacer for bottom bar */}
        <View className="h-40" />
      </ScrollView>

      {/* Fixed Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-8 border-t border-slate-100"
        style={{ backgroundColor: "rgba(248,246,247,0.95)" }}
      >
        {isLastSection ? (
          <View className="gap-3">
            {/* Primary: Continue to photo */}
            <Pressable
              onPress={handleFinish}
              className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
            >
              <MaterialIcons name="camera-alt" size={20} color="white" />
              <Text className="text-white font-semibold text-base">
                Add Nail Photo (Optional)
              </Text>
            </Pressable>

            {/* Secondary: Skip photo */}
            <Pressable
              onPress={handleSkipToResults}
              className="w-full py-3 rounded-xl flex-row items-center justify-center gap-2 active:opacity-80 border border-slate-200"
            >
              <MaterialIcons name="skip-next" size={20} color="#64748b" />
              <Text className="text-slate-600 font-medium text-sm">
                Skip Photo & View Results
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={goNext}
            className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
          >
            <Text className="text-white font-semibold text-base">
              Next Section
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </Pressable>
        )}

        <Text className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-medium">
          Section {currentSection + 1} of {totalSections} • Health Assessment
        </Text>
      </View>
    </SafeAreaView>
  );
}
