import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import NavbarBack from "../components/NavbarBack";
import { useNavigation } from "@react-navigation/native";

const AddLocationDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const [address, setAddress] = useState("");
    const [coordinate, setCoordinate] = useState("");

    useEffect(() => {
        const { latitude, longitude, address } = route.params || {};
        if (latitude && longitude) {
            setCoordinate(`${latitude}, ${longitude}`);
        }
        if (address) {
            setAddress(address);
        }
    }, [route.params]); // Dependency array ensures it runs when route.params changes

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log("Location details submitted!");
        console.log("Address:", address);
        console.log("Coordinates:", coordinate);
        // You can navigate to another screen or save data here
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <NavbarBack
                title="Add New Location"
                onMenuPress={() => console.log("Menu opened")}
                onNotificationPress={() => console.log("Notifications clicked")}
            />

            {/* Form Fields */}
            <View style={styles.form}>
                {/* Address */}
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("AddLocationCoordinateScreen")}>
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.placeholder}>{address || "Select Location"}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Coordinate */}
                <View style={styles.row}>
                    <Text style={styles.label}>Coordinate</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 2.981566, 101.667885"
                        placeholderTextColor="#ccc"
                        value={coordinate}
                        onChangeText={setCoordinate}
                    />
                </View>

                {/* Upload Photo/Video */}
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => navigation.navigate("VideoRecorderScreen")}
                >
                    <Text style={styles.label}>Record Video</Text>
                    <MaterialIcons name="videocam" size={20} color="#0056b3" />
                </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default AddLocationDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 8,
    },
    form: {
        flex: 1,
        marginTop: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 22,
        paddingVertical: 20,
        // borderRadius: 10,
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    placeholder: {
        fontSize: 16,
        color: "#ccc",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        textAlign: "right",
    },
    submitButton: {
        backgroundColor: "#0056b3",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
        marginHorizontal: 20,
    },
    submitButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});
