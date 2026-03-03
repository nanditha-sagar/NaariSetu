import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TriageZoneCardProps {
  zone: "Green" | "Amber" | "Red";
  message: string;
  suggestions: string[];
}

export default function TriageZoneCard({
  zone,
  message,
  suggestions,
}: TriageZoneCardProps) {
  const zoneColors = {
    Green: {
      bg: "#ecfdf5",
      text: "#059669",
      icon: "check-circle",
      accent: "#10b981",
    },
    Amber: {
      bg: "#fffbeb",
      text: "#d97706",
      icon: "warning",
      accent: "#f59e0b",
    },
    Red: {
      bg: "#fef2f2",
      text: "#dc2626",
      icon: "report-problem",
      accent: "#ef4444",
    },
  };

  const style = zoneColors[zone];

  return (
    <View
      className="p-5 rounded-2xl border mb-6"
      style={{ backgroundColor: style.bg, borderColor: `${style.accent}30` }}
    >
      <View className="flex-row items-center gap-2 mb-3">
        <MaterialIcons
          name={style.icon as any}
          size={24}
          color={style.accent}
        />
        <Text className="text-lg font-bold" style={{ color: style.text }}>
          {zone} Status
        </Text>
      </View>

      <Text
        className="text-sm font-semibold mb-4 leading-5"
        style={{ color: style.text }}
      >
        {message}
      </Text>

      <View className="space-y-2">
        {suggestions.map((s, i) => (
          <View key={i} className="flex-row items-start gap-2">
            <View
              className="w-1.5 h-1.5 rounded-full mt-1.5"
              style={{ backgroundColor: style.accent }}
            />
            <Text
              className="text-xs flex-1 leading-4"
              style={{ color: style.text }}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
