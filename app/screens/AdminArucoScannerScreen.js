import { Button, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AdminArucoScannerScreen() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const pickAndSendImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permissions are required!');
      return;
    }

    // Launch the system camera
    const pickedResult = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1,
    });

    if (!pickedResult.cancelled) {
      setUploading(true);
      console.log('Base64:', pickedResult.base64);

      try {
        const response = await fetch('http://192.168.0.6:5001/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: pickedResult.base64,
          }),
        });

        const text = await response.text();
        console.log('Response Text:', text);

        if (!response.ok) {
          throw new Error(`Server error ${response.status}: ${text}`);
        }

        const data = JSON.parse(text);
        setResult(data);
        alert(JSON.stringify(data));
      } catch (error) {
        console.error(error);
        setResult({ error: error.message });
      }

      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>

        {/* Capture Button */}
        <View style={styles.captureButtonContainer}>
          <View style={styles.captureOuterCircle}>
            <TouchableOpacity
              onPress={pickAndSendImage}
              style={[styles.captureInnerCircle, uploading && { opacity: 0.5 }]}
              disabled={uploading}
            />
          </View>
        </View>

        {/* Uploading Indicator */}
        {uploading && <ActivityIndicator size="large" color="lime" />}

        {/* Result Text */}
        {result && (
          <Text style={styles.resultText}>
            {result.error
              ? result.error
              : result.markers && result.markers.length > 0
                ? `Detected Markers: ${result.markers.join(', ')}`
                : 'No markers detected.'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  captureOuterCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
