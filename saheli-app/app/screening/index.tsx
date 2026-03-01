import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const SCREENING_OPTIONS = [
  {
    id: "full-assessment",
    title: "Full Health Assessment",
    description:
      "Deep dive into your health with a 3-page comprehensive checkup.",
    icon: "assignment",
    color: ["#f471b5", "#ec4899"],
    route: "/screening/assessment",
    tag: "Recommended",
  },
  {
    id: "nail-scan",
    title: "AI Nail Analysis",
    description:
      "Scan your nails for rapid detection of anemia and other conditions.",
    icon: "camera-alt",
    color: ["#6366f1", "#4f46e5"],
    route: "/screening/symptoms",
    tag: "AI Powered",
  },
  {
    id: "symptoms",
    title: "Quick Symptom Track",
    description: "Brief survey to check specific health concerns and risks.",
    icon: "health-and-safety",
    color: ["#10b981", "#059669"],
    route: "/screening/symptoms",
    tag: "Fast",
  },
];

export default function ScreeningHub() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#64748b" />
        </Pressable>
        <Text style={styles.headerTitle}>Screening Hub</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Choose Your Health Check</Text>
          <Text style={styles.introDescription}>
            Select a screening tool below to get started with an AI-powered
            diagnostic analysis.
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          {SCREENING_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => router.push(option.route as any)}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
              ]}
            >
              <LinearGradient
                colors={option.color as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name={option.icon as any}
                      size={32}
                      color="white"
                    />
                  </View>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{option.tag}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>
                    {option.description}
                  </Text>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.startText}>Start Screening</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={18}
                      color="white"
                    />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="shield" size={24} color="#f471b5" />
          <Text style={styles.infoText}>
            Your health data is encrypted and private. Analysis is performed
            using localized AI models.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
  },
  introSection: {
    marginBottom: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  optionsGrid: {
    gap: 20,
  },
  optionCard: {
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  optionCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardGradient: {
    padding: 24,
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  tagContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardFooter: {
    marginTop: "auto",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
    marginBottom: 20,
  },
  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  startText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginTop: 32,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },
});
