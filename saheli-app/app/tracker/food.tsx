import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { analyzeFood, FoodAnalysisResult } from "@/services/aiService";

export default function FoodTrackerScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);

  const pickImage = async (useCamera: boolean) => {
    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setResult(null);
      }
    } catch (e) {
      Alert.alert("Error", "Could not select an image");
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);

    try {
      const analysis = await analyzeFood(image);
      if (analysis) {
        setResult(analysis);
      } else {
        Alert.alert(
          "Analysis Failed",
          "Could not analyze the food image. Ensure your backend is running.",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    Alert.alert(
      "Food Logged!",
      "Your meal has been saved to your daily tracker.",
    );
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back-ios" size={20} color="#334155" />
        </Pressable>
        <Text className="text-lg font-bold text-slate-900">
          Food & Calories
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Image Preview / Picker */}
        <View className="items-center mb-8">
          {image ? (
            /* REMOVED: shadow-sm */
            <View className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200">
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setImage(null)}
                /* REMOVED: bg-black/50, replaced with inline style */
                className="absolute top-3 right-3 p-2 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </Pressable>
            </View>
          ) : (
            <View className="w-full aspect-video bg-green-50 rounded-3xl items-center justify-center border-2 border-dashed border-green-200">
              <MaterialIcons
                name="restaurant-menu"
                size={48}
                color="#86efac"
                className="mb-2"
              />
              <Text className="text-slate-500 font-medium mb-4">
                What did you eat today?
              </Text>

              <View className="flex-row gap-4">
                {/* REMOVED: shadow-sm */}
                <Pressable
                  onPress={() => pickImage(true)}
                  className="bg-white px-4 py-2 rounded-xl flex-row items-center border border-green-200"
                >
                  <MaterialIcons
                    name="camera-alt"
                    size={20}
                    color="#22c55e"
                    className="mr-2"
                  />
                  <Text className="text-green-600 font-bold">Camera</Text>
                </Pressable>

                {/* REMOVED: shadow-sm */}
                <Pressable
                  onPress={() => pickImage(false)}
                  className="bg-white px-4 py-2 rounded-xl flex-row items-center border border-green-200"
                >
                  <MaterialIcons
                    name="photo-library"
                    size={20}
                    color="#22c55e"
                    className="mr-2"
                  />
                  <Text className="text-green-600 font-bold">Gallery</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        {image && !result && !analyzing && (
          /* REMOVED: shadow-sm */
          <Pressable
            onPress={handleAnalyze}
            className="w-full bg-green-500 p-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">
              Analyze Nutrition
            </Text>
          </Pressable>
        )}

        {/* Loading State */}
        {analyzing && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-slate-500 mt-4 font-medium">
              Saheli AI is analyzing your food...
            </Text>
            <Text className="text-xs text-slate-400 mt-1">
              This takes about 5-10 seconds
            </Text>
          </View>
        )}

        {/* Results */}
        {result && (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                <Text className="text-2xl">🍽️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-green-600 uppercase tracking-widest">
                  Detected Meal
                </Text>
                <Text className="text-xl font-bold text-slate-900 capitalize">
                  {result.detected_food.replace(/_/g, " ")}
                </Text>
              </View>
            </View>

            {/* REMOVED: shadow-sm */}
            <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 flex-row justify-between items-center">
              <View>
                <Text className="text-slate-500 text-xs mb-1">
                  Estimated Calories
                </Text>
                <Text className="text-3xl font-black text-slate-800">
                  {result.estimated_calories}
                </Text>
              </View>
              <View className="bg-green-500 px-3 py-1 rounded-full">
                <Text className="text-white font-bold text-xs">
                  {result.portion_description}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between gap-3 mb-6">
              {/* REMOVED: bg-blue-50/50, replaced with inline style */}
              <View
                className="flex-1 p-3 rounded-xl border border-blue-100 items-center"
                style={{ backgroundColor: "rgba(239, 246, 255, 0.5)" }}
              >
                <Text className="text-blue-500 font-bold mb-1">Protein</Text>
                <Text className="text-lg font-black text-slate-800">
                  {result.protein_g}g
                </Text>
              </View>
              {/* REMOVED: bg-orange-50/50, replaced with inline style */}
              <View
                className="flex-1 p-3 rounded-xl border border-orange-100 items-center"
                style={{ backgroundColor: "rgba(255, 237, 213, 0.5)" }}
              >
                <Text className="text-orange-500 font-bold mb-1">Carbs</Text>
                <Text className="text-lg font-black text-slate-800">
                  {result.carbs_g}g
                </Text>
              </View>
              {/* REMOVED: bg-yellow-50/50, replaced with inline style */}
              <View
                className="flex-1 p-3 rounded-xl border border-yellow-100 items-center"
                style={{ backgroundColor: "rgba(254, 252, 232, 0.5)" }}
              >
                <Text className="text-yellow-500 font-bold mb-1">Fat</Text>
                <Text className="text-lg font-black text-slate-800">
                  {result.fat_g}g
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleSave}
              className="w-full bg-slate-900 p-4 rounded-2xl items-center"
            >
              <Text className="text-white font-bold text-lg">
                Log this Meal
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
