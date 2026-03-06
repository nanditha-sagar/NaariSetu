import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FirstPeriodGuide() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
                >
                    <MaterialIcons name="arrow-back" size={24} color="#334155" />
                </Pressable>
                <Text className="text-lg font-bold text-slate-900 ml-4 flex-1" numberOfLines={1}>
                    Educational Article
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6 pb-20" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                        Understanding Your Period
                    </Text>
                    <Text className="text-xl font-medium text-pink-500 mb-4">
                        A Simple Guide for Girls (Age 9–18)
                    </Text>

                    <View className="flex-row items-center mb-6">
                        <MaterialIcons name="access-time" size={16} color="#94a3b8" />
                        <Text className="text-slate-500 text-xs ml-1 font-medium">4 min read</Text>
                    </View>
                </View>

                <View className="space-y-6">
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Growing up brings many changes to your body. One of the most important changes is menstruation, also called periods. Getting your first period is a normal and healthy part of becoming a young woman.
                    </Text>

                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        This guide will help you understand what periods are, why they happen, and how to take care of yourself during this time.
                    </Text>

                    {/* What is a Period? */}
                    <View className="bg-pink-50 p-5 rounded-2xl mb-6">
                        <Text className="text-xl font-bold text-slate-900 mb-3">
                            What is a Period?
                        </Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">
                            A period is when blood and tissue from the uterus leave the body through the vagina. This happens once every month as part of the menstrual cycle.
                        </Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">
                            Your body prepares every month for a possible pregnancy. If pregnancy does not happen, the body sheds the extra lining of the uterus. This shedding is what we call a period.
                        </Text>
                        <View className="bg-pink-100 p-3 rounded-xl mt-2">
                            <Text className="text-sm font-medium text-pink-800 italic">
                                Periods usually last 3 to 7 days.
                            </Text>
                        </View>
                    </View>

                    {/* When Do Periods Start? */}
                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">When Do Periods Start?</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Most girls get their first period between ages 9 and 15. Everyone’s body is different, so it may start a little earlier or later. Your first period is called menarche.
                    </Text>
                    <Text className="text-lg font-bold text-slate-800 mb-2">Signs that your first period may start soon:</Text>
                    <View className="space-y-1 mb-4">
                        <Text className="text-base text-slate-700 ml-2">• Breast development</Text>
                        <Text className="text-base text-slate-700 ml-2">• Growth of hair under arms and pubic area</Text>
                        <Text className="text-base text-slate-700 ml-2">• White discharge from the vagina</Text>
                        <Text className="text-base text-slate-700 ml-2">• Sudden growth in height</Text>
                    </View>

                    {/* Menstrual Cycle Phases */}
                    <View className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100">
                        <Text className="text-xl font-bold text-slate-900 mb-4">The Menstrual Cycle Phases</Text>

                        <View className="mb-4">
                            <Text className="font-bold text-pink-600">1. Menstrual Phase</Text>
                            <Text className="text-slate-700">Bleeding (your period) happens. Lasts 3–7 days.</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="font-bold text-slate-800">2. Follicular Phase</Text>
                            <Text className="text-slate-700">Your body prepares an egg inside the ovaries.</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="font-bold text-slate-800">3. Ovulation</Text>
                            <Text className="text-slate-700">The ovary releases an egg. Around mid-cycle.</Text>
                        </View>

                        <View>
                            <Text className="font-bold text-slate-800">4. Luteal Phase</Text>
                            <Text className="text-slate-700">If not fertilized, lining breaks down & next period begins.</Text>
                        </View>
                    </View>

                    {/* Symptoms */}
                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">Common Period Symptoms</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-3">
                        It is normal to experience some changes during your period. You may notice:
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {["Cramps", "Back pain", "Mood swings", "Tiredness", "Bloating", "Headaches", "Cravings"].map(tag => (
                            <View key={tag} className="bg-slate-100 px-3 py-1 rounded-full"><Text className="text-xs text-slate-600 font-medium">{tag}</Text></View>
                        ))}
                    </View>
                    <Text className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                        Known as PMS (Premenstrual Syndrome). If pain is very strong or periods extremely heavy, talk to a doctor.
                    </Text>

                    {/* Hygiene */}
                    <Text className="text-2xl font-bold text-slate-900 mt-8 mb-3">Period Hygiene</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Taking care of your hygiene during periods is very important for health and comfort.
                    </Text>

                    <View className="bg-indigo-50 p-5 rounded-2xl mb-6 border border-indigo-100">
                        <Text className="text-lg font-bold text-indigo-900 mb-3">Hygiene Tips</Text>
                        <View className="space-y-2">
                            <Text className="text-base text-indigo-800">• Change pads every 4–6 hours</Text>
                            <Text className="text-base text-indigo-800">• Wash your hands before and after changing</Text>
                            <Text className="text-base text-indigo-800">• Keep the vaginal area clean and dry</Text>
                            <Text className="text-base text-indigo-800">• Dispose used pads properly</Text>
                            <Text className="text-base text-indigo-800">• Wear comfortable cotton underwear</Text>
                        </View>
                    </View>

                    {/* Pain Management */}
                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">Managing Period Pain</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Drinking warm water, using a heating pad on the stomach, doing light exercise, and eating healthy (iron-rich foods like spinach) can help you feel better.
                    </Text>

                    {/* Myths */}
                    <View className="bg-green-50 p-5 rounded-2xl mb-12 border border-green-100">
                        <Text className="text-xl font-bold text-green-900 mb-3">Period Myths vs Truths</Text>
                        <Text className="text-base text-green-800 leading-relaxed mb-1">✅ You CAN take a bath</Text>
                        <Text className="text-base text-green-800 leading-relaxed mb-1">✅ You CAN play sports</Text>
                        <Text className="text-base text-green-800 leading-relaxed mb-1">✅ You CAN go to school</Text>
                        <Text className="text-base text-green-800 font-bold mt-3 italic">
                            Periods are not dirty or shameful. They are a natural and healthy process!
                        </Text>
                    </View>

                    {/* Conclusion */}
                    <View className="bg-slate-900 p-6 rounded-2xl mb-12">
                        <Text className="text-xl font-bold text-white mb-3">Remember This</Text>
                        <Text className="text-slate-300 mb-4 leading-relaxed">
                            Getting your period is a normal part of growing up. It means your body is healthy and developing.
                        </Text>
                        <Text className="text-pink-400 font-extrabold text-center text-lg uppercase tracking-wider">
                            Be proud of your strength.
                        </Text>
                    </View>

                </View>
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
