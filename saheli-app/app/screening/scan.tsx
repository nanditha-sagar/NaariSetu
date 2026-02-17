import React, { useState } from "react";
import { View, Text, Pressable, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { getScreenings, saveScreening } from "@/utils/data";

export default function ScanScreen() {
  const params = useLocalSearchParams<{
    screeningId: string;
    answersJson?: string;
  }>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      pickImage();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCapture = async () => {
    if (!imageUri) {
      takePhoto();
      return;
    }

    // Attach image to existing screening and navigate to results
    setIsAnalyzing(true);

    setTimeout(async () => {
      // Update the screening entry with the image
      if (params.screeningId) {
        const screenings = await getScreenings();
        const idx = screenings.findIndex((s) => s.id === params.screeningId);
        if (idx >= 0) {
          screenings[idx].imageUri = imageUri;
          screenings[idx].type = "nail_analysis";
          const AsyncStorage =
            require("@react-native-async-storage/async-storage").default;
          await AsyncStorage.setItem(
            "saheliScreenings",
            JSON.stringify(screenings),
          );
        }
      }

      setIsAnalyzing(false);
      router.replace({
        pathname: "/screening/results",
        params: { id: params.screeningId },
      });
    }, 1500);
  };

  const handleSkip = () => {
    router.replace({
      pathname: "/screening/results",
      params: { id: params.screeningId },
    });
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background Image / Camera Preview */}
      <View className="absolute inset-0">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-slate-900 items-center justify-center">
            <MaterialIcons name="camera-alt" size={64} color="#333" />
          </View>
        )}
        {/* Overlay */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        />
      </View>

      <SafeAreaView className="flex-1 z-10">
        {/* Top Controls */}
        <View className="px-6 pt-2">
          <View
            className="rounded-2xl p-4 border"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <MaterialIcons name="close" size={22} color="white" />
              </Pressable>
              <Text className="text-xs font-bold text-primary tracking-widest uppercase">
                Photo (Optional)
              </Text>
              <Pressable
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <MaterialIcons name="help-outline" size={22} color="white" />
              </Pressable>
            </View>
            <Text className="text-sm font-medium text-white text-center">
              Add a nail photo for enhanced AI analysis
            </Text>
          </View>
        </View>

        {/* Scanning Frame */}
        <View className="flex-1 items-center justify-center">
          <View
            className="w-64 h-72 rounded-xl border-2 items-center justify-center relative"
            style={{ borderColor: "rgba(244,113,181,0.6)" }}
          >
            {/* Corners */}
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

            {/* Hand Silhouette */}
            {!imageUri && (
              <View style={{ opacity: 0.3 }}>
                <MaterialIcons name="back-hand" size={80} color="white" />
              </View>
            )}
          </View>

          {/* Status Badge */}
          <View
            className="mt-6 px-4 py-2 rounded-full flex-row items-center gap-2 border"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <View
              className={`w-2 h-2 rounded-full ${isAnalyzing ? "bg-amber-400" : imageUri ? "bg-green-400" : "bg-green-400"}`}
            />
            <Text className="text-xs font-medium text-white tracking-wide">
              {isAnalyzing
                ? "ANALYZING..."
                : imageUri
                  ? "IMAGE CAPTURED"
                  : "AI READY FOR SCAN"}
            </Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="px-8 pb-6">
          {/* Skip Button */}
          <Pressable
            onPress={handleSkip}
            className="w-full py-3 rounded-xl flex-row items-center justify-center gap-2 mb-5 border"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            <MaterialIcons name="skip-next" size={18} color="white" />
            <Text className="text-white font-medium text-sm">
              Skip Photo & View Results
            </Text>
          </Pressable>

          <View className="flex-row items-center justify-between">
            {/* Gallery */}
            <Pressable
              onPress={pickImage}
              className="w-14 h-14 rounded-lg border-2 overflow-hidden items-center justify-center"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="photo-library" size={24} color="white" />
              )}
            </Pressable>

            {/* Shutter Button */}
            <Pressable onPress={handleCapture} disabled={isAnalyzing}>
              <View className="relative">
                <View className="w-20 h-20 rounded-full border-4 border-white bg-primary items-center justify-center">
                  <View
                    className="w-16 h-16 rounded-full border-2 items-center justify-center"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    {isAnalyzing ? (
                      <MaterialIcons
                        name="hourglass-top"
                        size={28}
                        color="white"
                      />
                    ) : imageUri ? (
                      <MaterialIcons name="check" size={28} color="white" />
                    ) : (
                      <MaterialIcons name="camera" size={28} color="white" />
                    )}
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Flash Toggle */}
            <Pressable
              onPress={() => setFlashOn(!flashOn)}
              className="w-14 h-14 rounded-full border items-center justify-center"
              style={{
                backgroundColor: flashOn
                  ? "rgba(244,113,181,0.5)"
                  : "rgba(0,0,0,0.3)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <MaterialIcons
                name={flashOn ? "flash-on" : "flash-off"}
                size={22}
                color="white"
              />
            </Pressable>
          </View>

          {/* Step Indicator */}
          <Text
            className="text-center text-[10px] mt-4 uppercase tracking-widest font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Optional: Nail Photo Scan
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
