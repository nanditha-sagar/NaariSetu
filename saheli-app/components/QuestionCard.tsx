import React from "react";
import { View, Text, Pressable } from "react-native";
import type { Question, QuestionOption } from "@/utils/data";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedValue: string | undefined;
  onSelect: (questionId: string, value: string) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <View className="mb-8">
      {/* Question */}
      <View className="flex-row items-start gap-3 mb-4">
        <View
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(244,113,181,0.15)" }}
        >
          <Text className="text-primary text-xs font-bold">
            {questionNumber}
          </Text>
        </View>
        <Text className="flex-1 text-base font-medium text-slate-800 leading-6">
          {question.text}
        </Text>
      </View>

      {/* Options */}
      <View className="flex-row flex-wrap gap-2 pl-10">
        {question.options.map((option: QuestionOption) => {
          const isSelected = selectedValue === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(question.id, option.value)}
              className={`px-4 py-2.5 rounded-full border ${
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-white border-slate-200"
              }`}
              style={
                isSelected
                  ? { backgroundColor: "#f471b5", borderColor: "#f471b5" }
                  : undefined
              }
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-slate-600"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
