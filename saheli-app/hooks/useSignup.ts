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
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAgeFromDob = (birthday: string) => {
    if (!birthday) return "";
    const birthDate = new Date(birthday);
    const today = new Date();
    let ageValue = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageValue--;
    }
    return ageValue.toString();
  };

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
        id: data.user.uid,
        full_name: name,
        email: email,
        phone: phone,
        age: age ? parseInt(age) : dob ? parseInt(getAgeFromDob(dob)) : null,
        dob: dob,
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
      dob,
      setDob,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
    },
    ui: {
      getAgeFromDob,
      showPassword,
      setShowPassword,
      showConfirmPassword,
      setShowConfirmPassword,
      isLoading,
    },
    handleSignup,
  };
}
