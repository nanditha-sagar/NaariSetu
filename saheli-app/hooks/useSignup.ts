import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/authService";

export function useSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.signUp(email, password);

      if (!data.user) throw new Error("User not created");

      await authService.createProfile({
        id: data.user.id,
        full_name: name,
        email: email,
        phone: phone,
        age: age ? parseInt(age) : null,
        country: country,
        state: state,
        city: city,
      });

      Alert.alert(
        "Success",
        "Account created successfully! Please check email.",
      );

      router.replace("/login");
    } catch (error: any) {
      console.log("Signup error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form: {
      name,
      setName,
      email,
      setEmail,
      phone,
      setPhone,
      age,
      setAge,
      country,
      setCountry,
      state,
      setState,
      city,
      setCity,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
    },
    ui: {
      showPassword,
      setShowPassword,
      showConfirmPassword,
      setShowConfirmPassword,
      isLoading,
    },
    handleSignup,
  };
}
