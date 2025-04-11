import React, { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import NavbarBack from "../components/NavbarBack";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { API_BASE_URL } from "../core/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { CameraView, useCameraPermissions } from 'expo-camera';

const GET_LOCATION_DETAIL_BY_ID_API_URL = API_BASE_URL + "api/location/getLocationDetailsById";

const AdminLocationDetailsScreen = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationsDetails, setLocationsDetails] = useState(null);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [arucoModalVisible, setArucoModalVisible] = useState(false);
    const [arucoId, setArucoId] = useState("");
    const route = useRoute();
    const { locationID } = route.params;
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {

        const fetchUserDataAndLocations = async () => {
            try {
                const userDataString = await AsyncStorage.getItem("user");
                if (!userDataString) {
                    navigation.navigate("LoginScreen");
                    return;
                }

                const user = JSON.parse(userDataString);
                setUserData(user);

                const response = await fetch(GET_LOCATION_DETAIL_BY_ID_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ID: locationID }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch location details");
                }

                const data = await response.json();
                if (data.data.length > 0) {
                    const details = data.data[0]; // Only take the first entry
                    setLocationsDetails({
                        id: details.id.toString(),
                        address: details.locationAddress,
                        enrolledBy: details.name,
                        email: details.email,
                        coordinate: `${details.latitude}, ${details.longitude}`,
                        status: details.status,
                        userid: details.userid,
                        mediaFileName: details.mediaFileName,
                        mediaPath: API_BASE_URL + "uploads/" + details.mediaFileName,
                        arucoId: details.aruco_id,
                    });
                } else {
                    Alert.alert("Error", "Location not found");
                    navigation.goBack();
                }
            } catch (error) {
                Alert.alert("Error", "An error occurred while fetching locations");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndLocations();
    }, [navigation, locationID]);


    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!locationsDetails) {
        return (
            <View style={styles.container}>
                <Text>No location details found.</Text>
            </View>
        );
    }

    const takePhoto = () => {
        console.log(permission)
        if (!permission.granted) {
            return <View />;
        }

        if (!permission.granted) {
            return (
                <View style={styles.container}>
                    <Text style={styles.message}>We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} title="grant permission" />
                </View>
            );
        } else {

            return (
                <View style={styles.container}>
                    <CameraView style={styles.camera} facing="back" />
                </View>
            );

        }

    }

    return (
        <View style={styles.container}>
            <NavbarBack title="Location Details" />

            <View style={styles.content}>
                {/* Video Player */}
                <View style={styles.videoContainer}>
                    {locationsDetails.mediaPath ? (
                        <Video
                            source={{ uri: locationsDetails.mediaPath }}
                            style={styles.videoPlayer}
                            resizeMode="cover"
                            isMuted
                            shouldPlay
                            useNativeControls
                        />
                    ) : (
                        <Text>No video available</Text>
                    )}
                </View>

                {/* Location Details */}
                <View style={styles.detailsContainer}>
                    <View>
                        <Text style={styles.label}>Location Address</Text>
                        <Text style={styles.value}>{locationsDetails.address}</Text>
                    </View>

                    <View>
                        <Text style={styles.label}>Enrolled by</Text>
                        <Text style={styles.value}>{locationsDetails.enrolledBy}</Text>
                    </View>

                    <View>
                        <Text style={styles.label}>Person email</Text>
                        <Text style={styles.value}>{locationsDetails.email}</Text>
                    </View>

                    <View>
                        <Text style={styles.label}>Location Coordinate</Text>
                        <Text style={styles.value}>{locationsDetails.coordinate}</Text>
                    </View>

                    <View>
                        <Text style={styles.label}>Aruco ID</Text>
                        <Text style={styles.value}>{locationsDetails.arucoId ? locationsDetails.arucoId : "Not Stated"}</Text>
                    </View>
                </View>
            </View>

            {/* Review Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.reviewButton} onPress={() => setReviewModalVisible(true)}>
                    <Text style={styles.reviewText}>Review</Text>
                </TouchableOpacity>
            </View>

            {/* Review Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={reviewModalVisible}
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>What action would you like to take?</Text>
                        <Text style={styles.modalSubtitle}>You can approve, reject, or cancel this enrollment.</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.approveButton]}
                                onPress={() => {
                                    setReviewModalVisible(false);
                                    setArucoModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Approve</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => setReviewModalVisible(false)}>
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setReviewModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Aruco ID Input Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={arucoModalVisible}
                onRequestClose={() => setArucoModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Aruco ID</Text>

                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Aruco ID"
                                keyboardType="numeric"
                                value={arucoId}
                                onChangeText={setArucoId}
                            />


                            <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
                                <Ionicons name="camera" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={() => setArucoModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setArucoModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminLocationDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        // flex: 1, // Allows content to expand and push button to bottom
        justifyContent: "space-between",
    },
    videoContainer: {
        height: 250,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center"
    },
    videoPlayer: {
        width: "100%",
        height: "100%",
    },
    detailsContainer: {
        padding: 16,
        gap: 15
    },
    label: {
        fontSize: 16,
        color: "#888",
        marginTop: 8,
    },
    value: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    buttonContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff", // Ensures it's visible on light backgrounds
        marginTop: 50
    },
    reviewButton: {
        backgroundColor: "#0056b3",
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
        width: "100%",
    },
    reviewText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
    },
    modalContent: {
        width: 320,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalIcon: {
        fontSize: 40,
        color: "#777",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        marginVertical: 10,
    },
    input: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 15,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 5,
    },
    approveButton: {
        backgroundColor: "#007bff",
    },
    rejectButton: {
        backgroundColor: "#dc3545",
    },
    cancelButton: {
        backgroundColor: "#6c757d",
    },
    submitButton: {
        backgroundColor: "#28a745",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 16,
    },

    iconButton: {
        paddingLeft: 10,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
});

