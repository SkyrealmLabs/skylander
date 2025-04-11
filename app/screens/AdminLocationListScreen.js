import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import NavbarSearch from "../components/NavbarSearch";
import { API_BASE_URL } from "../core/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

const GET_LOCATIONS_API_URL = API_BASE_URL + "api/location/get";

export default function AdminLocationListScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Fetch locations from the API
  useEffect(() => {
    const fetchUserDataAndLocations = async () => {
      try {
        // Get user data from AsyncStorage
        const userDataString = await AsyncStorage.getItem('user');
        if (!userDataString) {
          navigation.navigate("LoginScreen");
          return;
        }

        const user = JSON.parse(userDataString);
        setUserData(user);

        // Fetch locations
        const response = await fetch(GET_LOCATIONS_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          } // Pass userID in the request body
        });

        const data = await response.json();

        if (response.ok) {
          // Transform API data to match UI structure
          const transformedLocations = data.data.map((location) => ({
            id: location.id.toString(),
            name: location.locationAddress,
            enrolledBy: `${location.latitude}, ${location.longitude}`,
            status: location.status,
            username: location.name,
            userid: location.userid
          }));
          setLocations(transformedLocations);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching locations");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndLocations();
  }, []);

  // Filter locations based on search text
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() =>
        navigation.navigate("AdminLocationDetailsScreen", { locationID: item.id })
      }>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.enrolledBy}>Enrolled by {item.username}</Text>
        <Text style={[styles.status, styles[item.status.toLowerCase()]]}>{item.status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#333" />
    </TouchableOpacity>
  );

  // Define the ListEmptyComponent
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No locations found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <NavbarSearch
        searchText={searchText}
        setSearchText={setSearchText}
        onMenuPress={() => console.log("Menu opened")}
        onNotificationPress={() => console.log("Notifications clicked")}
        navigation={navigation}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredLocations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={filteredLocations.length === 0 ? styles.flatListContainer : styles.list}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 250,
  },
  enrolledBy: {
    fontSize: 14,
    color: "#4287f5",
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 5,
    marginTop: 5
  },
  pending: {
    color: "#ebb900",
    backgroundColor: '#ffefb3'
  },
  approved: {
    color: "#02991d",
    backgroundColor: '#a2fcb2'
  },
  rejected: {
    color: "#ff0600",
    backgroundColor: '#ffb2b0'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
  },
});
