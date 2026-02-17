import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TrackingButtonProps {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  isSelected?: boolean;
  onPress: () => void;
}

export default function TrackingButton({
  icon,
  label,
  color,
  bgColor,
  isSelected,
  onPress,
}: TrackingButtonProps) {
  return (
    <Pressable onPress={onPress} className="items-center gap-2">
      <View
        className={`w-14 h-14 rounded-full items-center justify-center ${bgColor} ${
          isSelected ? "border-2 border-primary" : ""
        }`}
      >
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <Text className="text-xs font-medium text-slate-500">{label}</Text>
    </Pressable>
  );
}
