import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {RNCamera, FaceDetector} from 'react-native-camera';
import StepsIndicator from '../../../components/StepsIndicator';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { styles } from './styles';


export default function KYCIDVerificationCameraScreen(){

    const cameraRef = useRef()
    const [canDetectFaces,setCanDetectFaces] = useState(false)

    const facesDetected = ({faces}) => {
        const rightEye = faces[0].rightEyeOpenProbability;
        const leftEye = faces[0].leftEyeOpenProbability;
        const smileprob = faces[0].smilingProbability;
        const bothEyes = (rightEye + leftEye) / 2;

        // if(bothEyes <= 0.3){
        //     console.log('blink detected')
        // }

        
        console.log(faces)
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.titleTxt}>Selfie Verification</Text>

                <View  style={styles.stepsIndicator}>
                    <StepsIndicator currentPosition={2}/>
                </View>

                <View style={styles.scanContainer}>
                    <Text style={styles.scanTxt}>Scan your face</Text>
                    <Text style={styles.blinkTxt}>Please Blink</Text>

                    <View style={styles.cameraView}>
                        <AnimatedCircularProgress
                            size={313}
                            width={6}
                            fill={70}
                            tintColor="#F2BA39"
                            backgroundColor="#CDCDCD"
                            >
                            {
                                (fill) => (       
                                    <RNCamera 
                                    ref={cameraRef}
                                        style={styles.camera} 
                                        captureAudio={false}
                                        androidCameraPermissionOptions={{
                                            title: 'Permission to use camera',
                                            message: 'We need your permission to use your camera',
                                            buttonPositive: 'Ok',
                                            buttonNegative: 'Cancel',
                                        }}
                                        type='front'
                                        faceDetectionClassifications={
                                            RNCamera.Constants.FaceDetection.Classifications.all
                                            ? RNCamera.Constants.FaceDetection.Classifications.all
                                            : undefined
                                        }
                                        onCameraReady={() => {
                                            console.log('camera ready')
                                            // setCanDetectFaces(true)
                                        }}
                                        // onFacesDetected={canDetectFaces ? facesDetected : null}
                                        onFacesDetected={({faces}) => {
                                            
                                            // if(canDetectFaces){
                                            //     console.log('detected')
                                            // }
                                        }}
                                       
                                        onFaceDetectionError={error => console.log('FDError', error)}
                                    />
                                )
                            }
                        </AnimatedCircularProgress> 
                    </View>
                   
                   
                </View>
               
            </View>

        </ScrollView>
    )
}