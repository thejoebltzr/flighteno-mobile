import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { color } from '../../Utility/Color';
import { styles } from '../../Utility/Styles';
import { useSelector, useDispatch } from 'react-redux'
import { AirbnbRating } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';
import ButtonLarge from '../../components/ButtonLarge';
var windowWidth = Dimensions.get('window').width;
import CardOrder from '../../components/CardOrder';
import { formatAmount } from '../../Utility/Utils';
import { CancelOrder, GetProfile } from '../../redux/actions/Trips';
import ReviewList from '../../components/ReviewList';
import ViewImages from '../../components/ViewImages';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import TextBold from '../../components/atoms/TextBold';
import TextMedium from '../../components/atoms/TextMedium';
import { useTranslation } from 'react-i18next';
import { getCurrentOrder } from '../../redux/actions/BuyerOrder';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageModal from 'react-native-image-modal';
import ImageView from "react-native-image-viewing";

{/* Fix for FLIGHT-46 */}
export default function OrderDetails({ route }) {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { loading, currentUser, token } = useSelector(({ authRed }) => authRed)
    const [userRating, setUserRating] = useState('4.8')
    const [traveler, setTraveler] = useState()
    const [rated, setRated] = useState("")
    const [showProductPic, setShowProductPic] = useState(false)
    const [showReceiptPic, setShowReceiptPic] = useState(false)
    const { order } = route.params
    let isCancellable = order.status != 'cancelled' && order.status == 'new'
    let isStarted = order.status == 'accepted'
    let isComplete = order.status == 'complete'
    const {t} = useTranslation()
    const [orderHistory, setOrderHistory] = useState([])
    const [imageValid, setImageValid] = useState(true)
    const [orderImage, setOrderImage] = useState('')
    const [imageVisible, setImageVisible] = useState(false)


    function check(id) {
        return id == currentUser._id
    }

    useEffect(() => {

        console.log('order id ',order._id)

        if (order.rated_admin_id) {
            setRated(order.rated_admin_id.find(check))
        }

        // fix for flight-45
        var obj = {
            admin_id: order?.admin_id
        }
        
      
        const userToken = token.replace('Token: ','')
        dispatch(GetProfile(obj, userToken, (data) => {
            setTraveler(data)
        }))

        const orderRequest = {
            admin_id:order?.admin_id,
            order_id:order?._id 
        }

        dispatch(getCurrentOrder(orderRequest,userToken,(data) => {
            // console.log(data)
        },(orderHistory) => {
            setOrderHistory(orderHistory)
        }))
        // !isComplete && order.status == "accepted"
        console.log(order.status)

    }, [])

    function cancelOrder() {

        var obj = {
            admin_id: currentUser?._id,
            order_id: order?._id
        }
        dispatch(CancelOrder(obj, token, navigation))
       
    }

    const onOrderImageTap = (image) => {
        setImageVisible(true)
        setOrderImage(image)
    }

    const imageProduct = [{
        url: order.new_image,
    }]

    const imageReceipt = [{ 
        url: order.recipt,
    }]

    const viewImage = (type) => {
        if (type == "image") {
            if (order.new_image) {
                setShowProductPic(true)
            }
        }
        else {
            if (order.recipt) {
                setShowReceiptPic(true)
            }
        }
    }

    const selectID = (id) => {
        Clipboard.setString(id)
        Toast.show({
            type: 'succes',
            text2: "Copied to clipboard",
        })
    }



    return (
        <SafeAreaView style={{flex:1}} >
        <View style={{ flex: 1, backgroundColor: color.backgroundColor, marginLeft:18, marginRight:18 }}>
            <ViewImages
                showImageViewer={showProductPic}
                images={imageProduct}
                closeModal={() => setShowProductPic(false)}
            />
            <ViewImages
                showImageViewer={showReceiptPic}
                images={imageReceipt}
                closeModal={() => setShowReceiptPic(false)}
            />
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.backImg}
                        resizeMode='stretch'
                        source={require('../../images/back.png')}
                    />
                </TouchableOpacity>
                <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 4) / 100, textAlign:'left' }]}>
                    { order?.status.toLowerCase() == 'cancelled' ? t('buyerHome.orderCancelled') : isComplete ? t('buyerHome.rateYourTransaction') : t('buyerHome.myPendingOrder')}
                </TextBold>
                {traveler?
                    <TouchableOpacity onPress={() => navigation.navigate("TravelerProfile", { traveler: traveler, orderId: order._id })} style={Styles.userView}>
                        <Image
                            source={imageValid ? { uri:  traveler?.profile_image } : require('../../images/manProfile.png')}
                            style={styles.profileImage}
                            onError={() => setImageValid(false)}
                        />
                        <View style={{alignItems:'flex-start', paddingLeft:16}}>
                            <TextBold style={Styles.userName}>{traveler?.full_name}</TextBold>
                            <AirbnbRating
                                defaultRating={traveler?.traveler_ratting?.length != 0 ? traveler?.traveler_ratting[0]?.avg_rating : 0}
                                type='star'
                                ratingCount={5}
                                size={15}
                                showRating={false}
                                isDisabled={true}   
                            />
                            <TextBold style={styles.ratingText}>{traveler?.traveler_ratting?.length != 0 ? traveler?.traveler_ratting[0].avg_rating : 0} Out of 5.0</TextBold>
                        </View>
                    </TouchableOpacity>
                 : null}
                <CardOrder
                    order={order}/>
               
                <View style={{ alignSelf: "center", marginVertical: 20, }}>
                    <QRCode
                        value={order._id}
                    />
                </View>
                <View style={styles.ordernumberStyle}>

                    <View style={styles.orderNumberIst}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.orderNo')}.</TextBold>
                    </View>
                    <View style={styles.orderNumberSecond}>
                        <TextMedium onLongPress={() => selectID(order._id)}
                         style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {order._id}
                        </TextMedium>
                    </View>

                </View>
                <View style={styles.orderBillStyle}>

                    <View style={styles.billLeft}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.orderPrice')}</TextBold>
                    </View>

                    <View style={styles.billRight}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(order.product_price)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.estimatedDelFee')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(order.estimated_dilivery_fee)}
                        </TextMedium>
                    </View>

                </View>


                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.vipServFee')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(order.vip_service_fee)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={styles.loginInputHeading}>Flighteno {t('track.cost')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(order.flighteno_cost)}
                        </TextMedium>
                    </View>

                </View>


                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.tax')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(order.tax)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.textLarge, {textAlign:'left'}]}>{t('track.total')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.textLarge, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(order.Total)}
                        </TextMedium>
                    </View>

                </View>
                <View>
                    <TextBold style={[styles.loginInputHeading, { marginTop: (windowWidth * 5) / 100, marginBottom: (windowWidth * 2) / 100, textAlign:'left' }]}>
                    {t('track.picOfProd')}
                    </TextBold>
                    <TouchableOpacity activeOpacity={1} disabled={!order.new_image ? true : false}
                        // onPress={() => viewImage('image')}
                        onPress={()=>{
                            onOrderImageTap(order.new_image)
                        }} 
                        style={Styles.productImageContainer}>
                        {order.new_image ?
                            <Image
                                source={{ uri: order.new_image }}
                                style={Styles.productImageContainer}
                            />
                            :
                            <Image
                                source={require('../../images/cameraImg.png')}
                                style={Styles.innerImage}
                                resizeMode="contain"
                            />
                        }
                    </TouchableOpacity>
                    <TextBold style={[styles.loginInputHeading, { marginTop: (windowWidth * 5) / 100, marginBottom: (windowWidth * 2) / 100, textAlign:'left' }]}>
                        {t('track.prodReceipt')}
                    </TextBold>
                    <TouchableOpacity activeOpacity={1} disabled={!order.recipt ? true : false}
                        // onPress={() => viewImage('receipt')}
                        onPress={() => {
                            onOrderImageTap(order.recipt)
                        }}
                        style={Styles.productImageContainer}>
                        {order.recipt ?
                            <Image
                                source={{ uri: order.recipt }}
                                style={Styles.productImageContainer}
                            />
                            :
                            <Image
                                source={require('../../images/cameraImg.png')}
                                style={Styles.innerImage}
                                resizeMode="contain"
                            />
                        }
                    </TouchableOpacity>

                    {/* Order history */}
                    <View style={{ marginTop:16}}>
                        { orderHistory.map((item,index) => {
                            if(item.status=="new")
                            {
                                item.status=" Order has been placed"
                            }
                            else if(item.status=="accepted"){
                                item.status=" Order accepted by the traveler"
                            }
                            else if(item.status=="complete"){
                                item.status=" Order complete"
                            }
                            else if(item.status=="rejected")
                            {
                                item.status=" Order has been cancelled"
                            }
                            return (
                                 <TextMedium style={{color:color.countrtTextColor}} key={index} >{moment.unix(orderHistory[0]?.created_date?.$date?.$numberLong/1000).format("MM/DD/YY")}{item?.status}</TextMedium>
                            )
                        }) }
                        {/* <FlatList
                            data={orderHistory}
                            keyExtractor={(item,index) => item + index}
                            nestedScrollEnabled={true}
                            renderItem={({item}) => {
                                return (
                                    <TextMedium style={{color:color.countrtTextColor}}>{moment.unix(orderHistory[0]?.created_date?.$date?.$numberLong/1000).format("MM/DD/YY")}  order is {item?.status}</TextMedium>
                                )
                            }}
                        /> */}
                    </View>


                    {/* {!isComplete && order.status == "accepted" ? */}
                        <TextMedium style={Styles.bottomText}>
                        {t('track.pleaseCoord')}
                        </TextMedium>
                        {/* : null} */}
                </View>
                {isComplete && !rated ?
                    <View style={{ marginVertical: 20 }}>
                        <ButtonLarge
                            title= {t('track.rateTransaction')}
                            loader={loading}
                            onPress={() => navigation.navigate("RateTransaction", { order: order })}
                        />
                    </View>
                    : null}
                {isCancellable ?
                    <View style={{ marginVertical: 20 }}>
                        <ButtonLarge
                            title={t('track.cancelOrder')}
                            loader={loading}
                            color='#E01E82'
                            onPress={cancelOrder}
                        />
                    </View> : null}
                {order.review_details ?
                    order.review_details?.length > 0 ?
                        <ReviewList review={order.review_details[0]}
                            onPressUser={() => navigation.navigate("TravelerProfile", { traveler: traveler, orderId: order._id })}
                        />
                        : null : null}
                <View style={{ height: 20 }} />
            </ScrollView>

            <ImageView
                images={[{uri:orderImage}]}
                imageIndex={0}
                visible={imageVisible}
                onRequestClose={() =>  setImageVisible(false)}
            />
        </View>
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    listView: {
        paddingVertical: 20,
        backgroundColor: color.inputBackColor,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 20
    },
    upperView: {
        paddingHorizontal: '5%'
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    userName: {
        fontSize: 16,
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
        fontWeight: '900',
        color: color.skipTextColor
    },
    dateView: {
        height: 32,
        width: 90,
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
    userView: {
        flexDirection: 'row',
        // marginHorizontal: '5%',
        marginVertical: 20,
        alignItems: 'center'
    },
    productImageContainer: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: color.inputBackColor
    },
    innerImage: {
        height: 60,
        width: 70
    },
    bottomText: {
        fontSize: 17,
        textAlign: 'center',
        marginTop: 20,
        color: color.skipTextColor,
        textTransform: "uppercase"
    }
})