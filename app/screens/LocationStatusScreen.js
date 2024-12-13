import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import NavbarSearch from "../components/NavbarSearch";

export default function LocationStatusScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");

  // Sample data
  const locations = [
    { id: "1", name: "eMooVit Office", coordinates: "2.909884, 101.655099", status: "Pending" },
    { id: "2", name: "Obama Oval", coordinates: "2.909271, 101.655418", status: "Approved" },
    { id: "3", name: "Rekascape", coordinates: "2.908619, 101.656735", status: "Rejected" },
  ];

  // Filter locations based on search text
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.coordinates}>{item.coordinates}</Text>
      </View>
      <Text style={[styles.status, styles[item.status.toLowerCase()]]}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Pass searchText and setSearchText to NavbarSearch */}
      <NavbarSearch
        searchText={searchText}
        setSearchText={setSearchText}
        onMenuPress={() => console.log("Menu opened")}
        onNotificationPress={() => console.log("Notifications clicked")}
        navigation={navigation}
      />

      {/* List of locations */}
      <FlatList
        data={filteredLocations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
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
  },
  coordinates: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  pending: {
    color: "orange",
  },
  approved: {
    color: "green",
  },
  rejected: {
    color: "red",
  },
});
