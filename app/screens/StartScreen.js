import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function StartScreen({ navigation }) {

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const user = JSON.parse(userDataString);
          navigation.navigate("HomeScreen");
        } else {
          // If no user data found, navigate to login
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Navigate to login in case of error
        navigation.navigate("LoginScreen");
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchUserData();
  }, [navigation]);
  
  return (
    <Background>
      <Logo />
      <Header>Welcome to SkyLander</Header>
      <Paragraph>
        A starter app template for React Native Expo, featuring a ready-to-use
        login screen.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Log in
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Create an account
      </Button>
    </Background>
  );
}
