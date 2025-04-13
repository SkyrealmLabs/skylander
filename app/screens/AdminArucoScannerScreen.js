import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function AdminArucoScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        {/* Dimmed overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scannerFrame}>
              {/* Corner Markers */}
              {/* Top Left */}
              <View style={[styles.corner, styles.topLeft, styles.horizontal]} />
              <View style={[styles.corner, styles.topLeft, styles.vertical]} />
              {/* Top Right */}
              <View style={[styles.corner, styles.topRight, styles.horizontal]} />
              <View style={[styles.corner, styles.topRight, styles.vertical]} />
              {/* Bottom Left */}
              <View style={[styles.corner, styles.bottomLeft, styles.horizontal]} />
              <View style={[styles.corner, styles.bottomLeft, styles.vertical]} />
              {/* Bottom Right */}
              <View style={[styles.corner, styles.bottomRight, styles.horizontal]} />
              <View style={[styles.corner, styles.bottomRight, styles.vertical]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>
      </CameraView>
    </View>
  );
}

const frameSize = 250;
const cornerLength = 40;
const cornerThickness = 4;

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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerFrame: {
    width: frameSize,
    height: frameSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    backgroundColor: 'lime',
  },
  horizontal: {
    width: cornerLength,
    height: cornerThickness,
  },
  vertical: {
    width: cornerThickness,
    height: cornerLength,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
});
