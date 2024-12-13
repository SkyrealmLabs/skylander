import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import MapView, { Marker, UrlTile, Callout } from "react-native-maps";
import NavbarSearch from "../components/NavbarSearch";
import * as Location from "expo-location";
import axios from "axios"; // Import axios for HTTP requests

const AddLocationCoordinateScreen = ({ navigation }) => {
    const [region, setRegion] = useState({
        latitude: 3.0458,
        longitude: 101.7092,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [address, setAddress] = useState(""); // New state for the address

    const [searchText, setSearchText] = useState("");

    // Function to search location using OpenStreetMap's Nominatim API
    const searchLocation = async (query) => {
        if (!query.trim()) return;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
            );
            const results = await response.json();

            if (results.length > 0) {
                const { lat, lon } = results[0];
                setRegion({
                    ...region,
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon),
                });
                fetchAddress(parseFloat(lat), parseFloat(lon)); // Get address after setting location
            } else {
                alert("Location not found. Try a different search.");
            }
        } catch (error) {
            console.error("Error searching location:", error);
            alert("Failed to fetch location. Please check your internet connection.");
        }
    };

    // Function to get the user's current location and move the map
    const moveToCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            // fetchAddress(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.error("Error getting current location:", error);
            alert("Unable to fetch your current location. Please try again.");
        }
    };

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                {
                    headers: {
                        'User-Agent': 'SkyLander/1.0 (armansyazwan.as@gmail.com)' // Replace with your details
                    }
                }
            );
            const data = response.data;
            if (data && data.address) {
                setAddress(data.display_name || "Unknown Address");
            } else {
                setAddress("No address found");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Unable to fetch address");
        }
    };

    useEffect(() => {
        moveToCurrentLocation();
    }, []);

    const handleSubmit = () => {
        const roundedLatitude = parseFloat(region.latitude.toFixed(6));
        const roundedLongitude = parseFloat(region.longitude.toFixed(6));

        console.log("Latitude:", roundedLatitude);
        console.log("Longitude:", roundedLongitude);
        // alert(
        //     `Location saved!\nLatitude: ${roundedLatitude}\nLongitude: ${roundedLongitude}`
        // );

        navigation.navigate("AddLocationDetailsScreen", {
            latitude: roundedLatitude,
            longitude: roundedLongitude,
            address: address,
        });
    };

    return (
        <View style={styles.container}>
            {/* NavbarSearch replaces TextInput */}
            <NavbarSearch
                searchText={searchText}
                setSearchText={setSearchText}
                onMenuPress={() => console.log("Menu opened")}
                onNotificationPress={() => console.log("Notifications clicked")}
                navigation={navigation}
                onSubmitEditing={() => searchLocation(searchText)} // Add the search functionality
            />

            {/* Map View */}
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >
                <UrlTile
                    urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                />
                <Marker coordinate={region}>
                    <Image
                        source={require("../../assets/pin.png")} // Replace with your location icon
                        style={styles.marker}
                    />
                    {/* Add Callout for the marker */}
                    <Callout>
                        <Text>Please click the current location button to point to your location</Text>
                    </Callout>
                </Marker>
            </MapView>

            {/* Current Location Button */}
            <TouchableOpacity style={styles.currentLocationButton} onPress={moveToCurrentLocation}>
                <Image
                    source={require("../../assets/target.png")} // Replace with your icon
                    style={styles.currentLocationIcon}
                />
            </TouchableOpacity>

            {/* Latitude & Longitude Display */}
            <View style={styles.coordinatesContainer}>
                <View style={styles.row}>
                    <Text style={styles.label}>Latitude:</Text>
                    <Text style={styles.value}>
                        {region.latitude.toFixed(6)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Longitude:</Text>
                    <Text style={styles.value}>
                        {region.longitude.toFixed(6)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{address}</Text>
                </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Add this location</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    map: {
        flex: 1,
    },
    marker: {
        width: 48,
        height: 48,
    },
    currentLocationButton: {
        position: "absolute",
        bottom: 230,
        right: 20,
        backgroundColor: "#fff",
        borderRadius: 25,
        padding: 10,
        elevation: 5, // Add shadow for better visibility
    },
    currentLocationIcon: {
        width: 24,
        height: 24,
    },
    coordinatesContainer: {
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
        marginHorizontal: 15,
    },
    label: {
        fontWeight: "bold",
        color: "#555",
    },
    value: {
        color: "#333",
    },
    submitButton: {
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
    },
    calloutContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        elevation: 5, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignItems: "center",
    },
    calloutText: {
        color: "#333",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default AddLocationCoordinateScreen;
