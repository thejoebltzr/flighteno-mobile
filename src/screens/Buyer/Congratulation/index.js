import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Image, ScrollView, Dimensions, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../Utility/Styles';
import { useDispatch, useSelector } from 'react-redux';
import { color } from '../../../Utility/Color';
import ButtonLarge from '../../../components/ButtonLarge';
import QRCode from 'react-native-qrcode-svg';
import { formatAmount } from '../../../Utility/Utils';
import TextBold from '../../../components/atoms/TextBold';
import TextMedium from '../../../components/atoms/TextMedium';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

var windowWidth = Dimensions.get('window').width;

{/* Fix for FLIGHT-46 */}
export default function Congratulation({ route }) {

    const navigation = useNavigation();
    const { data } = route.params
    const { loading } = useSelector(({ authRed }) => authRed)
    const {t} = useTranslation()

    useEffect(() => {
        const backAction = () => {
            navigation.navigate("BottomTab", {screen: "Home"})
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <SafeAreaView style={{flex:1}}>

            <ScrollView  style={[styles.ScreenCss, {marginLeft:18, marginRight:18}]}>

                <TouchableOpacity onPress={() => navigation.navigate("BottomTab", {screen: "Home"})}>
                    <Image
                        style={styles.backImg}
                        resizeMode='stretch'
                        source={require('../../../images/back.png')}
                    />
                </TouchableOpacity>

                <View style={[styles.monoBarSplash, { justifyContent: 'center', marginLeft: '0%', marginTop: (windowWidth * 7) / 100 }]}>
                    <Image
                        style={styles.monoImg}
                        resizeMode='stretch'
                        source={require('../../../images/mono.png')}
                    />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 6) / 100, marginLeft: '0%', textAlign:'center' }]}>{t('travelHome.yourOrder')}
                    </TextBold>
                    <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 0) / 100, marginLeft: '0%', textAlign:'center' }]}>
                       {t('travelHome.hasBeenPlaced')}</TextBold>
                </View>

                <View style={{ alignSelf: "center", marginTop: 50, }}>
                    <QRCode
                        value={'data'}
                    />
                </View>

                <View style={styles.ordernumberStyle}>

                    <View style={styles.orderNumberIst}>
                        <TextBold style={[styles.loginInputHeading,{textAlign:'left'}]}>{t('track.orderNo')}.</TextBold>

                    </View>
                    <View style={styles.orderNumberSecond}>

                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {data.order_number}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={styles.billLeft}>
                        <TextBold style={[styles.loginInputHeading,{textAlign:'left'}]}>{t('track.orderPrice')}</TextBold>
                    </View>

                    <View style={styles.billRight}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(data.order_price)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading,{textAlign:'left'}]}>{t('track.estimatedDelFee')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(data.estimated_dilivery_fee)}
                        </TextMedium>
                    </View>

                </View>


                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.vipServFee')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(data.vip_service_fee)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>Flighteno {t('track.cost')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(data.flighteno_cost)}
                        </TextMedium>
                    </View>

                </View>


                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.tax')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(data.tax)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.textLarge,{textAlign:'left'}]}>{t('track.total')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.textLarge, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(data.Total)}
                        </TextMedium>
                    </View>

                </View>
                
                <TextMedium style={[styles.termText, { fontSize: 16, color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'center', marginTop: 70 }]}>
                    {t('travelHome.pleaseWaitTraveler')}.
                </TextMedium>



                <View style={{ marginBottom: 35, marginTop: 26 }}>
                    <ButtonLarge
                        title={t('buyerHome.placeNewOrder')}
                        loader={loading}
                        onPress={() => navigation.navigate("BottomTab", {screen: "Home"})}
                    />
                </View>


            </ScrollView>

        </SafeAreaView>
    );

}