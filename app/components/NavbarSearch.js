import React from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NavbarSearch({ navigation, onMenuPress, onNotificationPress, searchText, setSearchText }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={28} color="black" />
      </TouchableOpacity>

      {/* TextInput filters the list */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)} // Update the parent state
      />

      {/* <TouchableOpacity onPress={onNotificationPress}>
        <Ionicons name="notifications-outline" size={28} color="black" />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: 90,
    backgroundColor: "#fff",
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBar: {
    flex: 1, // Take available space
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginHorizontal: 10,
    marginBottom: -5
  },
});
