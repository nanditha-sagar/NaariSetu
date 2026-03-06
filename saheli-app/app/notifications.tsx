import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLatestAssessment } from "../services/healthService";
import { AssessmentData } from "../utils/data";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "reminder";
    icon: string;
    timestamp: string;
    route?: string;
}

export default function NotificationsScreen() {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const assessment = await getLatestAssessment();
            const generated = generateNotifications(assessment);
            setNotifications(generated);
        } catch (error) {
            console.error("Error loading notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateNotifications = (
        assessment: AssessmentData | null,
    ): Notification[] => {
        const list: Notification[] = [];
        const now = new Date().toISOString();

        // Default notifications always present
        list.push({
            id: "welcome",
            title: "Welcome to NaariSetu",
            message: "Stay on top of your health with personalized daily reminders.",
            type: "success",
            icon: "verified-user",
            timestamp: now,
        });

        if (!assessment) {
            list.push({
                id: "no_assessment",
                title: "Complete Your Health Assessment",
                message:
                    "Unlock personalized health insights by completing your screening.",
                type: "warning",
                icon: "assignment-late",
                timestamp: now,
                route: "/screening/assessment",
            });
            return list;
        }

        // Hydration Reminder
        const hydrationReminders: Record<string, string> = {
            "< 1L":
                "Your water intake is very low. Aim for at least 8-10 glasses today to stay energetic!",
            "1-2L":
                "Nice start! Try pushing for 2.5L today to improve skin health and nutrient absorption.",
            "2-3L": "Great job on hydration! Keep it up to maintain high energy levels.",
        };

        if (assessment.waterIntake && hydrationReminders[assessment.waterIntake]) {
            list.push({
                id: "water",
                title: "Stay Hydrated",
                message: hydrationReminders[assessment.waterIntake],
                type: "info",
                icon: "local-drink",
                timestamp: now,
            });
        }

        // Medical History Specifics
        if (assessment.medicalConditions.includes("PCOS")) {
            list.push({
                id: "pcos_reminder",
                title: "PCOS Care Reminder",
                message:
                    "Maintaining a consistent intake of high-fiber foods can help manage insulin sensitivity.",
                type: "reminder",
                icon: "favorite",
                timestamp: now,
            });
        }

        if (assessment.medicalConditions.includes("Anemia")) {
            list.push({
                id: "anemia_reminder",
                title: "Iron Rich Diet",
                message:
                    "Don't forget to include iron-rich snacks like dates or jaggery in your routine today.",
                type: "reminder",
                icon: "restaurant",
                timestamp: now,
            });
        }

        if (
            assessment.medicalConditions.includes("Diabetes") ||
            assessment.medicalConditions.includes("Hypertension (High BP)")
        ) {
            list.push({
                id: "bp_sugar_check",
                title: "Vital Tracking",
                message:
                    "A quick check-in on your vitals helps stay ahead of any health shifts. Track now!",
                type: "warning",
                icon: "monitor-heart",
                timestamp: now,
            });
        }

        // Stress & Sleep
        if (assessment.stressLevel > 70) {
            list.push({
                id: "stress_alert",
                title: "Take a Breather",
                message:
                    "Your reported stress levels are high. Try a 5-minute guided meditation from our hub.",
                type: "warning",
                icon: "self-improvement",
                timestamp: now,
            });
        }

        if (assessment.sleepHours === "4-5h" || assessment.sleepHours === "5-6h") {
            list.push({
                id: "sleep_tip",
                title: "Improve Your Sleep",
                message:
                    "Your sleep patterns suggest you might be tired. Try reducing screen time 30 mins before bed.",
                type: "info",
                icon: "bedtime",
                timestamp: now,
            });
        }

        return list;
    };

    const getIconColor = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return "#10b981";
            case "warning":
                return "#f59e0b";
            case "reminder":
                return "#ec4899";
            default:
                return "#3b82f6";
        }
    };

    const handleNotificationPress = (item: Notification) => {
        if (item.route) {
            router.push(item.route as any);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
                <Pressable
                    onPress={() => router.back()}
                    className="size-10 items-center justify-center rounded-full"
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
                </Pressable>
                <Text className="flex-1 text-center mr-10 text-lg font-bold text-slate-900">
                    Notifications
                </Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ec4899" />
                </View>
            ) : (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {notifications.length === 0 ? (
                        <View className="mt-20 items-center px-10">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <MaterialIcons
                                    name="notifications-off"
                                    size={40}
                                    color="#94a3b8"
                                />
                            </View>
                            <Text className="text-slate-900 text-lg font-bold mb-2">
                                No notifications
                            </Text>
                            <Text className="text-slate-500 text-center">
                                We'll notify you when there's something to track or health tips
                                to share.
                            </Text>
                        </View>
                    ) : (
                        <View className="p-4 gap-4">
                            {notifications.map((item) => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => handleNotificationPress(item)}
                                    className="flex-row items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100 active:bg-slate-100"
                                >
                                    <View
                                        className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                        style={{ backgroundColor: `${getIconColor(item.type)}15` }}
                                    >
                                        <MaterialIcons
                                            name={item.icon as any}
                                            size={20}
                                            color={getIconColor(item.type)}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row justify-between items-start mb-1">
                                            <Text className="text-slate-900 font-bold text-sm leading-tight flex-1 mr-2">
                                                {item.title}
                                            </Text>
                                            <Text className="text-slate-400 text-[10px] font-medium uppercase mt-0.5">
                                                Just Now
                                            </Text>
                                        </View>
                                        <Text className="text-slate-600 text-xs leading-5">
                                            {item.message}
                                        </Text>
                                        {item.route && (
                                            <View className="mt-2 flex-row items-center">
                                                <Text className="text-primary text-[10px] font-bold uppercase">
                                                    Action Required
                                                </Text>
                                                <MaterialIcons
                                                    name="chevron-right"
                                                    size={12}
                                                    color="#ec4899"
                                                />
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
