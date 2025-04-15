import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function AdminArucoScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const captureAndSend = async () => {
    if (cameraRef.current) {
      setUploading(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      console.lig(photo)
      try {
        const response = await fetch('http://192.168.0.7:5001/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: photo.base64
          }),
        });

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error(error);
        setResult({ error: 'Failed to connect to server.' });
      }

      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        <View style={styles.captureButtonContainer}>
          <View style={styles.captureOuterCircle}>
            <TouchableOpacity onPress={captureAndSend} style={styles.captureInnerCircle} />
          </View>
        </View>
        {uploading && <ActivityIndicator size="large" color="lime" />}
        {result && (
          <Text style={styles.resultText}>
            {result.error ? result.error : `Detected Markers: ${result.markers.join(', ')}`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  resultText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
  captureButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
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
