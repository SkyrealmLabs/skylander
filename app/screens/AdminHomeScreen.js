import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminHomeScreen({ navigation }) {

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
          title="SKYLANDER ADMIN"
          onMenuPress={() => console.log("Menu opened")}
          onNotificationPress={() => console.log("Notifications clicked")}
        />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={[styles.cardValue, {color: '#419afa'}]}>34</Text>
            <Text style={styles.cardText}>Total Registered Location</Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardValue, {color: '#fadb41'}]}>26</Text>
            <Text style={styles.cardText}>Pending  Enrollment</Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardValue, {color: '#77fa73'}]}>5</Text>
            <Text style={styles.cardText}>Approved Enrollment</Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardValue, {color: '#fa6675'}]}>3</Text>
            <Text style={styles.cardText}>Rejected Enrollment</Text>
          </View>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AdminLocationListScreen")}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Location List</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </View>
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
    flexWrap: "wrap", // Allow wrapping to next row
    justifyContent: "space-between", // Distribute evenly
    alignItems: "center",
    paddingTop: 0,
    marginTop: 20,
    paddingHorizontal: 20,
    zIndex: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "48%", // 2 cards per row
    aspectRatio: 1, // Keep square shape
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15, // Space between rows
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
  cardValue: {
    marginTop: 10,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
    fontSize: 40,
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    aspectRatio: 5,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingHorizontal: 15, // Ensure proper spacing
  },

  buttonContent: {
    flexDirection: "row", // Align text and icon in a row
    justifyContent: "space-between", // Push text left, icon right
    alignItems: "center",
  },

  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});
