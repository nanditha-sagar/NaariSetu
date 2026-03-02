import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useSegments, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import "../global.css";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "welcome",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const [session, setSession] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Listen for auth changes (this also handles initial session check)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "signup" ||
      segments[0] === "welcome";

    if (session && inAuthGroup) {
      // Redirect logged-in users away from auth screens
      router.replace("/(tabs)/home");
    } else if (
      !session &&
      !inAuthGroup &&
      segments[0] !== "screening" &&
      segments[0] !== "modal" &&
      segments[0] !== undefined
    ) {
      // Optional: Redirect unauthenticated users to welcome (if they try to access tabs)
      // For now, only redirect if they are specifically in tabs.
      if (segments[0] === "(tabs)") {
        router.replace("/welcome");
      }
    }
  }, [session, segments, isReady]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        <Stack.Screen
          name="screening/index"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="screening/symptoms"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="screening/scan"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="screening/results"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="screening/assessment"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
