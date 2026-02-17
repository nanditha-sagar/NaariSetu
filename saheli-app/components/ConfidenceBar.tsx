import React from "react";
import { View, Text } from "react-native";

interface ConfidenceBarProps {
  confidence: number;
}

export default function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  return (
    <View className="bg-white p-5 rounded-xl border border-primary-5">
      <View className="flex-row justify-between items-end mb-2">
        <Text className="text-sm font-medium text-slate-600">
          Confidence Score
        </Text>
        <Text className="text-2xl font-bold text-primary">{confidence}%</Text>
      </View>
      <View className="w-full h-2.5 bg-primary-10 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${confidence}%` }}
        />
      </View>
    </View>
  );
}
