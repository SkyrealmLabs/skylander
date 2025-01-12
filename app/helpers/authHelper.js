// src/helpers/authHelpers.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../core/config";

export const loginUser = async (email, password, navigation) => {
  const LOGIN_API_URL =  API_BASE_URL + "api/login";
  console.log("🚀 ~ loginUser ~ LOGIN_API_URL:", LOGIN_API_URL)

  try {
    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role: "user" }),
    });

    const result = await response.json();
    console.log("🚀 ~ loginUser ~ result:", result)

    if (response.ok) {
      // Store token and user data
      await AsyncStorage.setItem("token", result.token);
      await AsyncStorage.setItem("user", JSON.stringify(result.user));

      // Navigate to HomeScreen
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });

      return true; // Login successful
    } else {
      console.error("Login failed:", result.message);
      return false; // Login failed
    }
  } catch (error) {
    console.error("Error during login:", error);
    return false; // Error occurred
  }
};
