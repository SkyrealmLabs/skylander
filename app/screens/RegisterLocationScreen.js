import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavbarSearch from "../components/NavbarSearch";
import { API_BASE_URL } from "../core/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GET_LOCATIONS_API_URL = API_BASE_URL + "api/location/getLocationByUserId";

const RegisterLocationScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [pendingLocations, setPendingLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData(); // Fetch data when the screen is focused
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user");
      if (userDataString) {
        const user = JSON.parse(userDataString); // Parse JSON string to object
        setUserData(user); // Set user data state
        await fetchLocations(user.id); // Pass userID to fetch locations
      } else {
        // If no user data found, navigate to login
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Navigate to login in case of error
      navigation.navigate("LoginScreen");
    }
  };

  const fetchLocations = async (userID) => {
    try {
      const response = await fetch(GET_LOCATIONS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID }),
      });

      const data = await response.json();

      if (response.ok) {
        // Filter pending locations
        const pending = data.data.filter(
          (location) => location.status === "pending"
        );
        setPendingLocations(pending);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching locations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLocationItem = ({ item }) => (
    <View style={styles.locationItem}>
      <Ionicons name="location-outline" size={24} color="#083A75" />
      <View style={styles.locationDetails}>
        <Text style={styles.locationAddress}>{item.locationAddress}</Text>
        <Text style={styles.locationCoordinates}>
          {item.latitude}, {item.longitude}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button and Search Bar */}
      <NavbarSearch
        searchText={searchText}
        setSearchText={setSearchText}
        onMenuPress={() => console.log("Menu opened")}
        onNotificationPress={() => console.log("Notifications clicked")}
        navigation={navigation}
      />

      {/* Actions */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("AddLocationCoordinateScreen")}
        >
          <Ionicons name="locate-outline" size={24} color="#083A75" />
          <Text style={styles.actionText}>Use current location</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Locations Section */}
      <Text style={styles.sectionHeader}>Pending registered locations</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={pendingLocations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.locationList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pending locations found.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  actionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#083A75",
  },
  sectionHeader: {
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    backgroundColor: "#f3f3f3",
  },
  locationList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
    fontWeight: "bold",
  },
  locationCoordinates: {
    fontSize: 12,
    color: "#4287f5",
  },
  loadingText: {
    padding: 16,
    textAlign: "center",
    color: "#666",
  },
  emptyText: {
    padding: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default RegisterLocationScreen;
