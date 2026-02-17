import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import {
  getAnemiaLogs,
  generateAnemiaInsights,
  getRiskColor,
  AnemiaInsights,
} from "@/utils/trackerData";

import {
  getPCOSLogs,
  generatePCOSInsights,
  getRiskColor as getPCOSRiskColor,
  PCOSInsights,
} from "@/utils/pcosTrackerData";

import {
  getGeneralLogs,
  generateGeneralInsights,
  getScoreColor,
  GeneralInsights,
} from "@/utils/generalTrackerData";

export default function InsightsScreen() {
  const [anemiaInsights, setAnemiaInsights] = useState<AnemiaInsights | null>(
    null,
  );
  const [anemiaLogCount, setAnemiaLogCount] = useState(0);
  const [pcosInsights, setPcosInsights] = useState<PCOSInsights | null>(null);
  const [pcosLogCount, setPcosLogCount] = useState(0);
  const [lastPcosLogDate, setLastPcosLogDate] = useState<string | null>(null);
  const [generalInsights, setGeneralInsights] =
    useState<GeneralInsights | null>(null);
  const [generalLogCount, setGeneralLogCount] = useState(0);
  const [lastGeneralLogDate, setLastGeneralLogDate] = useState<string | null>(
    null,
  );
  const [lastLogDate, setLastLogDate] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const logs = await getAnemiaLogs();
        setAnemiaLogCount(logs.length);
        if (logs.length > 0) {
          setAnemiaInsights(generateAnemiaInsights(logs));
          setLastLogDate(logs[logs.length - 1].date);
        }

        const pcosLogs = await getPCOSLogs();
        setPcosLogCount(pcosLogs.length);
        if (pcosLogs.length > 0) {
          setPcosInsights(generatePCOSInsights(pcosLogs));
          setLastPcosLogDate(pcosLogs[pcosLogs.length - 1].date);
        }

        const gLogs = await getGeneralLogs();
        setGeneralLogCount(gLogs.length);
        if (gLogs.length > 0) {
          setGeneralInsights(generateGeneralInsights(gLogs));
          setLastGeneralLogDate(gLogs[gLogs.length - 1].date);
        }
      })();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mt-4 mb-6">
          <Text className="text-3xl font-bold text-slate-900">
            Health Trackers
          </Text>
          <Text className="text-slate-500 mt-1">
            Monitor your health daily & get AI insights
          </Text>
        </View>

        {/* ─── Anemia Tracker Tile ─── */}
        <Pressable
          onPress={() => router.push("/tracker/anemia")}
          className="bg-white rounded-2xl p-5 border border-slate-100 mb-4 active:opacity-90"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <Text className="text-2xl">🩸</Text>
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-800">
                  Anemia Tracker
                </Text>
                <Text className="text-xs text-slate-400">
                  {anemiaLogCount > 0
                    ? `${anemiaLogCount} log${anemiaLogCount > 1 ? "s" : ""} • Last: ${lastLogDate}`
                    : "Start tracking today"}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </View>

          {anemiaInsights ? (
            <View className="flex-row items-center gap-4 mt-1">
              <View
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor:
                    anemiaInsights.riskLevel === "High"
                      ? "rgba(239,68,68,0.1)"
                      : anemiaInsights.riskLevel === "Medium"
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(16,185,129,0.1)",
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: getRiskColor(anemiaInsights.riskScore),
                  }}
                >
                  {anemiaInsights.riskLevel} Risk • Score{" "}
                  {anemiaInsights.riskScore}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">
                {anemiaInsights.trend}
              </Text>
            </View>
          ) : (
            <View
              className="flex-row items-center gap-2 mt-1 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(244,113,181,0.06)" }}
            >
              <MaterialIcons name="add-circle" size={16} color="#f471b5" />
              <Text className="text-xs text-primary font-medium">
                Tap to start logging symptoms
              </Text>
            </View>
          )}
        </Pressable>

        {/* ─── PCOS Tracker Tile ─── */}
        <Pressable
          onPress={() => router.push("/tracker/pcos")}
          className="bg-white rounded-2xl p-5 border border-slate-100 mb-4 active:opacity-90"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: "rgba(168,85,247,0.1)" }}
              >
                <Text className="text-2xl">🔬</Text>
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-800">
                  PCOS Tracker
                </Text>
                <Text className="text-xs text-slate-400">
                  {pcosLogCount > 0
                    ? `${pcosLogCount} log${pcosLogCount > 1 ? "s" : ""} • Last: ${lastPcosLogDate}`
                    : "Start tracking today"}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </View>

          {pcosInsights ? (
            <View className="flex-row items-center gap-4 mt-1">
              <View
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor:
                    pcosInsights.riskLevel === "High"
                      ? "rgba(239,68,68,0.1)"
                      : pcosInsights.riskLevel === "Medium"
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(16,185,129,0.1)",
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: getPCOSRiskColor(pcosInsights.riskScore) }}
                >
                  {pcosInsights.riskLevel} Risk • Score {pcosInsights.riskScore}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">
                {pcosInsights.trend}
              </Text>
            </View>
          ) : (
            <View
              className="flex-row items-center gap-2 mt-1 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(168,85,247,0.06)" }}
            >
              <MaterialIcons name="add-circle" size={16} color="#a855f7" />
              <Text
                className="text-xs font-medium"
                style={{ color: "#a855f7" }}
              >
                Tap to start logging PCOS symptoms
              </Text>
            </View>
          )}
        </Pressable>

        {/* ─── General Health Tracker Tile ─── */}
        <Pressable
          onPress={() => router.push("/tracker/general")}
          className="bg-white rounded-2xl p-5 border border-slate-100 mb-4 active:opacity-90"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: "rgba(126,211,212,0.1)" }}
              >
                <Text className="text-2xl">💤</Text>
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-800">
                  General Health
                </Text>
                <Text className="text-xs text-slate-400">
                  {generalLogCount > 0
                    ? `${generalLogCount} log${generalLogCount > 1 ? "s" : ""} • Last: ${lastGeneralLogDate}`
                    : "Start tracking today"}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </View>

          {generalInsights ? (
            <View className="flex-row items-center gap-4 mt-1">
              <View
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: `${getScoreColor(generalInsights.lifestyleScore)}15`,
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: getScoreColor(generalInsights.lifestyleScore),
                  }}
                >
                  {generalInsights.scoreLevel} • Score{" "}
                  {generalInsights.lifestyleScore}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">
                {generalInsights.trend}
              </Text>
              {generalInsights.burnoutRisk && (
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                >
                  <Text className="text-[9px] font-bold text-red-500">
                    🔥 BURNOUT
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View
              className="flex-row items-center gap-2 mt-1 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(126,211,212,0.06)" }}
            >
              <MaterialIcons name="add-circle" size={16} color="#7ed3d4" />
              <Text
                className="text-xs font-medium"
                style={{ color: "#7ed3d4" }}
              >
                Tap to start logging your wellness
              </Text>
            </View>
          )}
        </Pressable>

        {/* ─── Quick Tip ─── */}
        <View
          className="rounded-xl p-4 flex-row items-start gap-3 mb-6"
          style={{ backgroundColor: "rgba(244,113,181,0.08)" }}
        >
          <MaterialIcons name="lightbulb" size={20} color="#f471b5" />
          <Text className="flex-1 text-xs text-slate-600 leading-5">
            Log your symptoms daily for more accurate AI insights. The tracker
            needs at least 3 days of data to generate meaningful trends.
          </Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
