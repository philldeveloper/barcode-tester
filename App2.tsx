import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera, CameraType, BarCodeScanningResult } from 'expo-camera';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCamera() {
    setCameraOpen(prevState => !prevState);
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function handleBarCodeScanned(result: BarCodeScanningResult) {
    console.log(result.data)
    //parar a captura
    setCapturing(false);
  }

  return (
    <View style={styles.container}>
      {permission?.status === 'granted' && (
        <View>
          {cameraOpen && (
            <View style={styles.cameraContainer}>
              <View style={{ alignItems: 'center', gap: 10}}>
                <Text style={{ fontWeight: 'bold', color: '#000', textAlign: 'center', fontSize: 20 }}>{'Capturar Código de Barras'}</Text>
                <Text style={{ color: '#000', fontSize: 14, textAlign: 'center', maxWidth: '90%' }}>{'Coloque o código de barras no local exato indicado pela área delimitada.'}</Text>
              </View>
              <Camera style={styles.camera} type={type} onBarCodeScanned={(result) => capturing ? handleBarCodeScanned(result) : null}>
                <View style={styles.overlay}></View>
                <View style={styles.box}></View>
              </Camera>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={toggleCamera}>
                  <Text style={styles.buttonText}>{cameraOpen ? 'Fechar Câmera' : 'Abrir Câmera'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setCapturing(true)}>
                  <Text style={styles.buttonText}>{'Capturar Código'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {!cameraOpen && (
            <TouchableOpacity style={styles.button} onPress={toggleCamera}>
              <Text style={styles.buttonText}>{cameraOpen ? 'Fechar Câmera' : 'Abrir Câmera'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#B2EA56',
    borderRadius: 5,
    height: .1,
    width: Dimensions.get('screen').width * .9,
    left: Dimensions.get('screen').width * .2,
    right: Dimensions.get('screen').width * .2,
    top: Dimensions.get('screen').height * .175,
    transform: [{ translateX: -(Dimensions.get('window').width * 0.15) }, { translateY: -(Dimensions.get('window').height * 0.15) }]
  },
  box: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 300,
    width: Dimensions.get('screen').width,
    left: Dimensions.get('screen').width * .15,
    right: 0,
    top: Dimensions.get('screen').height * .22,
    transform: [{ translateX: -(Dimensions.get('window').width * 0.15) }, { translateY: -(Dimensions.get('window').height * 0.15) }]
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    gap: 20
  },
  camera: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * .4,
    position: 'relative',
    backgroundColor: '#fff'
    //aspectRatio: '3/5'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    //marginVertical: 10,
    position: 'absolute',
    top: Dimensions.get('screen').height * .45
  },
  button: {
    backgroundColor: '#0284c7',
    minWidth: Dimensions.get('screen').width * .4,
    maxWidth: Dimensions.get('screen').width * .8,
    padding: 8,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff'
  },
});
