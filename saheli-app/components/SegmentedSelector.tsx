import React from "react";
import { View, Text, Pressable } from "react-native";

interface SegmentedSelectorProps<T extends string> {
  label: string;
  options: { label: string; value: T; color?: string }[];
  selectedValue: T;
  onSelect: (value: T) => void;
  icon?: string;
}

export default function SegmentedSelector<T extends string>({
  label,
  options,
  selectedValue,
  onSelect,
}: SegmentedSelectorProps<T>) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              className={`px-3 py-2.5 rounded-xl border items-center justify-center flex-1 min-w-[30%] ${
                isSelected ? "border-transparent" : "border-slate-200 bg-white"
              }`}
              style={
                isSelected
                  ? { backgroundColor: opt.color || "#f471b5" }
                  : undefined
              }
            >
              <Text
                className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-600"}`}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
