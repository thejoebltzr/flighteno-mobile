import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TextBold from './atoms/TextBold';


const ButtonTraveller = ({ title, onPress, font, loader }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.buttonStyle}>

            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={['#E04E7C', '#E01E82']}
                style={[styles.buttonStyle, { width: '100%' }]}
            >

                {loader == false ?
                    <TextBold style={{ textAlign: "center",  fontSize: 16, color: "#fff" }}>{title}</TextBold>
                    :
                    <ActivityIndicator size="small" color="#fff" />
                }
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: "#25A9D1",
        height: 55,
        // width: '89%',
        width: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 35,
        elevation: 10
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: "#fff"
    },
})

export default ButtonTraveller;