import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    // Small delay to ensure navigation context is ready
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
