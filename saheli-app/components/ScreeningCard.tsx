import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RiskBadge from "./RiskBadge";
import { formatDate } from "@/utils/data";

interface ScreeningCardProps {
  type: string;
  timestamp: string;
  risk: "Low" | "Medium" | "High";
  imageUri?: string;
  onPress?: () => void;
}

export default function ScreeningCard({
  type,
  timestamp,
  risk,
  imageUri,
  onPress,
}: ScreeningCardProps) {
  const displayType =
    type === "nail_analysis" ? "Nail Analysis" : "Symptom Track";

  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-4 rounded-xl border border-slate-100 mb-4 active:scale-[0.98]"
      style={{ transform: [{ scale: 1 }] }}
    >
      <View className="flex-row gap-4">
        <View className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-primary-10 items-center justify-center">
              <MaterialIcons name="fingerprint" size={32} color="#f471b5" />
            </View>
          )}
        </View>

        <View className="flex-1 justify-between">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-base font-semibold text-slate-900">
                {displayType}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                {formatDate(timestamp)}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </View>
          <View className="flex-row items-center mt-2">
            <RiskBadge risk={risk} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
