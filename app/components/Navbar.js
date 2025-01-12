import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function Navbar({ onMenuPress, onNotificationPress, title, onOutsidePress }) {
    const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
    const navigation = useNavigation();

    const toggleProfileMenu = () => {
        setIsProfileMenuVisible(!isProfileMenuVisible);
    };

    const hideProfileMenu = () => {
        setIsProfileMenuVisible(false);
    };

    useEffect(() => {
        if (onOutsidePress) {
            onOutsidePress(hideProfileMenu);
        }
    }, [onOutsidePress]);

    const handleLogout = async () => {
        try {
            // Clear user-related data from AsyncStorage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
            console.log(AsyncStorage)

            // Optionally, clear other data if needed, for example:
            // await AsyncStorage.clear();

            console.log("User logged out");

            // Redirect to login screen after logout
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleEditProfile = async () => {
        navigation.navigate('EditProfileScreen');
    }

    return (
        <View style={styles.navbar}>
            {/* <TouchableOpacity onPress={onMenuPress}>
                <Ionicons name="menu-outline" size={28} color="black" />
            </TouchableOpacity> */}
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={toggleProfileMenu}>
                <Ionicons name="person-outline" size={24} color="black" />
            </TouchableOpacity>

            {isProfileMenuVisible && (
                <View style={styles.profileMenu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => {  navigation.navigate('EditProfileScreen'); }}>
                        <Text style={styles.menuText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { handleLogout(); }}>
                        <Text style={styles.menuText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 15,
        height: 100,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0056b3",
        // textAlign: "center",
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        // paddingBottom: 3,
    },
    profileMenu: {
        position: "absolute",
        top: 100, // Position the menu below the profile icon
        right: 20,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: 150, // Set the width of the menu
        elevation: 2, // For Android shadow
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuText: {
        fontSize: 16,
        color: "#333",
    },
});
