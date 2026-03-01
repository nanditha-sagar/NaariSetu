import { useState, useRef, useMemo } from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import {
  CONDITION_SYMPTOMS_MAP,
  DEFAULT_SYMPTOMS,
  Symptom,
} from "../constants/assessment";
import { saveFullAssessment } from "../services/healthService";
import { AssessmentData } from "../utils/data";

export const useAssessmentForm = () => {
  const [page, setPage] = useState(1);
  const scrollRef = useRef<ScrollView>(null);

  const [formData, setFormData] = useState({
    // Page 1
    dob: new Date(2000, 0, 1),
    maritalStatus: "",
    bloodGroup: "",
    occupation: "",
    availableCustomOccupations: [] as string[],
    height: "5' 6\"",
    weight: "62 kg",
    unexplainedWeightChange: false,
    activityLevel: "",
    dietType: "",
    waterIntake: "",
    medicalConditions: [] as string[],
    availableCustomConditions: [] as string[],
    currentSymptoms: [] as string[],
    availableCustomSymptoms: [] as string[],
    vitaminDeficiencies: [] as string[],
    availableCustomDeficiencies: [] as string[],
    lastPeriodDate: new Date(),

    // Page 2
    avgCycleLength: "",
    periodRegularity: "",
    bleedingDuration: "",
    periodFlow: "",
    severePain: false,
    pregnancies: 0,
    liveBirths: 0,
    familyHistory: [] as string[],
    availableCustomFamilyHistory: [] as string[],
    stressLevel: 50,
    sleepHours: "",
    alcohol: false,
    smoking: false,
    hemoglobin: "",
    bloodSugar: "",
    bloodPressure: "",
    primaryGoal: "",
    cravings: "",
    moodSwings: "",
    periodAcne: "",
    periodActiveness: "",
    periodCramps: "",
    availableCustomGoals: [] as string[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDOBPicker, setShowDOBPicker] = useState(false);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomCondition = (condition: string) => {
    if (!condition) return;
    setFormData((prev) => ({
      ...prev,
      availableCustomConditions: [...prev.availableCustomConditions, condition],
      medicalConditions: [...prev.medicalConditions, condition],
    }));
  };

  const addCustomSymptom = (symptom: string) => {
    if (!symptom) return;
    setFormData((prev) => ({
      ...prev,
      availableCustomSymptoms: [...prev.availableCustomSymptoms, symptom],
      currentSymptoms: [...prev.currentSymptoms, symptom],
    }));
  };

  const addCustomFamilyHistory = (history: string) => {
    if (!history) return;
    setFormData((prev) => ({
      ...prev,
      availableCustomFamilyHistory: [
        ...prev.availableCustomFamilyHistory,
        history,
      ],
      familyHistory: [...prev.familyHistory, history],
    }));
  };

  const addCustomOccupation = (occupation: string) => {
    if (!occupation) return;
    setFormData((prev) => ({
      ...prev,
      availableCustomOccupations: [
        ...prev.availableCustomOccupations,
        occupation,
      ],
      occupation: occupation,
    }));
  };

  const addCustomGoal = (goal: string) => {
    if (!goal) return;
    setFormData((prev) => ({
      ...prev,
      availableCustomGoals: [...prev.availableCustomGoals, goal],
      primaryGoal: goal,
    }));
  };

  const addCustomDeficiency = (deficiency: string) => {
    if (!deficiency) return;
    setFormData((prev) => ({
      ...prev,
      availableCustomDeficiencies: [
        ...prev.availableCustomDeficiencies,
        deficiency,
      ],
      vitaminDeficiencies: [...prev.vitaminDeficiencies, deficiency],
    }));
  };

  const removeCustomCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      availableCustomConditions: prev.availableCustomConditions.filter(
        (c) => c !== condition,
      ),
      medicalConditions: prev.medicalConditions.filter((c) => c !== condition),
    }));
  };

  const removeCustomSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      availableCustomSymptoms: prev.availableCustomSymptoms.filter(
        (s) => s !== symptom,
      ),
      currentSymptoms: prev.currentSymptoms.filter((s) => s !== symptom),
    }));
  };

  const removeCustomFamilyHistory = (history: string) => {
    setFormData((prev) => ({
      ...prev,
      availableCustomFamilyHistory: prev.availableCustomFamilyHistory.filter(
        (h) => h !== history,
      ),
      familyHistory: prev.familyHistory.filter((h) => h !== history),
    }));
  };

  const removeCustomOccupation = (occupation: string) => {
    setFormData((prev) => ({
      ...prev,
      availableCustomOccupations: prev.availableCustomOccupations.filter(
        (o) => o !== occupation,
      ),
      occupation: prev.occupation === occupation ? "" : prev.occupation,
    }));
  };

  const removeCustomGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      availableCustomGoals: prev.availableCustomGoals.filter((g) => g !== goal),
      primaryGoal: prev.primaryGoal === goal ? "" : prev.primaryGoal,
    }));
  };

  const removeCustomDeficiency = (deficiency: string) => {
    setFormData((prev) => ({
      ...prev,
      availableCustomDeficiencies: prev.availableCustomDeficiencies.filter(
        (d) => d !== deficiency,
      ),
      vitaminDeficiencies: prev.vitaminDeficiencies.filter(
        (d) => d !== deficiency,
      ),
    }));
  };

  const toggleItem = (
    field:
      | "medicalConditions"
      | "currentSymptoms"
      | "familyHistory"
      | "vitaminDeficiencies"
      | "availableCustomConditions"
      | "availableCustomSymptoms",
    item: string,
  ) => {
    setFormData((prev) => {
      let list = [...prev[field]];
      const isNone = item.toLowerCase() === "none";

      if (isNone) {
        // If "None" is toggled ON, clear everything else. If toggled OFF, just remove it.
        list = list.includes(item) ? [] : [item];
      } else {
        // If an item is NOT "None", and we're adding it, remove "None" if it exists.
        if (list.includes(item)) {
          list = list.filter((i) => i !== item);
        } else {
          list = list.filter((i) => i.toLowerCase() !== "none");
          list.push(item);
        }
      }
      return { ...prev, [field]: list };
    });
  };

  const handleNext = async () => {
    if (page === 1) {
      setPage(2);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else if (page === 2) {
      setPage(3);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      try {
        // Map dob and lastPeriodDate to ISO strings for database
        const submissionData: AssessmentData = {
          ...formData,
          dob: formData.dob.toISOString(),
          lastPeriodDate: formData.lastPeriodDate.toISOString(),
        };

        await saveFullAssessment(submissionData);
        router.push("/screening/results");
      } catch (error) {
        console.error("Submission failed:", error);
        // Fallback to results even if save fails for UX, or show alert
        router.push("/screening/results");
      }
    }
  };

  const age = useMemo(() => {
    const today = new Date();
    let calculatedAge = today.getFullYear() - formData.dob.getFullYear();
    const monthDiff = today.getMonth() - formData.dob.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < formData.dob.getDate())
    ) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [formData.dob]);

  const visibleSymptoms = useMemo(() => {
    const symptoms: Symptom[] = [];
    const symptomSet = new Set<string>();

    // Add predefined symptoms based on conditions
    formData.medicalConditions.forEach((condition) => {
      if (CONDITION_SYMPTOMS_MAP[condition]) {
        CONDITION_SYMPTOMS_MAP[condition].forEach((s) => {
          if (!symptomSet.has(s.id)) {
            symptomSet.add(s.id);
            symptoms.push(s);
          }
        });
      }
    });

    // Add custom symptoms added by user
    formData.availableCustomSymptoms.forEach((label) => {
      const id = `custom_${label.toLowerCase().replace(/\s/g, "_")}`;
      if (!symptomSet.has(id)) {
        symptomSet.add(id);
        symptoms.push({ id, label, icon: "add_circle_outline" });
      }
    });

    // Add default symptoms if nothing else or as base
    if (symptoms.length === 0 || formData.medicalConditions.includes("None")) {
      DEFAULT_SYMPTOMS.forEach((s) => {
        if (!symptomSet.has(s.id)) {
          symptomSet.add(s.id);
          symptoms.push(s);
        }
      });
    } else {
      // Always add "None" for selection
      symptoms.push({ id: "none_sym", label: "None", icon: "check-circle" });
    }

    return symptoms;
  }, [formData.medicalConditions, formData.availableCustomSymptoms]);

  return {
    page,
    setPage,
    scrollRef,
    formData,
    showDatePicker,
    setShowDatePicker,
    showDOBPicker,
    setShowDOBPicker,
    updateField,
    toggleItem,
    addCustomCondition,
    addCustomSymptom,
    addCustomFamilyHistory,
    addCustomOccupation,
    removeCustomCondition,
    removeCustomSymptom,
    removeCustomFamilyHistory,
    removeCustomOccupation,
    removeCustomDeficiency,
    addCustomDeficiency,
    addCustomGoal,
    removeCustomGoal,
    handleNext,
    visibleSymptoms,
    age,
  };
};
