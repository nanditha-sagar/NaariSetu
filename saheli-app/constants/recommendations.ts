import { AssessmentData } from "../utils/data";

export interface Recommendation {
    title: string;
    description: string;
    icon: string;
}

export interface InsightsData {
    highlight: string;
    diet: Recommendation[];
    yoga: Recommendation[];
    meditation: Recommendation[];
}

export const getPersonalizedInsights = (data: AssessmentData): InsightsData => {
    const diet: Recommendation[] = [];
    const yoga: Recommendation[] = [];
    const meditation: Recommendation[] = [];
    let highlight = "Your health profile looks balanced! Focus on consistency.";

    // --- Diet Recommendations ---
    if (data.medicalConditions.includes("Anemia") || data.vitaminDeficiencies.includes("Iron")) {
        diet.push({
            title: "Iron-Rich Power Foods",
            description: "Incorporate spinach, beetroots, and dates into your meals to boost hemoglobin.",
            icon: "restaurant",
        });
        highlight = "Focus on iron-rich foods today to help boost your energy levels.";
    }

    if (data.medicalConditions.includes("Diabetes") || data.medicalConditions.includes("PCOS")) {
        diet.push({
            title: "Low Glycemic Index Diet",
            description: "Swap white rice for whole grains like oats or quinoa to stabilize blood sugar.",
            icon: "spa",
        });
    }

    if (data.vitaminDeficiencies.includes("Vitamin D")) {
        diet.push({
            title: "Sunshine & Nutrients",
            description: "Try to get 15 mins of morning sun and add mushrooms or fortified milk to your diet.",
            icon: "wb-sunny",
        });
    }

    // Fallback diet
    if (diet.length === 0) {
        diet.push({
            title: "Balanced Nutrition",
            description: "Ensure a mix of colorful vegetables, proteins, and healthy fats in every meal.",
            icon: "restaurant",
        });
    }

    // --- Yoga & Activity ---
    if (data.primaryGoal.includes("Weight loss")) {
        yoga.push({
            title: "Surya Namaskar",
            description: "12 rounds of Sun Salutation will help burn calories and improve flexibility.",
            icon: "directions-run",
        });
        highlight = "A brisk morning workout or Surya Namaskar will kickstart your metabolism.";
    }

    if (data.periodCramps === "Severe") {
        yoga.push({
            title: "Balasana (Child's Pose)",
            description: "Gently relieves pressure in the lower back and eases menstrual discomfort.",
            icon: "self-improvement",
        });
    }

    if (data.medicalConditions.includes("Thyroid (Hypo)")) {
        yoga.push({
            title: "Sarvangasana (Shoulder Stand)",
            description: "Known to stimulate the thyroid gland. Practice under guidance.",
            icon: "fitness-center",
        });
    }

    // Fallback yoga
    if (yoga.length === 0) {
        yoga.push({
            title: "Daily Stretching",
            description: "Spend 10 minutes stretching your neck, shoulders, and back for better posture.",
            icon: "accessibility",
        });
    }

    // --- Meditation & Stress ---
    const stress = data.stressLevel;
    if (stress > 70) {
        meditation.push({
            title: "4-7-8 Breathing",
            description: "Inhale 4s, hold 7s, exhale 8s. Repeat 4 times to instantly calm your nervous system.",
            icon: "air",
        });
        highlight = "You've been feeling stressed lately. Let's take 5 minutes to breathe today.";
    } else if (stress > 40) {
        meditation.push({
            title: "Mindful Body Scan",
            description: "A 10-minute body scan can help you reconnect and release hidden tension.",
            icon: "visibility",
        });
    }

    if (data.sleepHours.includes("4-5h") || data.sleepHours.includes("5-6h")) {
        meditation.push({
            title: "Yoga Nidra",
            description: "Helps compensate for lack of sleep by putting the body in deep relaxation.",
            icon: "bedtime",
        });
        highlight = "Prioritize rest today. A short afternoon meditation might help your recovery.";
    }

    // Fallback meditation
    if (meditation.length === 0) {
        meditation.push({
            title: "Gratitude Journaling",
            description: "Before bed, list 3 things you are grateful for to improve sleep quality.",
            icon: "edit",
        });
    }

    return { highlight, diet, yoga, meditation };
};
