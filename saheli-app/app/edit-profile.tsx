import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";
import { authService, ProfileInput } from "@/services/authService";

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<ProfileInput>>({
    full_name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    blood_group: "",
    marital_status: "",
    occupation: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const data = await authService.getProfile(user.id);
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.full_name) {
      Alert.alert("Error", "Full name is required.");
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await authService.updateProfile({
        ...profile,
        id: user.id,
      });

      if (Platform.OS === "web") {
        alert("Profile updated successfully!");
        router.replace("/profile");
      } else {
        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.navigate("/profile");
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      if (Platform.OS === "web") {
        alert(error.message || "Failed to save profile.");
      } else {
        Alert.alert("Error", error.message || "Failed to save profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    key: keyof ProfileInput,
    placeholder: string,
    keyboardType: any = "default",
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) =>
          setProfile((prev) => ({ ...prev, [key]: text }))
        }
        placeholder={placeholder}
        placeholderTextColor="#cbd5e1"
        keyboardType={keyboardType}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec135b" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="close" size={24} color="#64748b" />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={60} color="#ec135b" />
            </View>
            <Pressable style={styles.changePicButton}>
              <Text style={styles.changePicText}>Change Photo</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderInput(
              "Full Name",
              profile.full_name || "",
              "full_name",
              "Enter your name",
            )}
            {renderInput(
              "Phone Number",
              profile.phone || "",
              "phone",
              "Enter phone number",
              "phone-pad",
            )}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                {renderInput("City", profile.city || "", "city", "City")}
              </View>
              <View style={{ flex: 1 }}>
                {renderInput("State", profile.state || "", "state", "State")}
              </View>
            </View>
            {renderInput(
              "Country",
              profile.country || "",
              "country",
              "Country",
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Profile</Text>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                {renderInput(
                  "Blood Group",
                  profile.blood_group || "",
                  "blood_group",
                  "O+",
                  "default",
                )}
              </View>
              <View style={{ flex: 1 }}>
                {renderInput(
                  "Occupation",
                  profile.occupation || "",
                  "occupation",
                  "Job",
                  "default",
                )}
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                {renderInput(
                  "Height",
                  profile.height || "",
                  "height",
                  "e.g. 5'6\"",
                  "default",
                )}
              </View>
              <View style={{ flex: 1 }}>
                {renderInput(
                  "Weight",
                  profile.weight || "",
                  "weight",
                  "e.g. 60 kg",
                  "default",
                )}
              </View>
            </View>
            {renderInput(
              "Marital Status",
              profile.marital_status || "",
              "marital_status",
              "Single/Married",
              "default",
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.8 },
              saving && { backgroundColor: "#fecdd3" },
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonTextBottom}>Save Profile</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  backButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ec135b",
  },
  scrollContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff1f2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fecdd3",
    marginBottom: 12,
  },
  changePicButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  changePicText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: "#0f172a",
  },
  row: {
    flexDirection: "row",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#ec135b",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec135b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonTextBottom: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
