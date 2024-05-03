import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions, CameraType, BarcodeScanningResult } from 'expo-camera/next';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Backup() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const barcodeReaderHeight = 200; // Ajustando a altura da CameraView

  function toggleCameraFacing() {
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCamera() {
    setCameraOpen(prevState => !prevState);
  }

  function handleCapture() {
    if (!capturing) {
      setCapturing(true);
    }
  }

  function isBarcodeInBounds(result: any, cameraHeight: number): boolean {
    const { cornerPoints, boundingBox } = result;
    if (!cornerPoints || !boundingBox) {
      return false;
    }

    const minY = Math.min(...cornerPoints.map((point: any) => point.y));
    const maxY = Math.max(...cornerPoints.map((point: any) => point.y));

    // Verificar se a parte superior e inferior do código de barras estão dentro da área visível da câmera
    return minY >= 0 && maxY <= cameraHeight;
  }

  function handleBarCodeScanned(result: BarcodeScanningResult) {
    if (capturing) {
      const { data } = result;

      // Verificar se o código de barras está dentro da área delimitada pela câmera
      if (isBarcodeInBounds(result, barcodeReaderHeight)) {
        console.log('Código de barras válido:', data);
        setLastScannedCode(data);
        setScannedCodes(prevCodes => [...prevCodes, data]);
      } else {
        console.log('Código de barras fora da área visível da câmera:', data);
      }

      setCapturing(false);
    }
  }




  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#0f172a' />
      {permission?.status === 'granted' && (
        <View>
          {cameraOpen && (
            <>
              <Text style={styles.text}>Escaneie o código de barras no leitor abaixo:</Text>
              <CameraView
                ref={cameraRef}
                accessible={true}
                facing={facing}
                style={{ height: barcodeReaderHeight, width: Dimensions.get('window').width }}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['upc_a'] }}
              >
                {/* Delimitador visual do leitor de código de barras */}
                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ borderWidth: 2, borderColor: '#0284c7', height: barcodeReaderHeight * 0.15, width: '80%', borderRadius: 5 }} />
                </View>
              </CameraView>
            </>
          )}
        </View>
      )}
      <View style={styles.buttonContainer}>
        {cameraOpen && (
          <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 8, borderRadius: 100, width: Dimensions.get('screen').width * .92 }} onPress={handleCapture}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>Capturar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={{ backgroundColor: cameraOpen ? '#B9B9B9' : '#0284c7', padding: 8, borderRadius: 100, marginTop: 10, width: Dimensions.get('screen').width * .92 }} onPress={toggleCamera}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>{cameraOpen ? 'Fechar Câmera' : 'Abrir Câmera'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.codeContainer}>
        <Text style={styles.text}>Último código escaneado: {lastScannedCode}</Text>
        <Text style={[styles.text, { padding: 20 }]}>Lista de Códigos escaneados: {scannedCodes.join(', ')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  codeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
