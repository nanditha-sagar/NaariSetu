import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SymptomCardProps {
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  onToggle: () => void;
}

export default function SymptomCard({
  name,
  description,
  icon,
  isActive,
  onToggle,
}: SymptomCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="bg-white p-4 rounded-xl flex-row items-center justify-between border border-primary-5 mb-3"
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View className="w-10 h-10 rounded-lg bg-primary-10 items-center justify-center">
          <MaterialIcons name={icon as any} size={20} color="#f471b5" />
        </View>
        <View className="flex-1">
          <Text className="font-medium text-slate-800 text-base">{name}</Text>
          <Text className="text-xs text-slate-400 mt-0.5">{description}</Text>
        </View>
      </View>

      {/* Toggle Switch */}
      <Pressable onPress={onToggle} className="ml-2">
        <View
          className={`w-11 h-6 rounded-full justify-center ${
            isActive ? "bg-primary" : "bg-slate-200"
          }`}
        >
          <View
            className={`w-5 h-5 rounded-full bg-white ${
              isActive ? "ml-[22px]" : "ml-[2px]"
            }`}
          />
        </View>
      </Pressable>
    </Pressable>
  );
}
