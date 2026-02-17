import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TestRecommendationCardProps {
  name: string;
  description: string;
  icon: string;
}

export default function TestRecommendationCard({
  name,
  description,
  icon,
}: TestRecommendationCardProps) {
  return (
    <View className="flex-row items-start gap-4 p-4 bg-white rounded-xl border border-primary-5 mb-3">
      <View className="w-10 h-10 shrink-0 bg-primary-10 rounded-lg items-center justify-center">
        <MaterialIcons name={icon as any} size={22} color="#f471b5" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-800">{name}</Text>
        <Text className="text-xs mt-1 text-slate-500 leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
}
