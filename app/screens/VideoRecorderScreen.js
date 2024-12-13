import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VideoRecorderScreen() {
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null); // To store the recorded video

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleStartRecording = async () => {
        if (!isRecording) {
            try {
                setIsRecording(true);
                const { uri } = await cameraRef.current.recordAsync();
                setRecording(uri);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleStopRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            const video = await cameraRef.current.stopRecording();
            // You can handle the recorded video here (e.g., save to device storage, upload)
            console.log('Recorded video:', video.uri);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera} // Change to CameraType.front for front camera
            >
                {isRecording ? (
                    <TouchableOpacity style={styles.recordButton} onPress={handleStopRecording}>
                        <Text style={styles.recordButtonText}>Stop Recording</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.recordButton} onPress={handleStartRecording}>
                        <Text style={styles.recordButtonText}>Record Video</Text>
                    </TouchableOpacity>
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    recordButton: {
        position: 'absolute',
        bottom: 32,
        alignSelf: 'center', // Center the button horizontally
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 100,
    },
    recordButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

