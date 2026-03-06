import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function GrowingUpSafely() {
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
                        Growing Up Safely
                    </Text>
                    <Text className="text-xl font-medium text-pink-500 mb-4">
                        A Simple Guide to Body Awareness and Safe Choices
                    </Text>

                    <View className="flex-row items-center mb-6">
                        <MaterialIcons name="access-time" size={16} color="#94a3b8" />
                        <Text className="text-slate-500 text-xs ml-1 font-medium">5 min read</Text>
                    </View>
                </View>

                <View className="space-y-6">
                    <Text className="text-base text-slate-700 leading-relaxed">
                        As you grow older, your body and emotions change. Learning about your body, relationships, and safety helps you make healthy and confident decisions.
                    </Text>

                    {/* Understanding Your Body */}
                    <Section title="Understanding Your Body" icon="person">
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">
                            During puberty, your body begins to change. These changes are completely normal and happen at different ages for everyone.
                        </Text>
                        <BulletPoint text="Breast development" />
                        <BulletPoint text="Growth of body hair" />
                        <BulletPoint text="Starting your menstrual cycle (periods)" />
                        <BulletPoint text="Emotional changes or mood swings" />
                        <BulletPoint text="Curiosity about relationships" />
                    </Section>

                    {/* Why Sex Education Matters */}
                    <View className="bg-indigo-50 p-5 rounded-2xl mb-6">
                        <Text className="text-xl font-bold text-indigo-900 mb-3">Why Sex Education Matters</Text>
                        <BulletPoint text="Understand how your body works" color="indigo" />
                        <BulletPoint text="Learn about reproductive health" color="indigo" />
                        <BulletPoint text="Make safe and responsible choices" color="indigo" />
                        <BulletPoint text="Protect yourself from health risks" color="indigo" />
                        <BulletPoint text="Build confidence and self-respect" color="indigo" />
                    </View>

                    {/* Respect and Consent */}
                    <Section title="Respect and Consent" icon="front-hand">
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">
                            Consent means clear permission and agreement. Your body belongs only to you.
                        </Text>
                        <BulletPoint text="You have the right to say no" />
                        <BulletPoint text="No one should pressure or force you" />
                        <BulletPoint text="Healthy relationships involve respect and trust" />
                        <Text className="text-sm font-bold text-pink-600 mt-4 italic">
                            If something makes you uncomfortable, speak up and seek help.
                        </Text>
                    </Section>

                    {/* Safe Practices */}
                    <Section title="Safe Practices & Health" icon="security">
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">
                            Protection methods help prevent unplanned pregnancy and sexually transmitted infections (STIs). Examples include:
                        </Text>
                        <BulletPoint text="Condoms" />
                        <BulletPoint text="Medical birth control methods (given by doctors)" />
                        <Text className="text-base text-slate-700 leading-relaxed mt-4">
                            For teenagers, the safest choice is often waiting until they are mature and well-informed.
                        </Text>
                    </Section>

                    {/* Online Safety */}
                    <View className="bg-slate-900 p-6 rounded-2xl mb-6">
                        <Text className="text-xl font-bold text-white mb-3">Stay Safe Online</Text>
                        <BulletPoint text="Never share private photos" color="white" />
                        <BulletPoint text="Avoid sharing personal info with strangers" color="white" />
                        <BulletPoint text="Block people who make you uncomfortable" color="white" />
                        <BulletPoint text="Tell a trusted adult if something feels wrong" color="white" />
                    </View>

                    {/* Talk to Trusted Adults */}
                    <Section title="Talk to Trusted Adults" icon="forum">
                        <Text className="text-base text-slate-700 leading-relaxed mb-2">
                            If you feel confused or worried, talk to someone you trust:
                        </Text>
                        <Text className="text-base text-slate-700 leading-relaxed">
                            Parents, teachers, school counselors, or doctors can guide you and answer your questions.
                        </Text>
                    </Section>

                    {/* Conclusion */}
                    <View className="bg-pink-500 p-6 rounded-2xl mb-12">
                        <Text className="text-xl font-bold text-white mb-2">Respect Yourself</Text>
                        <Text className="text-white opacity-90 leading-relaxed mb-4">
                            Growing up is about learning and building your future. Your body deserves respect, and making smart choices today helps your future.
                        </Text>
                        <Text className="text-white font-extrabold text-center text-lg uppercase tracking-wider">
                            Stay confident. Stay healthy.
                        </Text>
                    </View>

                </View>
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <View className="mb-6">
            <View className="flex-row items-center mb-3">
                <MaterialIcons name={icon as any} size={22} color="#ec4899" />
                <Text className="text-2xl font-bold text-slate-900 ml-2">{title}</Text>
            </View>
            {children}
        </View>
    );
}

function BulletPoint({ text, color = "slate" }: { text: string; color?: string }) {
    const textColor = color === "white" ? "text-white opacity-90" : color === "indigo" ? "text-indigo-800" : "text-slate-700";
    return (
        <View className="flex-row items-start mb-2">
            <Text className={textColor + " mr-2"}>•</Text>
            <Text className={"text-base leading-relaxed " + textColor}>{text}</Text>
        </View>
    );
}
