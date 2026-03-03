import { Stack } from "expo-router";

export default function TrackerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="anemia" />
      <Stack.Screen name="BP" />
      <Stack.Screen name="Glucose" />
      <Stack.Screen name="pcos" />
      <Stack.Screen name="general" />
      <Stack.Screen name="mood" />
      <Stack.Screen name="periods" />
      <Stack.Screen name="skin" />
    </Stack>
  );
}
