import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { Camera, CameraType, BarCodeScanningResult } from 'expo-camera';
import DropDownPicker from 'react-native-dropdown-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [ignoredCodes, setIgnoredCodes] = useState<any[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [scannedData, setScannedData] = useState<{ cod: string, tipo: string } | null>(null); // Estado para armazenar o código e o tipo selecionado

  const { height } = Dimensions.get('window');
  const TOP_REGION_THRESHOLD = height * 0.3;

  const barcodeTypeMap = {
    [BarCodeScanner.Constants.BarCodeType.aztec]: 'AZTEC',
    [BarCodeScanner.Constants.BarCodeType.codabar]: 'CODABAR',
    [BarCodeScanner.Constants.BarCodeType.code39]: 'CODE39',
    [BarCodeScanner.Constants.BarCodeType.code93]: 'CODE93',
    [BarCodeScanner.Constants.BarCodeType.code128]: 'CODE128',
    [BarCodeScanner.Constants.BarCodeType.datamatrix]: 'DATAMATRIX',
    [BarCodeScanner.Constants.BarCodeType.ean13]: 'EAN13',
    [BarCodeScanner.Constants.BarCodeType.ean8]: 'EAN8',
    [BarCodeScanner.Constants.BarCodeType.itf]: 'ITF',
    [BarCodeScanner.Constants.BarCodeType.pdf417]: 'PDF417',
    [BarCodeScanner.Constants.BarCodeType.qr]: 'QR',
    [BarCodeScanner.Constants.BarCodeType.upc_a]: 'UPC_A',
    [BarCodeScanner.Constants.BarCodeType.upc_e]: 'UPC_E',
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'SN', value: 'sn' },
    { label: 'CAS', value: 'cas' },
    { label: 'SCUA', value: 'scua' }
  ]);

  useEffect(() => {
    //console.log(scannedData)
  }, [scannedData])

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
    //pega todos os códigos;
    const el:any = ignoredCodes.some((ignored) => {
      return ignored.data === result.data
    })

    if(!el){
      setIgnoredCodes(ignoredCodes => [...ignoredCodes, result]);
    }

    setTimeout(() => {
      setCapturing(false)
    }, 1000)

    console.log(JSON.stringify(ignoredCodes, null, 2))
    return;
    //teste
    // const bounds: any = result;
    // const type: any = result.type;
    // const barcodeType = barcodeTypeMap[type] || `Unknown type (${type})`;

    // if (ignoredCodes.includes(bounds.data)) {
    //   Alert.alert('atenção', 'há um código inválido na tela.')
    //   return;
    // }

    // if (barcodeType == "EAN13") {
    //   setCapturing(false);
    //   setIgnoredCodes(prevIgnoredCodes => [...prevIgnoredCodes, bounds.data]);
    //   console.log('isEAN')
    //   return
    // }

    // console.log('ignoredCodes', ignoredCodes);

    // if (bounds?.boundingBox?.origin?.y > TOP_REGION_THRESHOLD) {
    //   console.log('y-false', bounds?.boundingBox?.origin?.y)
    //   console.log('false')
    // } else {
    //   console.log('y-true', bounds?.boundingBox?.origin?.y)
    //   console.log('true', result.data)
    // }
    // setCapturing(false);
    // return;

    // const topLeftY = bounds.cornerPoints[0].y;
    // const topRightY = bounds.cornerPoints[1].y;
    // const bottomLeftY = bounds.cornerPoints[2].y;
    // const bottomRightY = bounds.cornerPoints[3].y;
    // const isTopRegion = (topLeftY < TOP_REGION_THRESHOLD && topRightY < TOP_REGION_THRESHOLD && bottomLeftY < TOP_REGION_THRESHOLD && bottomRightY < TOP_REGION_THRESHOLD);

    // if (isTopRegion) {
    //   console.log('isTopRegion', bounds.data)
    // }
    // setCapturing(false);
    // return;


    // const barcodeType = barcodeTypeMap[type] || `Unknown type (${type})`;
    // console.log(JSON.stringify({ barcodeType, data }, null, 2))

    // if (barcodeType == "EAN13") {
    //   Alert.alert('atencao', '')
    //   setCapturing(false);
    //   return
    // }
    // setCapturing(false);

    //setScannedData({ cod: result.data, tipo: '' }); // Inicializa o tipo como vazio
    //setCapturing(false); // Parar a captura
  }

  function saveCodeBarType() {
    setScannedData((prevData: any) => ({
      ...prevData,
      tipo: value
    }));
  }

  return (
    <View style={{ flex: 1 }}>
      {permission?.status === 'granted' && (
        <View style={{ flex: 1 }}>
          {cameraOpen ? (
            <View style={{ flex: 1, paddingVertical: 40, paddingHorizontal: 30, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'center' }}>
              <Camera
                style={styles.camera}
                type={type}
                onBarCodeScanned={(result) => capturing ? handleBarCodeScanned(result) : null}
              >
                <View style={styles.overlay}></View>
                {/* <View style={styles.box}></View> */}
              </Camera>
              <View style={{
                position: 'absolute',
                top: Dimensions.get('screen').height * .27,
                flex: 1,
                width: Dimensions.get('screen').width,
                paddingHorizontal: 5
              }}>
                {scannedData && (
                  <View style={{ paddingVertical: 10 }}>
                    <Text style={{ paddingBottom: 20, textAlign: 'left', fontSize: 16, fontWeight: 'bold' }}>Código Escaneado: {scannedData?.cod} - {(scannedData?.tipo).toLocaleUpperCase()}</Text>
                    <DropDownPicker
                      open={open}
                      value={value}
                      items={items}
                      placeholder='Selecione o Tipo do Código'
                      setOpen={setOpen}
                      setValue={setValue}
                      setItems={setItems}
                      autoScroll={true}
                      theme="LIGHT"
                      mode="BADGE"
                      badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#0CB685',
                        marginTop: 30,
                        width: '100%',
                        flex: 1,
                        padding: 8,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={saveCodeBarType}
                    >
                      <Text style={{ color: 'white' }}>{'Salvar Código'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={{ width: 'auto', flexDirection: 'column', gap: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#0284c7',
                      width: '100%',
                      flex: 1,
                      padding: 8,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={toggleCamera}
                  >
                    <Text style={{ color: 'white' }}>{cameraOpen ? 'Fechar Câmera' : 'Abrir Câmera'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#0284c7',
                      width: '100%',
                      flex: 1,
                      padding: 8,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => setCapturing(true)}
                  >
                    <Text style={{ color: 'white' }}>{'Capturar Código'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, paddingVertical: 40, paddingHorizontal: 30, backgroundColor: '#D8FF97', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#0284c7',
                  width: '100%',
                  padding: 8,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={toggleCamera}
              >
                <Text style={{ color: 'white' }}>{cameraOpen ? 'Fechar Câmera' : 'Abrir Câmera'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                backgroundColor: '#0284c7',
                width: '100%',
                padding: 8,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }} onPress={() => { console.log(JSON.stringify(ignoredCodes, null, 2)) }}>
                <Text style={{ color: '#fff' }}>Exibir Valores</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View >
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
    top: Dimensions.get('screen').height * .3,
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
    left: -30,
    right: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'relative',
    backgroundColor: '#fff'
    //aspectRatio: '3/5'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: Dimensions.get('screen').height * .45,
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
  // Estilos para o modal
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -Dimensions.get('screen').width * 0.5 }, { translateY: -Dimensions.get('screen').height * 0.5 }]
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18
  }
});
