import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar Component */}
      <Navbar
        title="SKYLANDER"
        onMenuPress={() => console.log("Menu opened")}
        onNotificationPress={() => console.log("Notifications clicked")}
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
    </SafeAreaView>
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
