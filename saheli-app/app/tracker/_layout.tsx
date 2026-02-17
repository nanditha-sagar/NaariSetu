import { Stack } from "expo-router";

export default function TrackerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="anemia" />
      <Stack.Screen name="pcos" />
      <Stack.Screen name="general" />
    </Stack>
  );
}
