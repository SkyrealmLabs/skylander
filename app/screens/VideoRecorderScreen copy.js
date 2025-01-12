import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, SafeAreaView, PermissionsAndroid } from 'react-native';
import Camera from 'expo-camera';
import Video from 'expo-av';
import shareAsync from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function VideoRecorderScreen({ navigation }) {
    const cameraRef = useRef(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [video, setVideo] = useState(null);

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMicrophonePermission(microphonePermission.status === "granted");
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
    }, []);

    if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
        return <Text>Requesting permission...</Text>;
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera is not granted.</Text>;
    }

    let startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            let options = {
                quality: "1080p",
                maxDuration: 60,
                mute: false
            };
            try {
                const recordedVideo = await cameraRef.current.recordAsync(options);
                setVideo(recordedVideo);
            } finally {
                setIsRecording(false);
            }
        }
    };

    let stopRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(false);
            cameraRef.current.stopRecording();
        }
    };

    if (video) {
        let shareVideo = () => {
            shareAsync(video.uri).then(() => {
                setVideo(undefined);
            });
        };

        let saveVideo = () => {
            if (!hasMediaLibraryPermission) {
                alert('Media library permissions are required to save the video.');
                return;
            }
            MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
                setVideo(undefined);
            });
        };

        return (
            <SafeAreaView style={styles.container}>
                <Video
                    style={styles.video}
                    source={{ uri: video.uri }}
                    useNativeControls
                    resizeMode='contain'
                    isLooping
                />
                <Button title='Share' onPress={() => shareVideo()} />
                {hasMediaLibraryPermission ? <Button title='Save' onPress={() => saveVideo()} /> : undefined}
                <Button title='Discard' onPress={() => setVideo(undefined)} />
            </SafeAreaView>
        );
    }

    return (
        <Camera style={styles.container} ref={cameraRef}>
            <View style={styles.buttonContainer}>
                <Button title={isRecording ? 'STOP' : 'START'} onPress={isRecording ? stopRecording : startRecording} />
            </View>
        </Camera>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    camera: {
        flex: 1,
    },
    video: {
        flex: 1,
        alignSelf: 'stretch'
    }
});
