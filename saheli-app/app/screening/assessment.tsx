import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

// Modularized imports
import { useAssessmentForm } from "../../hooks/useAssessmentForm";
import {
  ACTIVITY_OPTIONS,
  DIET_OPTIONS,
  MEDICAL_CONDITIONS,
  PERIOD_REGULARITY_OPTIONS,
  BLEEDING_DURATION_OPTIONS,
  PERIOD_FLOW_OPTIONS,
  FAMILY_HISTORY_OPTIONS,
  SLEEP_HOURS_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  OCCUPATION_OPTIONS,
  WATER_INTAKE_OPTIONS,
  CRAVINGS_OPTIONS,
  MOOD_SWINGS_OPTIONS,
  PERIOD_ACNE_OPTIONS,
  PERIOD_ACTIVENESS_OPTIONS,
  PERIOD_CRAMPS_OPTIONS,
  VITAMIN_DEFICIENCIES,
} from "../../constants/assessment";
import {
  Stepper,
  SectionHeader,
  InputField,
  ToggleCard,
  SelectGroup,
  SymptomItem,
} from "../../components/assessment/AssessmentComponents";

export default function AssessmentScreen() {
  const {
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
    handleNext,
    visibleSymptoms,
    age,
    addCustomCondition,
    addCustomSymptom,
    addCustomFamilyHistory,
    addCustomOccupation,
    removeCustomCondition,
    removeCustomSymptom,
    removeCustomFamilyHistory,
    removeCustomOccupation,
    addCustomDeficiency,
    removeCustomDeficiency,
    addCustomGoal,
    removeCustomGoal,
  } = useAssessmentForm();

  const [customConditionText, setCustomConditionText] = React.useState("");
  const [customSymptomText, setCustomSymptomText] = React.useState("");
  const [customDeficiencyText, setCustomDeficiencyText] = React.useState("");
  const [customOccupationText, setCustomOccupationText] = React.useState("");
  const [customGoalText, setCustomGoalText] = React.useState("");
  const [customFamilyHistoryText, setCustomFamilyHistoryText] =
    React.useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header content remain same but modularized */}
        <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
          <Pressable
            onPress={() => (page === 1 ? router.back() : setPage(1))}
            className="size-10 items-center justify-center rounded-full"
          >
            <MaterialIcons
              name={page === 1 ? "arrow-back" : "arrow-back-ios"}
              size={22}
              color="#0f172a"
            />
          </Pressable>
          <Text className="flex-1 text-center mr-10 text-lg font-bold text-slate-900">
            NaariSetu
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-4">
            <Stepper currentStep={page} totalSteps={3} />
          </View>

          {page === 1 ? (
            <View className="pb-24">
              {/* <SectionHeader icon="person" title="Basic Information" /> */}

              <SectionHeader icon="calendar-today" title="Date of Birth" />
              <Pressable
                onPress={() => setShowDOBPicker(true)}
                className="flex-row items-center bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 h-14"
              >
                <MaterialIcons
                  name="cake"
                  size={20}
                  color="#f4256a"
                  style={{ marginRight: 10 }}
                />
                <Text className="text-slate-900 text-base font-medium">
                  {formData.dob.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </Pressable>
              {showDOBPicker && (
                <DateTimePicker
                  value={formData.dob}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDOBPicker(false);
                    if (date) updateField("dob", date);
                  }}
                />
              )}

              <View className="mt-4 mb-5">
                <Text className="text-slate-700 font-bold mb-2 ml-1 text-sm">
                  Age
                </Text>
                <View className="flex-row items-center bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 h-14">
                  <MaterialIcons
                    name="hourglass-empty"
                    size={20}
                    color="#94a3b8"
                    style={{ marginRight: 10 }}
                  />
                  <Text className="text-slate-900 text-base font-medium">
                    {age} Years Old
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <SelectGroup
                  label="Relationship Status"
                  options={MARITAL_STATUS_OPTIONS}
                  selected={formData.maritalStatus}
                  onSelect={(v) => updateField("maritalStatus", v)}
                />
              </View>

              <View className="mt-4">
                <SelectGroup
                  label="Blood Group"
                  options={BLOOD_GROUP_OPTIONS}
                  selected={formData.bloodGroup}
                  onSelect={(v) => updateField("bloodGroup", v)}
                  grid
                />
              </View>

              <View className="flex-row gap-4 mb-2">
                <View className="flex-1">
                  <Text className="text-slate-700 font-semibold mb-2 ml-1 text-sm">
                    Height
                  </Text>
                  <View className="flex-row items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl h-14 px-4">
                    <MaterialIcons name="height" size={20} color="#94a3b8" />
                    <Text className="text-slate-900 font-medium">
                      {formData.height}
                    </Text>
                    <MaterialIcons
                      name="unfold-more"
                      size={16}
                      color="#f4256a"
                    />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-slate-700 font-semibold mb-2 ml-1 text-sm">
                    Weight
                  </Text>
                  <View className="flex-row items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl h-14 px-4">
                    <MaterialIcons
                      name="fitness-center"
                      size={20}
                      color="#94a3b8"
                    />
                    <Text className="text-slate-900 font-medium">
                      {formData.weight}
                    </Text>
                    <MaterialIcons
                      name="unfold-more"
                      size={16}
                      color="#f4256a"
                    />
                  </View>
                </View>
              </View>

              <View className="mt-4">
                <SelectGroup
                  label="Occupation"
                  options={[
                    ...OCCUPATION_OPTIONS,
                    ...formData.availableCustomOccupations,
                  ]}
                  selected={formData.occupation}
                  onSelect={(v) => updateField("occupation", v)}
                />

                {formData.availableCustomOccupations.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-slate-500 text-xs font-bold mb-2 uppercase">
                      Your Custom Occupations
                    </Text>
                    {formData.availableCustomOccupations.map((occ) => (
                      <View
                        key={occ}
                        className="flex-row items-center justify-between bg-primary/5 p-3 rounded-xl mb-2"
                      >
                        <Text className="text-slate-800 font-medium">
                          {occ}
                        </Text>
                        <Pressable onPress={() => removeCustomOccupation(occ)}>
                          <MaterialIcons
                            name="delete-outline"
                            size={20}
                            color="#94a3b8"
                          />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}

                <View className="flex-row gap-2 mb-6">
                  <View className="flex-1">
                    <InputField
                      label="Other Occupation"
                      placeholder="e.g. Designer"
                      value={customOccupationText}
                      onChangeText={setCustomOccupationText}
                    />
                  </View>
                  <Pressable
                    onPress={() => {
                      addCustomOccupation(customOccupationText);
                      setCustomOccupationText("");
                    }}
                    className="mt-7 h-14 px-5 bg-primary/10 border border-primary/20 rounded-2xl items-center justify-center"
                  >
                    <MaterialIcons name="add" size={24} color="#f4256a" />
                  </Pressable>
                </View>
              </View>

              <SelectGroup
                label="Activity Level"
                options={ACTIVITY_OPTIONS}
                selected={formData.activityLevel}
                onSelect={(val) => updateField("activityLevel", val)}
              />

              <SelectGroup
                label="Water Intake"
                options={WATER_INTAKE_OPTIONS}
                selected={formData.waterIntake}
                onSelect={(val) => updateField("waterIntake", val)}
              />
            </View>
          ) : page === 2 ? (
            <View className="pb-24">
              <SectionHeader
                icon="medical_services"
                title="Existing Medical Conditions"
                subtitle="Select all MS that apply to your medical journey."
              />
              <SelectGroup
                label=""
                options={[
                  ...MEDICAL_CONDITIONS,
                  ...formData.availableCustomConditions,
                ]}
                selected={formData.medicalConditions}
                multiSelect
                onSelect={(val) => toggleItem("medicalConditions", val)}
              />

              {formData.availableCustomConditions.length > 0 && (
                <View className="mb-4">
                  <Text className="text-slate-500 text-xs font-bold mb-2 uppercase">
                    Your Custom Conditions
                  </Text>
                  {formData.availableCustomConditions.map((condition) => (
                    <View
                      key={condition}
                      className="flex-row items-center justify-between bg-primary/5 p-3 rounded-xl mb-2"
                    >
                      <Text className="text-slate-800 font-medium">
                        {condition}
                      </Text>
                      <Pressable
                        onPress={() => removeCustomCondition(condition)}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color="#94a3b8"
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row gap-2 mb-6">
                <View className="flex-1">
                  <InputField
                    label="Other Medical Condition"
                    placeholder="e.g. Arthritis"
                    value={customConditionText}
                    onChangeText={setCustomConditionText}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    addCustomCondition(customConditionText);
                    setCustomConditionText("");
                  }}
                  className="mt-7 h-14 px-5 bg-primary/10 border border-primary/20 rounded-2xl items-center justify-center"
                >
                  <MaterialIcons name="add" size={24} color="#f4256a" />
                </Pressable>
              </View>

              <SectionHeader icon="healing" title="Vitamin Deficiencies" />
              <SelectGroup
                label=""
                options={[
                  ...VITAMIN_DEFICIENCIES,
                  ...formData.availableCustomDeficiencies,
                ]}
                selected={formData.vitaminDeficiencies}
                multiSelect
                onSelect={(v) => toggleItem("vitaminDeficiencies", v)}
              />

              {formData.availableCustomDeficiencies.length > 0 && (
                <View className="mb-4">
                  <Text className="text-slate-500 text-xs font-bold mb-2 uppercase">
                    Your Custom Deficiencies
                  </Text>
                  {formData.availableCustomDeficiencies.map((def) => (
                    <View
                      key={def}
                      className="flex-row items-center justify-between bg-primary/5 p-3 rounded-xl mb-2"
                    >
                      <Text className="text-slate-800 font-medium">{def}</Text>
                      <Pressable onPress={() => removeCustomDeficiency(def)}>
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color="#94a3b8"
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row gap-2 mb-6">
                <View className="flex-1">
                  <InputField
                    label="Other Deficiency"
                    placeholder="e.g. Zinc deficiency"
                    value={customDeficiencyText}
                    onChangeText={setCustomDeficiencyText}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    addCustomDeficiency(customDeficiencyText);
                    setCustomDeficiencyText("");
                  }}
                  className="mt-7 h-14 px-5 bg-primary/10 border border-primary/20 rounded-2xl items-center justify-center"
                >
                  <MaterialIcons name="add" size={24} color="#f4256a" />
                </Pressable>
              </View>

              <SectionHeader
                icon="info"
                title="Current Symptoms"
                subtitle="Based on your selected conditions."
              />
              <View>
                {visibleSymptoms.map((s) => {
                  const isCustom = s.id.startsWith("custom_");
                  return (
                    <SymptomItem
                      key={s.id}
                      label={s.label}
                      isSelected={formData.currentSymptoms.includes(s.label)}
                      onToggle={() => toggleItem("currentSymptoms", s.label)}
                      onDelete={
                        isCustom
                          ? () => removeCustomSymptom(s.label)
                          : undefined
                      }
                    />
                  );
                })}
              </View>

              <View className="flex-row gap-2 mb-6">
                <View className="flex-1">
                  <InputField
                    label="Other Symptom"
                    placeholder="e.g. Dry skin"
                    value={customSymptomText}
                    onChangeText={setCustomSymptomText}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    addCustomSymptom(customSymptomText);
                    setCustomSymptomText("");
                  }}
                  className="mt-7 h-14 px-5 bg-primary/10 border border-primary/20 rounded-2xl items-center justify-center"
                >
                  <MaterialIcons name="add" size={24} color="#f4256a" />
                </Pressable>
              </View>

              <SectionHeader icon="lifestyle" title="Lifestyle & Well-being" />
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-slate-800 font-bold text-sm">
                    Stress Levels
                  </Text>
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary text-xs font-bold">
                      Moderate
                    </Text>
                  </View>
                </View>
                <View className="h-1.5 bg-primary/20 rounded-full">
                  <View
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: "45%" }}
                  />
                  <View className="absolute top-[-5px] left-[45%] size-4 bg-primary border-2 border-white rounded-full shadow-sm" />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                    Low
                  </Text>
                  <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                    High
                  </Text>
                </View>
              </View>

              <SelectGroup
                label="Daily Sleep Hours"
                options={SLEEP_HOURS_OPTIONS}
                selected={formData.sleepHours}
                onSelect={(v) => updateField("sleepHours", v)}
                grid
              />

              <ToggleCard
                label="Alcohol Consumption"
                icon="wine_bar"
                value={formData.alcohol}
                onValueChange={(v) => updateField("alcohol", v)}
              />
              <ToggleCard
                label="Smoking"
                icon="smoke_free"
                value={formData.smoking}
                onValueChange={(v) => updateField("smoking", v)}
              />
              <SectionHeader icon="family_history" title="Family History" />
              <SelectGroup
                label=""
                options={[
                  ...FAMILY_HISTORY_OPTIONS,
                  ...formData.availableCustomFamilyHistory,
                ]}
                selected={formData.familyHistory}
                multiSelect
                onSelect={(v) => toggleItem("familyHistory", v)}
              />

              {formData.availableCustomFamilyHistory.length > 0 && (
                <View className="mb-4">
                  <Text className="text-slate-500 text-xs font-bold mb-2 uppercase">
                    Your Custom History
                  </Text>
                  {formData.availableCustomFamilyHistory.map((history) => (
                    <View
                      key={history}
                      className="flex-row items-center justify-between bg-primary/5 p-3 rounded-xl mb-2"
                    >
                      <Text className="text-slate-800 font-medium">
                        {history}
                      </Text>
                      <Pressable
                        onPress={() => removeCustomFamilyHistory(history)}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color="#94a3b8"
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row gap-2 mb-6">
                <View className="flex-1">
                  <InputField
                    label="Other Family History"
                    placeholder="e.g. Heart Disease"
                    value={customFamilyHistoryText}
                    onChangeText={setCustomFamilyHistoryText}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    addCustomFamilyHistory(customFamilyHistoryText);
                    setCustomFamilyHistoryText("");
                  }}
                  className="mt-7 h-14 px-5 bg-primary/10 border border-primary/20 rounded-2xl items-center justify-center"
                >
                  <MaterialIcons name="add" size={24} color="#f4256a" />
                </Pressable>
              </View>

              <SectionHeader icon="family_history" title="Family History" />
              <SelectGroup
                label=""
                options={FAMILY_HISTORY_OPTIONS}
                selected={formData.familyHistory}
                multiSelect
                onSelect={(v) => toggleItem("familyHistory", v)}
              />
            </View>
          ) : (
            <View className="pb-24">
              <SectionHeader icon="calendar-today" title="Menstrual Start" />
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 h-14"
              >
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color="#f4256a"
                  style={{ marginRight: 10 }}
                />
                <Text className="text-slate-900 text-base font-medium">
                  {formData.lastPeriodDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.lastPeriodDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) updateField("lastPeriodDate", date);
                  }}
                />
              )}

              <SectionHeader icon="repeat" title="Menstrual Health" />
              <InputField
                label="Average Cycle Length (Days)"
                placeholder="28"
                value={formData.avgCycleLength}
                onChangeText={(t) => updateField("avgCycleLength", t)}
                keyboardType="numeric"
              />

              <SelectGroup
                label="Is your period regular?"
                options={PERIOD_REGULARITY_OPTIONS}
                selected={formData.periodRegularity}
                onSelect={(v) => updateField("periodRegularity", v)}
              />

              <SelectGroup
                label="Bleeding Duration (Days)"
                options={BLEEDING_DURATION_OPTIONS}
                selected={formData.bleedingDuration}
                onSelect={(v) => updateField("bleedingDuration", v)}
              />

              <SelectGroup
                label="Describe your Flow"
                options={PERIOD_FLOW_OPTIONS}
                selected={formData.periodFlow}
                onSelect={(v) => updateField("periodFlow", v)}
              />

              <SelectGroup
                label="Cravings"
                options={CRAVINGS_OPTIONS}
                selected={formData.cravings}
                onSelect={(v) => updateField("cravings", v)}
              />

              <SelectGroup
                label="Mood Swings?"
                options={MOOD_SWINGS_OPTIONS}
                selected={formData.moodSwings}
                onSelect={(v) => updateField("moodSwings", v)}
              />

              <SelectGroup
                label="Period Acne?"
                options={PERIOD_ACNE_OPTIONS}
                selected={formData.periodAcne}
                onSelect={(v) => updateField("periodAcne", v)}
              />

              <SelectGroup
                label="Activeness Level"
                options={PERIOD_ACTIVENESS_OPTIONS}
                selected={formData.periodActiveness}
                onSelect={(v) => updateField("periodActiveness", v)}
              />

              <SelectGroup
                label="Cramps Severity"
                options={PERIOD_CRAMPS_OPTIONS}
                selected={formData.periodCramps}
                onSelect={(v) => updateField("periodCramps", v)}
              />

              {/* <SectionHeader
                icon="analytics"
                title="Latest Key Health Values"
                subtitle="Optional: Skip if not known"
              /> */}

              <SectionHeader icon="flag" title="Primary Health Goal" />
              <SelectGroup
                label=""
                options={[
                  ...PRIMARY_GOAL_OPTIONS,
                  ...formData.availableCustomGoals,
                ]}
                selected={formData.primaryGoal}
                onSelect={(val) => updateField("primaryGoal", val)}
              />

              {formData.availableCustomGoals.length > 0 && (
                <View className="mb-4">
                  <Text className="text-slate-500 text-xs font-bold mb-2 uppercase">
                    Your Custom Goals
                  </Text>
                  {formData.availableCustomGoals.map((goal) => (
                    <View
                      key={goal}
                      className="flex-row items-center justify-between bg-primary/5 p-3 rounded-xl mb-2"
                    >
                      <Text className="text-slate-800 font-medium">{goal}</Text>
                      <Pressable onPress={() => removeCustomGoal(goal)}>
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color="#94a3b8"
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row gap-2 mb-6">
                <View className="flex-1">
                  <InputField
                    label="Other Goal"
                    placeholder="e.g. Better sleep"
                    value={customGoalText}
                    onChangeText={setCustomGoalText}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    addCustomGoal(customGoalText);
                    setCustomGoalText("");
                  }}
                  className="mt-7 h-14 px-5 bg-primary/10 border border-primary/20 rounded-2xl items-center justify-center"
                >
                  <MaterialIcons name="add" size={24} color="#f4256a" />
                </Pressable>
              </View>
            </View>
          )}

          <View className="h-10" />
        </ScrollView>

        {/* Footer */}
        <View className="p-4 bg-white/90 border-t border-slate-100">
          <Pressable
            onPress={handleNext}
            className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/25"
          >
            <Text className="text-white font-bold text-base">
              {page === 3 ? "Complete Assessment" : "Continue to Next Step"}
            </Text>
            <MaterialIcons
              name={page === 3 ? "trending-flat" : "arrow-forward"}
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </Pressable>
          <Text className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-bold">
            Step {page} of 3 • Assessment
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
