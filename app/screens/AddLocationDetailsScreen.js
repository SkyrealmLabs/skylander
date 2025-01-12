import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import NavbarBack from "../components/NavbarBack";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { RECAPTCHA_SECRET_KEY, RECAPTCHA_SITE_KEY, API_BASE_URL } from "../core/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppIntroSlider from "react-native-app-intro-slider";

const ADD_LOCATION_API_URL = API_BASE_URL + "api/location/add";
const VERIFY_RECAPTCHA_API_URL = API_BASE_URL + "api/verify-recaptcha";

const AddLocationDetailsScreen = ({ route }) => {
    const navigation = useNavigation();
    const [address, setAddress] = useState("");
    const [coordinate, setCoordinate] = useState("");
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showSlider, setShowSlider] = useState(false);

    // Slides for the intro slider
    const slides = [
        {
            key: '1',
            title: 'WELCOME TO VIDEO RECORDING TUTORIAL',
            text: 'This tutorial will guide you through the steps.',
            image: require('../../assets/adaptive-icon.png'), // Use your own image path
            backgroundColor: '#59b2ab',
        },
        {
            key: '2',
            title: 'Step 1: Find the open space area',
            text: 'You need to find an open space with a 3-meter radius and 3 meters of vertical clearance.',
            image: require('../../assets/open_space.png'), // Use your own image path
            backgroundColor: '#febe29',
        },
        {
            key: '3',
            title: 'Step 2: Record Video 360 Degree View',
            text: 'Start your video recording and capture a 360-degree view of the surrounding area.',
            image: require('../../assets/phone_360_rotate.png'), // Use your own image path
            backgroundColor: '#febe29',
        },
        {
            key: '4',
            title: 'Step 3: Record Video Vertical View',
            text: 'Then, capture a vertical view that extends up to 3 meters upward.',
            image: require('../../assets/phone_tilt_upward.png'), // Use your own image path
            backgroundColor: '#22bcb5',
        }
    ];

    const renderSlide = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.slideImage} />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideText}>{item.text}</Text>
            </View>
        );
    };

    // Fetch user data from AsyncStorage
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem("user");
                if (userDataString) {
                    const user = JSON.parse(userDataString);
                    setUserData(user);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Set address and coordinates from route params
    useEffect(() => {
        const { latitude, longitude, address } = route.params || {};
        if (latitude && longitude) {
            setCoordinate(`${latitude}, ${longitude}`);
        }
        if (address) {
            setAddress(address);
        }
    }, [route.params]);

    const handleSubmitLocation = async () => {
        if (!address || !coordinate || !media) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        setLoading(true);

        const [latitude, longitude] = coordinate.split(',').map(coord => parseFloat(coord.trim()));
        const roundedLatitude = latitude.toFixed(6);
        const roundedLongitude = longitude.toFixed(6);

        const fileExtension = media.split('.').pop().toLowerCase();
        const mimeType = fileExtension === 'mov' ? 'mov' : 'video/mp4';

        const formData = new FormData();
        formData.append('userID', userData.id); // Assuming userData contains user ID
        formData.append('address', address);
        formData.append('coordinate', JSON.stringify({
            latitude: roundedLatitude,
            longitude: roundedLongitude
        }));
        formData.append('media', {
            uri: media,
            type: mimeType,
            name: `location-video.${fileExtension}`
        });

        try {
            const response = await fetch(ADD_LOCATION_API_URL, {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
                body: formData,
            });

            const result = await response.json(); // Parse the JSON response

            if (response.status === 201) {
                Alert.alert('Success', result.message);
                navigation.navigate("RegisterLocationScreen");
            } else {
                Alert.alert('Error', result.message || 'Failed to submit location');
            }
        } catch (error) {
            console.error('Error submitting location:', error);
            Alert.alert('Error', 'Failed to submit location');
        } finally {
            setLoading(false);
        }
    };


    const onRecaptchaError = () => {
        Alert.alert("Verification Failed", "Please complete the reCAPTCHA.");
    };

    const handleTakeVideoPress = () => {
        setShowSlider(true); // Show the intro slider before opening the camera
    };

    const onDone = () => {
        openCamera(); // Proceed to open the camera after slider tutorial
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission required",
                "Camera permission is required to use this feature."
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: "videos",
            allowsEditing: true,
            quality: 1,
        });

        setShowSlider(false); // Hide the slider after tutorial

        if (!result.canceled) {
            setMedia(result.assets[0].uri);
        }

    };

    const deleteMedia = () => {
        setMedia(null);
    };

    const videoSource = useMemo(() => (media ? { uri: media } : null), [media]);

    return (
        <View style={styles.container}>
            <NavbarBack
                title="Add New Location"
                onMenuPress={() => console.log("Menu opened")}
                onNotificationPress={() => console.log("Notifications clicked")}
            />

            <View style={styles.form}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                        navigation.navigate("AddLocationCoordinateScreen")
                    }
                >
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.placeholder}>
                        {address || "Select Location"}
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#ccc"
                    />
                </TouchableOpacity>

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

                <TouchableOpacity style={styles.row} onPress={handleTakeVideoPress}>
                    <Text style={styles.label}>Record Video</Text>
                    <MaterialIcons
                        name="videocam"
                        size={20}
                        color="#0056b3"
                    />
                </TouchableOpacity>
                <Modal visible={showSlider} animationType="slide" transparent={false}>
                    <View style={styles.modalContainer}>
                        <AppIntroSlider
                            renderItem={renderSlide}
                            data={slides}
                            onDone={onDone}
                            showSkipButton
                            onSkip={onDone} // Skip will behave like done
                        />
                    </View>
                </Modal>

                {media && (
                    <View style={styles.uploadedMediaContainer}>
                        <View style={styles.uploadedMedia}>
                            <Video
                                source={videoSource}
                                style={styles.uploadedVideo}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={deleteMedia}
                        >
                            <MaterialIcons
                                name="delete"
                                size={20}
                                color="#fc2c03"
                            />
                            <Text style={styles.deleteButtonText}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitLocation}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? "Submitting..." : "Submit"}
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default AddLocationDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
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
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    placeholder: {
        fontSize: 16,
        color: "#000",
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
    uploadedMediaContainer: {
        alignItems: "center",
    },
    uploadedMedia: {
        width: "100%",
        height: 50,
        borderRadius: 8,
    },
    uploadedVideo: {
        height: 300,
        borderRadius: 8,
        margin: 10,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 280,
    },
    deleteButtonText: {
        color: "#fc2c03",
        marginLeft: 5,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#0e0259",
    },
    slideImage: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    slideTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    slideText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
});
