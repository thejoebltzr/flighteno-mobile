import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Button, Image, ScrollView, Dimensions, Pressable, Animated, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../Utility/Styles';
import { useDispatch, useSelector } from 'react-redux';
import CountryPicker from 'react-native-country-picker-modal';
import countries from '../../../Utility/countries.json';
import { color } from '../../../Utility/Color';
import ButtonLarge from '../../../components/ButtonLarge';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { CREATE_ORDER_DETAIL } from '../../../redux/constants';
import { formatAmount } from '../../../Utility/Utils';
import TextBold from '../../../components/atoms/TextBold';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';


var windowWidth = Dimensions.get('window').width;
var originCities = ""
var destinationCities = ""
{/* Fix for FLIGHT-46 */}
export default function SelectCountry({ route }) {

    const navigation = useNavigation();
    const {t} = useTranslation()
    const { loading, currentCountry } = useSelector(({ authRed }) => authRed)
    const { buyerOrderData } = useSelector(({ buyerOrderRed }) => buyerOrderRed)
    const dispatch = useDispatch()
    const [withFlag, setWithFlag] = useState(true)
    const [withFlagDeliver, setWithFlagDeliver] = useState(true)
    const [withEmoji, setWithEmoji] = useState(true)
    const [withEmojiDeliver, setWithEmojiDeliver] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withFilterDeliver, setWithFilterDeliver] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(false)
    const [withAlphaFilterDeliver, setWithAlphaFilterDeliver] = useState(false)
    const [withCallingCode, setWithCallingCode] = useState(false)
    const [withCallingCodeDeliver, setWithCallingCodeDeliver] = useState(false)
    const [countryCodeDeliver, setCountryCodeDeliver] = useState(currentCountry?.country_code)
    const [countryCode, setCountryCode] = useState(currentCountry?.country_code)
    const [modalCity, setModalCity] = useState("")
    const [modalVisibleCity, setModalVisibleCity] = useState("")
    const [modalVisibleCityDeliver, setModalVisibleCityDeliver] = useState("")
    const [withCountryNameButton, setWithCountryNameButton] = useState("")
    const [withCountryNameButtonDeliver, setWithCountryNameButtonDeliver] = useState("")
    const [deliveryDate, setDeliveryDate] = useState(moment(moment(buyerOrderData.preferred_dilivery_date_db_format)).add(14, 'days'))
    const [deliveryDay, setDeliveryDay] = useState(moment(deliveryDate).format('dddd'))
    const [deliveryDateFormat, setDeliveryDateFormat] = useState(moment(deliveryDate).format("MM/DD/YYYY"))
    const [country1, setCountry1] = useState(false)
    const [country2, setCountry2] = useState(false)

    const [country, setCountryOrigin] = useState(currentCountry)
    const [countryDeliver, setCountryDestination] = useState(currentCountry)

    /*Fix for FLIGHT-11*/
    const [pickerValuesCity, setPickerValuesCity] = useState([...new Set(countries[country?.country_name])]);
    const [pickerValuesCityDeliver, setPickerValuesCityDeliver] = useState([...new Set(countries[country?.country_name])]);

    const [pickerValueSelectedCity, setPickerValueSelectedCity] = useState(currentCountry.city);
    const [pickerValueSelectedCityDeliver, setPickerValueSelectedCityDeliver] = useState(currentCountry.city);

    originCities = countries[country?.country_name ? country?.country_name : country.name];
    destinationCities = countries[countryDeliver?.country_name ? countryDeliver?.country_name : countryDeliver.name];


    const onSelect = (selectedCountry) => {
        setCountryCode(selectedCountry.cca2)
        setCountryOrigin(selectedCountry)
        originCities = countries[selectedCountry.name]
        if (originCities == undefined) {
            setPickerValuesCity([])
            setPickerValueSelectedCity('')
        }
        else {
            setPickerValuesCity(originCities)
            setPickerValuesCity([...new Set(originCities)])
            setPickerValueSelectedCity(originCities.length > 0 ? originCities[0] : '')
        }

    }


    const onSelectDestinationCountry = (selectedCountry) => {
        setCountryCodeDeliver(selectedCountry.cca2)
        setCountryDestination(selectedCountry)
        destinationCities = countries[selectedCountry.name]
        if (destinationCities == undefined) {
            // setPickerValueSelectedCityDeliver(selectedCountry.name)
            setPickerValuesCityDeliver([])
            setPickerValueSelectedCityDeliver('')
        }
        else {
            setPickerValuesCityDeliver([...new Set(destinationCities)] )
            setPickerValueSelectedCityDeliver(destinationCities.length > 0 ? destinationCities[0] : '')
        }

    }

    const selectPickerValueCityFN = (index) => {
        setModalVisibleCity(!modalVisibleCity)
        setPickerValueSelectedCity(pickerValuesCity[index])
    }

    const selectPickerValueCityDeliverFN = (index) => {
        setModalVisibleCityDeliver(!modalVisibleCityDeliver)
        setPickerValueSelectedCityDeliver(pickerValuesCityDeliver[index])
    }

    const searchCitiesOrigin = (text) => {
        if (originCities != undefined) {
            var seachedCity = originCities.filter(function search(city) { return city.toUpperCase().includes(text.toUpperCase()) })
            if (text == "") {
                /*Fix for FLIGHT-11*/
                setPickerValuesCity([...new Set(originCities)])
            }
            else {
                /*Fix for FLIGHT-11*/
                setPickerValuesCity([...new Set(seachedCity)])
               
            }
        }
    }

    const searchCitiesDestination = (text) => {
        if (destinationCities != undefined) {
            var seachedCity = destinationCities.filter(function search(city) { return city.toUpperCase().includes(text.toUpperCase()) })
            if (text == "") {
                setPickerValuesCityDeliver([...new Set(destinationCities)])
            }
            else {
                setPickerValuesCityDeliver([...new Set(seachedCity)])
            }
        }
    }

    const handleSubmit = () => {

        let deliveryFee = buyerOrderData.product_price / 100 * 10;
        deliveryFee = deliveryFee > 50 ? deliveryFee : 50;

        buyerOrderData["product_buy_country_name"] = country.country_name ? country?.country_name : country.name
        buyerOrderData["product_buy_city_name"] = pickerValueSelectedCity
        buyerOrderData["product_dilivery_country_name"] = countryDeliver?.country_name ? countryDeliver?.country_name : countryDeliver.name
        buyerOrderData["product_dilivery_city_name"] = pickerValueSelectedCityDeliver
        buyerOrderData["flighteno_cost"] = Math.round((buyerOrderData.product_price / 100) * 7)
        buyerOrderData["product_dilivery_date"] = deliveryDateFormat
        buyerOrderData["estimated_dilivery_fee"] = deliveryFee
        buyerOrderData["tax"] = Math.round((buyerOrderData.product_price / 100) * 5)

        
        dispatch({ type: CREATE_ORDER_DETAIL, data: buyerOrderData })
        navigation.navigate("OrderDetail")
    }

    return (
        <SafeAreaView style={{flex:1}}>
  <View style={[styles.ScreenCss, {marginLeft:18, marginRight:18}]}>

            <ScrollView>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.backImg}
                        resizeMode='stretch'
                        source={require('../../../images/back.png')}
                    />
                </TouchableOpacity>
                <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 4) / 100, textAlign:'left' }]}>{t('buyerHome.selCountry')}</TextBold>


                <TextBold style={[styles.loginInputHeading, { marginTop: (windowWidth * 8) / 100, marginBottom: (windowWidth * 2) / 100, textAlign:'left'}]}>{t('buyerHome.buyProdFrom')}</TextBold>


                <View style={[styles.pickerVIew, { alignItems: 'center', padding: 4, paddingLeft: 16 }]}>
                    <CountryPicker
                        countryCode={countryCode}
                        withFilter
                        withFlag
                        withAlphaFilter
                        withCallingCode
                        withEmoji
                        onSelect={(country) => onSelect(country)}
                        modalProps={{
                            visible: country1
                        }}
                        onClose={() => setCountry1(false)}
                        onOpen={() => setCountry1(true)}
                    />

                    <View style={{ borderLeftWidth: 1, paddingLeft: 8, marginLeft: 16 }}>
                        <TextMedium style={[styles.countryNameCSS]}>{country.country_name ? country.country_name : country.name}</TextMedium>
                    </View>
                </View>

                    
                <View style={[styles.pickerVIew, { alignItems: 'center', marginTop: 16, padding: 16 }]}>

                <TouchableOpacity style={styles.citySelect} onPress={() => setModalVisibleCity(!modalVisibleCity)}>
                    <TextMedium style={styles.countryNameCSS}>City</TextMedium>
                    <Image
                        style={[styles.countryDropImg, { marginLeft: 8 }]}
                        resizeMode='stretch'
                        source={require('../../../images/dropDpwnCountry.png')}
                    />
                    </TouchableOpacity>

                    <View style={{ borderLeftWidth: 1, paddingLeft: 8 }}>
                        <TextMedium style={[styles.countryNameCSS]}>{pickerValueSelectedCity}</TextMedium>
                    </View>

                </View>

                <TextBold style={[styles.loginInputHeading, {  marginTop: (windowWidth * 10) / 100, marginBottom: (windowWidth * 2) / 100, textAlign:'left' }]}>{t('buyerHome.delProdTo')}</TextBold>


                <View style={[styles.pickerVIew, { alignItems: 'center', padding: 4, paddingLeft: 16 }]}>
                    <CountryPicker
                        countryCode={countryCodeDeliver}
                        withFilter
                        withFlag
                        withAlphaFilter
                        withCallingCode
                        withEmoji
                        onSelect={(country) => onSelectDestinationCountry(country)}
                        modalProps={{
                            visible: country2
                        }}
                        onClose={() => setCountry2(false)}
                        onOpen={() => setCountry2(true)}
                    />

                    <View style={{ borderLeftWidth: 1, paddingLeft: 8, marginLeft: 16 }}>
                        <TextMedium style={[styles.countryNameCSS]}>{countryDeliver.country_name ? countryDeliver.country_name : countryDeliver.name}</TextMedium>
                    </View>
                </View>

                    
                <View style={[styles.pickerVIew, { alignItems: 'center', marginTop: 16, padding: 16 }]}>

                <TouchableOpacity style={styles.citySelect} onPress={() => setModalVisibleCityDeliver(!modalVisibleCityDeliver)}>
                    <TextMedium style={styles.countryNameCSS}>City</TextMedium>
                    <Image
                        style={[styles.countryDropImg, { marginLeft: 8 }]}
                        resizeMode='stretch'
                        source={require('../../../images/dropDpwnCountry.png')}
                    />
                    </TouchableOpacity>

                    <View style={{ borderLeftWidth: 1, paddingLeft: 8 }}>
                        <TextMedium style={[styles.countryNameCSS]}>{pickerValueSelectedCityDeliver}</TextMedium>
                    </View>

                </View>



                <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 17) / 100, textAlign:'left' }]}>{t('buyerHome.delDate')}</TextBold>


                <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10,  textAlign: 'justify', marginTop: 20 }]}>
                    {t('common.basedOnYourCountry')}
                </TextMedium>


                <TextBold style={[styles.loginInputHeading, {  marginTop: (windowWidth * 4) / 100, marginBottom: (windowWidth * 2) / 100 }]}>
                    {deliveryDay + " " + deliveryDateFormat}
                </TextBold>


                {/* <View style={styles.ordernumberStyle}>

                    <View style={styles.orderNumberIst}>
                        <Text style={styles.loginInputHeading}>Order No.</Text>

                    </View>
                    <View style={styles.orderNumberSecond}>

                        <Text style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            121232264
                        </Text>
                    </View>

                </View> */}

                <View style={styles.orderBillStyle}>

                    <View style={styles.billLeft}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('buyerHome.orderPrice')}</TextBold>
                    </View>

                    <View style={styles.billRight}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(buyerOrderData.product_price)}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.estimatedDelFee')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(Math.round((buyerOrderData.product_price / 100) * 10) < 50 ? 50 : Math.round((buyerOrderData.product_price / 100) * 10))}
                        </TextMedium>
                    </View>

                </View>

                {buyerOrderData.vip_service_status == "Yes" ?
                    <View style={styles.orderBillStyle}>

                        <View style={[styles.billLeft, { marginTop: 2 }]}>
                            <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.vipServFee')}</TextBold>
                        </View>

                        <View style={[styles.billRight, { marginTop: 2 }]}>
                            <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                                {formatAmount(buyerOrderData.vip_service_fee)}
                            </TextMedium>
                        </View>

                    </View>
                    : null}

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={styles.loginInputHeading}>Flighteno {t('track.cost')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(Math.round((buyerOrderData.product_price / 100) * 7))}
                        </TextMedium>
                    </View>

                </View>


                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.loginInputHeading, {textAlign:'left'}]}>{t('track.tax')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.termText, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(Math.round((buyerOrderData.product_price / 100) * 5))}
                        </TextMedium>
                    </View>

                </View>

                <View style={styles.orderBillStyle}>

                    <View style={[styles.billLeft, { marginTop: 2 }]}>
                        <TextBold style={[styles.textLarge, {textAlign:'left'}]}>{t('track.total')}</TextBold>
                    </View>

                    <View style={[styles.billRight, { marginTop: 2 }]}>
                        <TextMedium style={[styles.textLarge, { color: color.countrtTextColor, opacity: 10, marginHorizontal: '5%', textAlign: 'justify', }]}>
                            {formatAmount(Math.round(buyerOrderData.product_price) + Math.round((buyerOrderData.product_price / 100) * 10) + Math.round((buyerOrderData.product_price / 100) * 7) + Math.round((buyerOrderData.product_price / 100) * 5) + Math.round(buyerOrderData.vip_service_fee))}
                        </TextMedium>
                    </View>

                </View>

                <View style={{ marginTop: 40, marginBottom: 20 }}>
                    <ButtonLarge
                        title={t('buyerHome.continue')}
                        loader={loading}
                        onPress={() => handleSubmit()}
                    />
                </View>


            </ScrollView>


            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisibleCity}
                onRequestClose={() => {
                    setModalCity(!modalCity);
                }}

            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {/* <Text style={styles.modalText}>Hello World!</Text> */}

                            <View style={styles.modalCitySearchContainer}>
                                <TouchableOpacity onPress={() => setModalVisibleCity(!modalVisibleCity)}>
                                    <Image
                                        style={styles.cityModalClose}
                                        resizeMode='stretch'
                                        source={require('../../../images/cross.png')}
                                    />

                                </TouchableOpacity>

                                <TextInput style={styles.inputCityModal}
                                    placeholder="Enter city name"
                                    placeholderTextColor="#656F85"
                                    onChangeText={text => searchCitiesOrigin(text)}
                                    secureTextEntry={false}

                                />
                            </View>

                            <FlatList
                                data={pickerValuesCity}
                                nestedScrollEnabled={true}
                                renderItem={({ item, index }) =>
                                    <View style={{ marginLeft: 10, paddingVertical: 16, borderBottomColor: '#ddd', borderBottomWidth: 1, }}>
                                        <TouchableOpacity onPress={() => selectPickerValueCityFN(index)}>
                                            <View>
                                                <Text style={styles.textSelectedCity}>{item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                }
                                keyExtractor={(item, index) => item + index}
                                style={{ marginTop: 3 }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>


            {/* /////////////Deliver */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisibleCityDeliver}
                onRequestClose={() => {
                    setModalCity(!modalCity);
                }}

            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {/* <Text style={styles.modalText}>Hello World!</Text> */}

                            <View style={styles.modalCitySearchContainer}>
                                <TouchableOpacity onPress={() => setModalVisibleCityDeliver(!modalVisibleCityDeliver)}>
                                    <Image
                                        style={styles.cityModalClose}
                                        resizeMode='stretch'
                                        source={require('../../../images/cross.png')}
                                    />

                                </TouchableOpacity>

                                <TextInput style={styles.inputCityModal}
                                    placeholder="Enter city name"
                                    placeholderTextColor="#656F85"
                                    onChangeText={text => searchCitiesOrigin(text)}
                                    secureTextEntry={false}

                                />
                            </View>

                            <FlatList
                                data={pickerValuesCityDeliver}
                                nestedScrollEnabled={true}
                                renderItem={({ item, index }) =>
                                    <View style={{ marginLeft: 10, paddingVertical: 16, borderBottomColor: '#ddd', borderBottomWidth: 1, }}>
                                        <TouchableOpacity onPress={() => selectPickerValueCityDeliverFN(index)}>
                                            <View>
                                                <Text style={styles.textSelectedCity}>{item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                }
                                keyExtractor={(item, index) => item + index}
                                style={{ marginTop: 3 }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>




        </View>
        </SafeAreaView>
    );

}