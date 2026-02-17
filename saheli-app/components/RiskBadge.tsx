import React from "react";
import { View, Text } from "react-native";

interface RiskBadgeProps {
  risk: "Low" | "Medium" | "High";
  size?: "sm" | "md";
}

export default function RiskBadge({ risk, size = "sm" }: RiskBadgeProps) {
  const colors = {
    Low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    Medium: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    High: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  };

  const c = colors[risk];
  const padding = size === "md" ? "px-4 py-1.5" : "px-2.5 py-0.5";

  return (
    <View className={`flex-row items-center ${c.bg} ${padding} rounded-full`}>
      <View className={`w-1.5 h-1.5 rounded-full ${c.dot} mr-1.5`} />
      <Text className={`text-xs font-semibold ${c.text}`}>{risk} Risk</Text>
    </View>
  );
}
