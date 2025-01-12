import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {

  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true);
  const [hideNavbarMenu, setHideNavbarMenu] = useState(() => () => { });

  const dismissMenuAndKeyboard = () => {
    Keyboard.dismiss(); // Dismiss keyboard if open
    hideNavbarMenu(); // Hide the profile menu in the Navbar
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const user = JSON.parse(userDataString); // Parse JSON string to object
          setUserData(user); // Set user data state
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissMenuAndKeyboard}>
      <View style={styles.container}>
        {/* Navbar Component */}
        <Navbar
          title="SKYLANDER"
          onMenuPress={() => console.log("Menu opened")}
          onNotificationPress={() => console.log("Notifications clicked")}
          style={styles.navbar}
        />

        {/* Content */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("RegisterLocationScreen")}
          >
            <Ionicons name="location-outline" size={40} color="#004AAD" />
            <Text style={styles.cardText}>Register New Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("LocationStatusScreen")}
          >
            <Ionicons name="paper-plane-outline" size={40} color="#004AAD" />
            <Text style={styles.cardText}>View Location Status</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-around", // Space out items horizontally
    alignItems: "flex-start", // Align items to the top
    paddingTop: 20, // Add padding at the top
    marginTop: 20, // Ensure extra space under the navbar
    paddingHorizontal: 20,
    zIndex: 0
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 170,
    aspectRatio: 1, // Square buttons
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20
  },
});
