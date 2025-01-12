import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import NavbarBack from "../components/NavbarBack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../core/config";

const UPDATE_PROFILE_API = API_BASE_URL + "api/user/updateProfile";

const EditProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(true);

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
                const user = JSON.parse(userDataString);
                setUserData({
                    id: user.id,
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phoneno || "",
                });
            } else {
                navigation.navigate("LoginScreen"); // If no user data found, navigate to login
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(UPDATE_PROFILE_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                // Update AsyncStorage with new user data if update is successful
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                Alert.alert("Success", "Profile updated successfully");
                navigation.navigate("EditProfileScreen");
            } else {
                Alert.alert("Error", data.message || "Failed to update profile");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while updating your profile");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#083A75" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <NavbarBack
                title="Edit Profile"
                onMenuPress={() => console.log("Menu opened")}
                onNotificationPress={() => console.log("Notifications clicked")}
            />

            <View style={styles.content}>
                {/* Circle Profile Image */}
                <View style={styles.profileCircle}>
                    <Text style={styles.profileText}>
                        {userData.name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={userData.name}
                    onChangeText={(text) =>
                        setUserData({ ...userData, name: text })
                    }
                />

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={userData.email}
                    onChangeText={(text) =>
                        setUserData({ ...userData, email: text })
                    }
                    keyboardType="email-address"
                />

                {/* Phone Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={userData.phone}
                    onChangeText={(text) =>
                        setUserData({ ...userData, phone: text })
                    }
                    keyboardType="phone-pad"
                />

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: "center", // Center the profile circle horizontally
    },
    profileCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#0056b3",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    profileText: {
        color: "#fff",
        fontSize: 60,
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#0056b3",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EditProfileScreen;
