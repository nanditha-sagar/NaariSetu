import React from "react";
import { View, Text, Pressable, TextInput, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const Stepper = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-slate-900 font-bold text-lg">
          {currentStep === 1
            ? "Step 1: Basic Information"
            : currentStep === 2
              ? "Step 2: Conditions & Symptoms"
              : "Step 3: Menstrual Health"}
        </Text>
        <Text className="text-slate-400 font-medium">
          {currentStep} of {totalSteps}
        </Text>
      </View>
      <View className="rounded-full bg-primary/20 h-2 w-full overflow-hidden">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
};

export const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) => (
  <View className="mt-4 mb-4">
    <View className="flex-row items-center gap-2 mb-1">
      <MaterialIcons name={icon as any} size={20} color="#f4256a" />
      <Text className="text-slate-900 font-bold text-lg">{title}</Text>
    </View>
    {subtitle && <Text className="text-slate-500 text-sm">{subtitle}</Text>}
  </View>
);

export const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
  icon?: string;
}) => (
  <View className="mb-5">
    <Text className="text-slate-700 font-semibold mb-2 ml-1 text-sm">
      {label}
    </Text>
    <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 h-14">
      {icon && (
        <MaterialIcons
          name={icon as any}
          size={20}
          color="#94a3b8"
          style={{ marginRight: 10 }}
        />
      )}
      <TextInput
        placeholder={placeholder}
        className="flex-1 text-slate-900 text-base font-medium"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#94a3b8"
      />
    </View>
  </View>
);

export const ToggleCard = ({
  label,
  value,
  onValueChange,
  icon,
}: {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  icon?: string;
}) => (
  <View className="flex-row items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20 mb-4 h-16">
    <View className="flex-row items-center gap-3 flex-1">
      {icon && <MaterialIcons name={icon as any} size={20} color="#f4256a" />}
      <Text
        className="text-slate-700 font-semibold text-sm mr-2"
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#cbd5e1", true: "#f4256a" }}
      thumbColor="#ffffff"
    />
  </View>
);

export const SelectGroup = ({
  label,
  options,
  selected,
  onSelect,
  multiSelect = false,
  grid = false,
}: {
  label: string;
  options: string[];
  selected: string | string[];
  onSelect: (val: string) => void;
  multiSelect?: boolean;
  grid?: boolean;
}) => (
  <View className="mb-5">
    {label ? (
      <Text className="text-slate-700 font-semibold mb-3 ml-1 text-sm">
        {label}
      </Text>
    ) : null}
    <View
      className={`flex-row flex-wrap gap-2 ${grid ? "justify-between" : ""}`}
    >
      {options.map((option) => {
        const isSelected = multiSelect
          ? (selected as string[]).includes(option)
          : selected === option;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            className={`px-4 py-2.5 rounded-xl border ${
              isSelected
                ? "bg-primary border-primary"
                : "bg-white border-slate-200"
            } ${grid ? "flex-1 min-w-[22%]" : ""}`}
          >
            <Text
              className={`font-semibold text-sm text-center ${
                isSelected ? "text-white" : "text-slate-500"
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export const SymptomItem = ({
  label,
  isSelected,
  onToggle,
  onDelete,
}: {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  onDelete?: () => void;
}) => (
  <Pressable
    onPress={onToggle}
    className={`flex-row items-center p-4 rounded-xl border mb-3 ${
      isSelected ? "bg-primary/10 border-primary" : "bg-white border-primary/10"
    }`}
  >
    <View
      className={`size-6 rounded border items-center justify-center ${
        isSelected ? "bg-primary border-primary" : "bg-white border-primary/30"
      }`}
    >
      {isSelected && <MaterialIcons name="check" size={16} color="white" />}
    </View>
    <Text
      className={`ml-4 flex-1 text-sm font-medium ${
        isSelected ? "text-slate-900" : "text-slate-700"
      }`}
    >
      {label}
    </Text>
    {onDelete && (
      <Pressable onPress={onDelete} className="p-1">
        <MaterialIcons name="delete-outline" size={20} color="#94a3b8" />
      </Pressable>
    )}
  </Pressable>
);
