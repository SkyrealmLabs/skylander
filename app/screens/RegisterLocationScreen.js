import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NavbarSearch from "../components/NavbarSearch";

const RegisterLocationScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const registeredLocations = [
    {
      id: "1",
      title: "Near Home Town",
      address: "Persiaran Putra 9, Bandar Baru Putra, 31400 Ipoh, Perak",
      coordinates: "4.662944, 101.143673",
    },
    {
      id: "2",
      title: "My Home",
      address: "Persiaran Permai Sentosa, Seri Kembangan, 43300 Petaling, Selangor",
      coordinates: "2.981566, 101.667885",
    },
  ];

  const renderLocationItem = ({ item }) => (
    <View style={styles.locationItem}>
      <Ionicons name="location-outline" size={24} color="#083A75" />
      <View style={styles.locationDetails}>
        <Text style={styles.locationTitle}>{item.title}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <Text style={styles.locationCoordinates}>{item.coordinates}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddLocationCoordinateScreen")}>
          <Ionicons name="locate-outline" size={24} color="#083A75" />
          <Text style={styles.actionText}>Use current location</Text>
        </TouchableOpacity>
      </View>

      {/* Registered Locations Section */}
      <Text style={styles.sectionHeader}>Pending registered location</Text>
      <FlatList
        data={registeredLocations}
        renderItem={renderLocationItem}
        keyExtractor={(item) => item.id}
        style={styles.locationList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  actionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    display: "flex",
    gap: 20
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 16,
    marginVertical: 5,
    marginHorizontal: 8
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
    color: "#666",
    marginBottom: 4,
  },
  locationCoordinates: {
    fontSize: 12,
    color: "#888",
  },
});

export default RegisterLocationScreen;
