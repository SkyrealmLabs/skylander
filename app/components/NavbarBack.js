import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function NavbarBack({ title }) {
    const navigation = useNavigation();
    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={28} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            {/* <TouchableOpacity onPress={onNotificationPress}>
                <Ionicons name="notifications-outline" size={28} color="black" />
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        justifyContent: "space-between", // Space between icons
        alignItems: "flex-end", // Moves icons to the bottom
        paddingHorizontal: 20,
        paddingBottom: 15,
        height: 80, // Adjust height as needed
        backgroundColor: "#fff",
        elevation: 2, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        flex: 1, // Allow the title to expand and take available space
        marginLeft: 10, // Prevent overlap with the left icon
        marginRight: 10, // Prevent overlap with the right icon
        paddingBottom: 3
    },
});
