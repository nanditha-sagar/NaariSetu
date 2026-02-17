import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface HealthTipCardProps {
  tip: string;
}

export default function HealthTipCard({ tip }: HealthTipCardProps) {
  return (
    <View className="bg-primary-10 border border-primary-20 rounded-xl p-5 flex-row items-start gap-4">
      <View className="bg-white p-2 rounded-lg">
        <MaterialIcons name="lightbulb" size={22} color="#f471b5" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-primary mb-1">
          Health Tip of the Day
        </Text>
        <Text className="text-sm text-slate-600 leading-6">{tip}</Text>
      </View>
    </View>
  );
}
