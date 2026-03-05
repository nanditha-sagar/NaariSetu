import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GlobalTriageResult } from "../services/aiService";

interface Props {
  data: GlobalTriageResult | null;
  loading: boolean;
}

export default function GlobalAIInsight({ data, loading }: Props) {
  if (loading) {
    return (
      <View className="bg-white rounded-2xl p-6 border border-slate-100 mb-6 items-center">
        <ActivityIndicator color="#f471b5" />
        <Text className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-widest">
          Saheli AI is analyzing your data...
        </Text>
      </View>
    );
  }

  if (!data) return null;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Crisis":
        return "#ef4444";
      case "Red":
        return "#f97316";
      case "Amber":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  // Fixed: Replaced dynamic hex opacity with safe rgba strings
  const getUrgencyBgColor = (urgency: string) => {
    switch (urgency) {
      case "Crisis":
        return "rgba(239, 68, 68, 0.15)";
      case "Red":
        return "rgba(249, 115, 22, 0.15)";
      case "Amber":
        return "rgba(245, 158, 11, 0.15)";
      default:
        return "rgba(16, 185, 129, 0.15)";
    }
  };

  const urgencyBg = getUrgencyBgColor(data.urgency);
  const urgencyText = getUrgencyColor(data.urgency);

  return (
    // REMOVED: shadow-sm to prevent Android CSS interop crash
    <View className="bg-white rounded-3xl p-6 border border-slate-100 mb-6 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          {/* REMOVED: bg-primary/10. Replaced with safe inline style */}
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(244, 113, 181, 0.1)" }}
          >
            <MaterialIcons name="auto-awesome" size={16} color="#f471b5" />
          </View>
          <Text className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Saheli AI Insight
          </Text>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: urgencyBg }}
        >
          <Text
            className="text-[10px] font-bold"
            style={{ color: urgencyText }}
          >
            {data.urgency.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Summary */}
      <Text className="text-base font-semibold text-slate-900 leading-6 mb-4">
        {data.summary}
      </Text>

      {/* Correlations */}
      {data.correlations.length > 0 && (
        <View className="mb-4">
          <Text className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
            Identified Correlations
          </Text>
          {data.correlations.map((c, i) => (
            <View key={i} className="flex-row items-start gap-2 mb-2">
              <MaterialIcons name="link" size={14} color="#94a3b8" />
              <Text className="flex-1 text-xs text-slate-600 italic">{c}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommendations */}
      <View className="bg-slate-50 rounded-2xl p-4">
        <Text className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">
          Recommended Actions
        </Text>
        {data.recommendations.map((r, i) => (
          <View key={i} className="flex-row items-start gap-2 mb-2.5">
            <MaterialIcons name="check-circle" size={16} color="#10b981" />
            <Text className="flex-1 text-xs text-slate-700 font-medium">
              {r}
            </Text>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <Text className="text-[9px] text-slate-400 mt-4 text-center leading-4">
        ⚠️ {data.disclaimer}
      </Text>
    </View>
  );
}
