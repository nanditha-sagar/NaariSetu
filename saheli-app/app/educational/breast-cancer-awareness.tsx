import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function BreastCancerAwarenessArticle() {
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
                        Breast Cancer Awareness
                    </Text>
                    <Text className="text-xl font-medium text-pink-500 mb-4">
                        Warning Signs, Early Detection & Screening
                    </Text>

                    <View className="flex-row items-center mb-6">
                        <MaterialIcons name="access-time" size={16} color="#94a3b8" />
                        <Text className="text-slate-500 text-xs ml-1 font-medium">5 min read</Text>
                    </View>
                </View>

                <View className="space-y-6">
                    <Text className="text-base text-slate-700 leading-relaxed">
                        Breast cancer is one of the most common cancers in women. The good news is that when breast cancer is detected early, the chances of successful treatment are very high.
                    </Text>

                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Being aware of warning signs and getting regular screenings can help detect the disease early and save lives.
                    </Text>

                    {/* Warning Signs */}
                    <View className="bg-pink-50 p-5 rounded-2xl mb-6">
                        <Text className="text-xl font-bold text-slate-900 mb-3 flex-row items-center">
                            <MaterialIcons name="warning" size={22} color="#ec4899" /> Warning Signs and Symptoms
                        </Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">
                            Many women first notice signs of breast cancer while doing monthly self-examinations at home. If you notice any unusual changes, it is important to consult a doctor as soon as possible.
                        </Text>

                        <Text className="text-lg font-bold text-slate-800 mt-2 mb-2">Changes in Breast Appearance</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Change in the shape or size of the breast</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Dimpling or irritation of the skin</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Inverted or turned-in nipple</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Swelling in one breast</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• One breast becoming smaller than the other</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">• New unevenness between both breasts</Text>

                        <Text className="text-lg font-bold text-slate-800 mt-2 mb-2">Changes in How the Breast Feels</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Lumps in the breast or underarm</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Changes in skin texture</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">• Tenderness or pain</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-4">• Increased firmness in a specific area</Text>

                        <Text className="text-lg font-bold text-slate-800 mt-2 mb-2">Nipple Discharge</Text>
                        <Text className="text-base text-slate-700 leading-relaxed mb-1">Fluid coming from the nipple can also be a warning sign. It may appear:</Text>
                        <Text className="text-base text-slate-700 leading-relaxed ml-4">• Milky</Text>
                        <Text className="text-base text-slate-700 leading-relaxed ml-4">• Clear</Text>
                        <Text className="text-base text-slate-700 leading-relaxed ml-4 mb-4">• Bloody</Text>

                        <View className="bg-pink-100 p-3 rounded-xl mt-2">
                            <Text className="text-sm font-medium text-pink-800 italic">
                                These symptoms do not always mean cancer, but they should never be ignored.
                            </Text>
                        </View>
                    </View>

                    {/* Early Detection */}
                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">Importance of Early Detection</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Early detection is the best way to treat breast cancer successfully. Two important methods help detect breast cancer early:
                    </Text>

                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <Text className="font-bold text-slate-800 mb-1">1. Breast Self-Exam (BSE)</Text>
                            <Text className="text-sm text-slate-600 mb-1">• Done by yourself once every month</Text>
                            <Text className="text-sm text-slate-600">• Helps you notice changes early</Text>
                        </View>
                        <View className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <Text className="font-bold text-slate-800 mb-1">2. Clinical Breast Exam (CBE)</Text>
                            <Text className="text-sm text-slate-600 mb-1">• Performed by a doctor or professional</Text>
                            <Text className="text-sm text-slate-600">• Helps detect lumps or abnormalities</Text>
                        </View>
                    </View>
                    <Text className="text-base font-semibold text-slate-800 mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                        According to research, breast cancer detected at Stage 0 or Stage 1 has nearly a 100% survival rate for 5 years if treated early.
                    </Text>

                    {/* Stages */}
                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">Early Stages of Breast Cancer</Text>

                    <Text className="text-lg font-bold text-indigo-800 mt-4 mb-1">Stage 0 – Ductal Carcinoma In Situ (DCIS)</Text>
                    <Text className="text-base text-slate-700 leading-relaxed">• Abnormal cells are found in the milk ducts</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">• The cancer has not spread outside the ducts</Text>

                    <Text className="text-lg font-bold text-indigo-800 mt-2 mb-1">Stage 0 – Lobular Carcinoma In Situ (LCIS)</Text>
                    <Text className="text-base text-slate-700 leading-relaxed">• Abnormal cells grow in lobules (milk-producing glands)</Text>
                    <Text className="text-base text-slate-700 leading-relaxed">• Not always considered cancer, but it increases the risk of future breast cancer</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">• Doctors may recommend hormone therapy medications to reduce the risk.</Text>

                    <Text className="text-lg font-bold text-indigo-800 mt-2 mb-1">Stage 1 Breast Cancer</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-2">At this stage, cancer is present but still limited to the breast.</Text>

                    <View className="ml-4 mb-4 border-l-2 border-indigo-200 pl-4 py-2">
                        <Text className="font-bold text-slate-800 mb-1">Stage 1A</Text>
                        <Text className="text-sm text-slate-600 mb-1">• Tumor size is smaller than 2 cm</Text>
                        <Text className="text-sm text-slate-600 mb-3">• Cancer has not spread to lymph nodes</Text>

                        <Text className="font-bold text-slate-800 mb-1">Stage 1B</Text>
                        <Text className="text-sm text-slate-600 mb-1">• Small clusters of cancer cells appear in lymph nodes</Text>
                        <Text className="text-sm text-slate-600">• These clusters are very tiny (about the size of a grain of rice)</Text>
                    </View>

                    {/* Screening */}
                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">Breast Cancer Screening</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Screening helps detect breast cancer before symptoms appear.
                    </Text>
                    <Text className="text-lg font-bold text-slate-800 mb-2">Mammograms</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-2">
                        A mammogram is an X-ray image of the breast used to detect cancer early. It can detect breast cancer up to 3 years before a lump can be felt.
                    </Text>

                    <View className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                        <Text className="font-bold text-slate-800 mb-2">How a Mammogram Works:</Text>
                        <Text className="text-sm text-slate-700 mb-1">1. You stand in front of an X-ray machine.</Text>
                        <Text className="text-sm text-slate-700 mb-1">2. Your breast is placed on a flat plate.</Text>
                        <Text className="text-sm text-slate-700 mb-1">3. Another plate presses down gently to hold the breast still.</Text>
                        <Text className="text-sm text-slate-700 mb-2">4. Images are taken from multiple angles.</Text>
                        <Text className="text-sm text-slate-500 italic">Some women may feel mild discomfort, but the test is quick.</Text>
                    </View>

                    <Text className="text-lg font-bold text-slate-800 mt-4 mb-2">Limitations of Screening</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-2">
                        Although mammograms are the best screening tool available, they are not 100% accurate.
                    </Text>

                    <Text className="font-bold text-amber-700 mb-1 mt-2">False Positive</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-2">
                        A mammogram may show cancer when there is none. This can lead to stress, additional tests, and extra medical costs.
                    </Text>

                    <Text className="font-bold text-red-700 mb-1">False Negative</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Sometimes a mammogram misses cancer even when it is present. About 20% of breast cancers are not detected in mammograms, especially in women with dense breast tissue.
                    </Text>

                    <Text className="text-2xl font-bold text-slate-900 mt-6 mb-3">Awareness & Social Stigma</Text>

                    <Text className="text-lg font-bold text-slate-800 mb-2">Age and Breast Cancer</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Women over 40 years old are usually advised to get regular mammograms. However, breast cancer can also occur in younger women. Every year thousands of women under 40 are diagnosed with breast cancer. This is why awareness and self-exams are important at any age.
                    </Text>

                    <Text className="text-lg font-bold text-slate-800 mb-2">Breast Cancer in Developing Countries</Text>
                    <Text className="text-base text-slate-700 leading-relaxed mb-2">
                        Around 60% of breast cancer deaths occur in developing countries. Major reasons include:
                    </Text>
                    <Text className="text-base text-slate-700 leading-relaxed ml-2">• Lack of awareness</Text>
                    <Text className="text-base text-slate-700 leading-relaxed ml-2">• Limited medical facilities</Text>
                    <Text className="text-base text-slate-700 leading-relaxed ml-2">• Poor access to screening</Text>
                    <Text className="text-base text-slate-700 leading-relaxed ml-2 mb-4">• Social stigma</Text>

                    <Text className="text-base text-slate-700 leading-relaxed mb-4">
                        Because of these issues, the survival rate in these regions is much lower. In some societies, discussing breast health is considered uncomfortable or inappropriate. This leads to women not talking about symptoms, doctors not recommending screenings, and late diagnosis.
                    </Text>

                    <Text className="text-base font-semibold text-pink-700 leading-relaxed mb-6 bg-pink-50 p-4 rounded-xl">
                        Breaking these stigmas through education and awareness is very important. Education and awareness campaigns can help save many lives!
                    </Text>

                    {/* Conclusion */}
                    <View className="bg-slate-900 p-6 rounded-2xl mb-12">
                        <Text className="text-xl font-bold text-white mb-3">Conclusion</Text>
                        <Text className="text-slate-300 mb-4 leading-relaxed">
                            Breast cancer screening and early detection can greatly increase survival rates. By being aware of the symptoms, performing monthly self-exams, and getting regular medical check-ups, many lives can be saved.
                        </Text>
                        <Text className="text-pink-400 font-bold italic">
                            "Breast cancer awareness is not just about treatment — it is about education, early detection, and breaking social stigma."
                        </Text>
                        <View className="h-px bg-slate-700 my-4" />
                        <Text className="text-white font-extrabold text-center text-lg uppercase tracking-wider">
                            Stay aware. Stay informed.
                        </Text>
                        <Text className="text-pink-400 font-extrabold text-center text-lg uppercase tracking-wider">
                            Early detection saves lives.
                        </Text>
                    </View>

                </View>
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
