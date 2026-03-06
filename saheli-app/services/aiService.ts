import { InferenceClient } from "@huggingface/inference";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import {
  AnemiaInsights,
  BPInsights,
  GlucoseInsights,
  MoodInsights,
  PeriodInsights,
} from "../utils/trackerData";

// TODO: Replace with your actual Hugging Face API Token
// Get it for free at: https://huggingface.co/settings/tokens
const HF_ACCESS_TOKEN = process.env.EXPO_PUBLIC_HF_TOKEN || "";
const hf = new InferenceClient(HF_ACCESS_TOKEN);

const MODEL_ID = "aaditya/Llama3-OpenBioLLM-8B";

export interface GlobalTriageResult {
  urgency: "Green" | "Amber" | "Red" | "Crisis";
  summary: string;
  correlations: string[];
  recommendations: string[];
  disclaimer: string;
}

export interface HealthSnapshot {
  anemia?: AnemiaInsights | null;
  bp?: BPInsights | null;
  glucose?: GlucoseInsights | null;
  mood?: MoodInsights | null;
  periods?: PeriodInsights | null;
  profile?: {
    age?: number;
    conditions?: string[];
  };
}

export interface FoodAnalysisResult {
  detected_food: string;
  estimated_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  portion_description: string;
}

const LOCAL_PROXY_URL =
  process.env.EXPO_PUBLIC_AI_BACKEND_URL || "http://192.168.1.2:8000";

/**
 * Clinical AI Triage Service (Saheli AI)
 * Analyzes cross-tracker data to find hidden health correlations.
 */
export async function getGlobalClinicalTriage(
  snapshot: HealthSnapshot,
): Promise<GlobalTriageResult | null> {
  // We now use the local Python backend as a proxy for Hugging Face

  try {
    const response = await fetch(`${LOCAL_PROXY_URL}/triage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: snapshot }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Proxy error: ${errorText}`);
    }

    const result = await response.json();
    return result as GlobalTriageResult;
  } catch (error) {
    console.error("Saheli AI Triage Error:", error);
    return null;
  }
}

/**
 * AI Food Analyzer
 * Uploads an image to the local Python proxy for food recognition and calorie estimation.
 */
export async function analyzeFood(
  imageUri: string,
): Promise<FoodAnalysisResult | null> {
  try {
    let base64Image = "";

    if (Platform.OS === "web") {
      const resp = await fetch(imageUri);
      const blob = await resp.blob();
      base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result?.toString().split(",")[1];
          resolve(base64 || "");
        };
        reader.readAsDataURL(blob);
      });
    } else {
      base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64",
      });
    }

    const response = await fetch(`${LOCAL_PROXY_URL}/analyze-food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        image_base64: base64Image,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Food analysis error: ${errorText}`);
    }

    const result = await response.json();
    return result as FoodAnalysisResult;
  } catch (error) {
    console.error("Food Analysis Error:", error);
    return null;
  }
}
