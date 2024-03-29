import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, TouchableHighlight } from 'react-native';
import { color } from '../../Utility/Color';
import { styles } from '../../Utility/Styles';
import ButtonTraveller from '../../components/ButtonTraveller';
import { useSelector } from 'react-redux'
import ButtonDisable from '../../components/ButtonDisable';
import ButtonVerifyT from '../../components/ButtonVerifyT';
// import BottomTab from '../../components/BottomTab';
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { formatAmount } from '../../Utility/Utils';
import ViewImages from '../../components/ViewImages';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import TextBold from '../../components/atoms/TextBold';
import TextRegular from '../../components/atoms/TextRegular';
import TextMedium from '../../components/atoms/TextMedium';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageView from "react-native-image-viewing";


var windowWidth = Dimensions.get('window').width;

export default function OrderDetailT({ route }) {
    const { orderDetail } = route.params
    const { loading, currentUser } = useSelector(({ authRed }) => authRed)
    const navigation = useNavigation()
    const [offerSent, setOfferSent] = useState("")
    const [showImageView, setShowImageView] = useState(false)
    const [imageVisible, setImageVisible] = useState(false)
    const [images, setImages] = useState([])
    const {t} = useTranslation()


    function check(id) {
        return id == currentUser._id
    }

    useEffect(() => {
        if (orderDetail.offer_sender_account_ids) {
            setOfferSent(orderDetail.offer_sender_account_ids.find(check))
        }
    }, [])

    const showGallery = (data) => {
        images.length = 0
        images.push({ url: data })
        setShowImageView(true)
    }

    const selectID = (id) => {
        Clipboard.setString(id)
        Toast.show({
            type: 'success',
            text2: "Copied to clipboard",
        })
    }
    return (
        <SafeAreaView style={{flex:1, marginLeft:18, marginRight:18}} >
    <View style={{ flex: 1, backgroundColor: color.backgroundColor }}>
            <ViewImages
                showImageViewer={showImageView}
                images={images}
                closeModal={() => setShowImageView(false)}
            />
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.backImg}
                        resizeMode='stretch'
                        source={require('../../images/back.png')}
                    />
                </TouchableOpacity>
                <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 4) / 100,  textAlign:'left' }]}>{t('track.orderDetails')}</TextBold>
                <View style={Styles.listView}>
                    <View style={Styles.upperView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {orderDetail.profile_data[0].profile_image ?
                                <Image source={{ uri: orderDetail.profile_data[0].profile_image }}
                                    style={Styles.userImage}
                                />
                                :
                                <Image source={require("../../images/manProfile.png")}
                                    style={Styles.userImage}
                                />
                            }
                            <View style={{ flex: 1, flexGrow: 1 }}>
                                <TextBold style={Styles.userName}>{orderDetail.profile_data[0].full_name}</TextBold>
                            </View>
                            <View style={Styles.dateView}>
                                <TextBold style={Styles.dateText}>{moment(orderDetail.preferred_date.$date.$numberLong, 'x').format("MMM DD, YYYY")}</TextBold>
                            </View>
                        </View>
                        <View style={[styles.travelerListInnerView, { paddingLeft: 0, paddingRight: 0, marginTop: 5 }]}>
                            <View>
                                <TextBold style={[styles.travelListTitle, { color: color.travelerButtonColor, textAlign:'left' }]}>{t('travelHome.from')}</TextBold>
                                <TextBold style={[styles.travelListValue, { color: 'black', textAlign:'left' }]}>{orderDetail.product_buy_city_name}</TextBold>
                                <TextRegular style={[styles.travelListTitle, { color: 'black', textAlign:'left' }]}>{orderDetail.product_buy_country_name}</TextRegular>
                            </View>
                            <Image source={require("../../images/travel1.png")}
                                resizeMode="contain"
                                style={{ height: 60, width: 60 }}
                            />
                            <View>
                                <TextBold style={[styles.travelListTitle, { color: color.travelerButtonColor, textAlign:'left' }]}>{t('travelHome.to')}</TextBold>
                                <TextBold style={[styles.travelListValue, { color: 'black', textAlign:'left' }]}>{orderDetail.product_dilivery_city_name}</TextBold>
                                <TextRegular style={[styles.travelListTitle, { color: 'black', textAlign:'left' }]}>{orderDetail.product_dilivery_country_name}</TextRegular>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: 'gray' }} />

                    <View style={Styles.bottomView}>
                        <TouchableHighlight underlayColor="transparent" onPress={() => setImageVisible(true)}>
                            <Image source={{ uri: orderDetail.product_image }}
                                style={Styles.productImage}
                            />
                        </TouchableHighlight>
                        <TextBold style={[Styles.userName, { marginLeft: 0, marginTop: 10 }]}>{orderDetail.product_discription}</TextBold>
                        <TextMedium style={Styles.priceText}>
                            {formatAmount(parseInt(orderDetail.product_price) + parseInt(orderDetail.tax) + parseInt(orderDetail.vip_service_fee) + parseInt(Math.round((orderDetail.product_price / 100) * 7)) + parseInt(Math.round((orderDetail.product_price / 100) * 10) < 50 ? 50 : Math.round((orderDetail.product_price / 100) * 10)))}
                        </TextMedium>
                        <View style={{ height: 20 }} />
                        <View style={Styles.propertView}>
                            <TextBold style={[Styles.userName, { marginLeft: 0, minWidth: '24%', marginRight: 5, textAlign:'left' }]}>{t('buyerHome.color')}</TextBold>
                            <TextRegular style={Styles.priceText}>Black/gray</TextRegular>
                        </View>
                        <View style={Styles.propertView}>
                            <TextBold style={[Styles.userName, { marginLeft: 0, minWidth: '24%', marginRight: 5, textAlign:'left' }]}>{t('buyerHome.weight')}</TextBold>
                            <TextRegular style={Styles.priceText}>{orderDetail.product_weight} Kg</TextRegular>
                        </View>
                        <View style={Styles.propertView}>
                            <TextBold style={[Styles.userName, { marginLeft: 0, minWidth: '24%', marginRight: 5, textAlign:'left' }]}>{t('buyerHome.quantity')}</TextBold>
                            <TextRegular style={Styles.priceText}>{orderDetail.quantity}</TextRegular>
                        </View>
                        <View style={Styles.propertView}>
                            <TextBold style={[Styles.userName, { marginLeft: 0, color: 'black', minWidth: '24%', marginRight: 5, textAlign:'left' }]}>{t('track.estimatedDelFee')}</TextBold>
                            <TextRegular style={Styles.priceText}>
                                {formatAmount(Math.round((orderDetail.product_price / 100) * 10) < 50 ? 50 : Math.round((orderDetail.product_price / 100) * 10))}
                            </TextRegular>
                        </View>
                        {orderDetail.open_box_check_phisical_apperance || orderDetail.use_item_for_testing ?
                            <TextRegular style={[Styles.userName, { marginLeft: 0, marginTop: 20, textAlign:'left' }]}>{t('common.travIsAllowedTo')}:</TextRegular>
                            : null}
                        {orderDetail.open_box_check_phisical_apperance ?
                            <TextRegular style={[Styles.priceText, { marginTop: 5, textAlign:'left' }]}>{t('common.openBoxCheck')}</TextRegular>
                            : null}
                        {orderDetail.use_item_for_testing ?
                            <TextRegular style={[Styles.priceText, { marginTop: 5, marginBottom: 15, textAlign:'left' }]}>{t('travelHome.useItemTesting')}</TextRegular>
                            : null}
                    </View>
                </View>
                <View style={styles.ordernumberStyle}>

                    <View style={[styles.orderNumberIst, { paddingLeft: '5%' }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.orderNo')}.</TextBold>

                    </View>
                    <View style={styles.orderNumberSecond}>

                        <TextRegular onLongPress={() => selectID(orderDetail._id)} style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', textAlign:'left'}]}>
                            {orderDetail._id}
                        </TextRegular>
                    </View>

                </View>
                <View style={Styles.upperView}>

                    <View style={styles.orderBillStyle}>

                        <View style={styles.billLeft}>
                            <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.orderPrice')}</TextBold>
                        </View>

                        <View style={styles.billRight}>
                            <TextRegular style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                {formatAmount(orderDetail.product_price)}
                            </TextRegular>
                        </View>

                    </View>

                    <View style={styles.orderBillStyle}>

                        <View style={[styles.billLeft, { marginTop: 2 }]}>
                            <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.estimatedDelFee')}</TextBold>
                        </View>

                        <View style={[styles.billRight, { marginTop: 2 }]}>
                            <TextRegular style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                {formatAmount(Math.round((orderDetail.product_price / 100) * 10) < 50 ? 50 : Math.round((orderDetail.product_price / 100) * 10))}
                            </TextRegular>
                        </View>

                    </View>

                    {orderDetail.vip_service_status == "Yes" ?
                        <View style={styles.orderBillStyle}>

                            <View style={[styles.billLeft, { marginTop: 2 }]}>
                                <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.vipServFee')}</TextBold>
                            </View>

                            <View style={[styles.billRight, { marginTop: 2 }]}>
                                <TextRegular style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                    {formatAmount(orderDetail.vip_service_fee)}
                                </TextRegular>
                            </View>

                        </View>
                        : null}

                    <View style={styles.orderBillStyle}>

                        <View style={[styles.billLeft, { marginTop: 2 }]}>
                            <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>Flighteno {t('track.cost')}</TextBold>
                        </View>

                        <View style={[styles.billRight, { marginTop: 2 }]}>
                            <TextRegular style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                {formatAmount(Math.round((orderDetail.product_price / 100) * 7))}
                            </TextRegular>
                        </View>

                    </View>


                    <View style={styles.orderBillStyle}>

                        <View style={[styles.billLeft, { marginTop: 2 }]}>
                            <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.tax')}</TextBold>
                        </View>

                        <View style={[styles.billRight, { marginTop: 2 }]}>
                            <TextRegular style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                {formatAmount(orderDetail.tax)}
                            </TextRegular>
                        </View>

                    </View>

                    <View style={[styles.orderBillStyle, { marginTop: 20 }]}>

                        <View style={[styles.billLeft, { marginTop: 2 }]}>
                            <TextBold style={[styles.textLarge, {textAlign:'left'}]}>{t('track.total')}</TextBold>
                        </View>

                        <View style={[styles.billRight, { marginTop: 2 }]}>
                            <TextRegular style={[styles.textLarge, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                {formatAmount(parseInt(orderDetail.product_price) + parseInt(orderDetail.tax) + parseInt(orderDetail.vip_service_fee) + parseInt(Math.round((orderDetail.product_price / 100) * 7)) + parseInt(Math.round((orderDetail.product_price / 100) * 10) < 50 ? 50 : Math.round((orderDetail.product_price / 100) * 10)))}
                            </TextRegular>
                        </View>

                    </View>
                    <View style={{ marginVertical: 50 }}>
                        {offerSent == "" || offerSent == undefined ?
                            <ButtonTraveller
                                loader={loading}
                                onPress={() => navigation.navigate("OfferPrice", { orderDetail: orderDetail })}
                                title={t('travelHome.offerDelivery')}
                            />
                            :
                            <Text style={Styles.userName}>You have already sent offer against this order!</Text>
                        }
                    </View>
                    {/* <View style={{ marginVertical: 50 }}>
                        <ButtonDisable
                            title="Offer a delivery"
                            loader={loading}
                        />
                    </View>
                    <View style={{ marginBottom: 30, }}>
                        <ButtonVerifyT
                            title="Verify Account"
                            loader={loading}
                            onPress={() => console.log("OK")}
                        />
                    </View> */}
                </View>
            </ScrollView>

            <ImageView
                images={[{uri:orderDetail.product_image}]}
                imageIndex={0}
                visible={imageVisible}
                onRequestClose={() => setImageVisible(false)}
            />

        </View>
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    listView: {
        paddingVertical: 20,
        backgroundColor: color.inputBackColor,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 25
    },
    upperView: {
        paddingHorizontal: '5%'
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 30
    },
    userName: {
        fontSize: 16,
        // fontWeight: 'bold',
        marginLeft: '5%',
        color: 'black'
    },
    bottomView: {
        paddingHorizontal: '5%',
        marginTop: 20,

    },
    productImage: {
        height: 90,
        width: '100%',
        borderRadius: 10
    },
    priceText: {
        fontSize: 16,
        // fontWeight: '900',
        color: color.skipTextColor
    },
    dateView: {
        height: 32,
        width: 100,
        borderRadius: 20,
        backgroundColor: color.lightBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto'
    },
    dateText: {
        fontSize: 14,
        color: color.backgroundColor,
    },
    propertView: {
        flexDirection: 'row',
        marginTop: 8
    }
})