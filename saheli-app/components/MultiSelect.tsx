import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface MultiSelectProps {
    label: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
}

export default function MultiSelect({
    label,
    options,
    selectedValues,
    onToggle,
}: MultiSelectProps) {
    return (
        <View className="mb-6">
            <Text className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                {label}
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option);
                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => onToggle(option)}
                            className={`px-4 py-2 rounded-full border ${isSelected
                                    ? "bg-pink-100 border-pink-500"
                                    : "bg-slate-50 border-slate-200"
                                }`}
                        >
                            <Text
                                className={`text-sm ${isSelected ? "text-pink-600 font-bold" : "text-slate-600"
                                    }`}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
