import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../Utility/Styles';
var windowWidth = Dimensions.get('window').width;
import { useSelector, useDispatch } from 'react-redux'
import TextBold from '../components/atoms/TextBold';
import TextMedium from '../components/atoms/TextMedium';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
    const navigation = useNavigation();
    const { currentProfile, currentUser, token } = useSelector(({ authRed }) => authRed)
    const { t, i18n } = useTranslation()


    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [paymentScreen, setPaymentScreen] = useState('');

    const [items, setItems] = useState([
        { label: 'EN', value: 'en', key: 'en', icon: () => <Image source={{ uri: 'https://flagcdn.com/h24/us.png' }} style={{ width: 24, height: 24 }} />, countryUrl: 'https://flagcdn.com/h24/us.png' },
        { label: 'AR', value: 'ar', key: 'ar', icon: () => <Image source={{ uri: 'https://flagcdn.com/h24/sa.png' }} style={{ width: 24, height: 24 }} />, countryUrl: 'https://flagcdn.com/h24/sa.png' }
    ]);

    const [isOpen, setOpen] = useState(false)

    useEffect(() => {
        const paymentScreen = currentUser.stripe_account_id != '' ? "ManageBankAccount" : "SetupStripe";
        setPaymentScreen(paymentScreen);

        items.forEach(item => {
            if (item?.value === currentLang) {
                setSelectedLanguage(item)
            }
        });

        getData()

    }, [])

    const storeCurrentLanguage = async (value) => {
        try {
            await AsyncStorage.setItem('language', value)
        } catch (e) {
            //err
        }
    }

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('language')
            if (value !== null) {
                // value previously stored
                console.log(value)
            }
        } catch (e) {
            // error reading value
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>


            <View style={[styles.ScreenCss, { marginLeft: 18, marginRight: 18 }]}>

                <ScrollView>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            style={styles.backImg}
                            resizeMode='stretch'
                            source={require('../images/back.png')}
                        />
                    </TouchableOpacity>

                    <TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 4) / 100, textAlign: 'left' }]}>{t('common.settings')}</TextBold>
                    <View style={{ height: 30 }} />

                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={styles.menuItem}>
                            <Image source={require('../images/person.png')}
                                style={styles.menuIcon}
                                resizeMode="contain"
                            />
                            <TextMedium style={styles.menuItemText}>{t('common.profile')}</TextMedium>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")} style={styles.menuItem}>
                            <Image source={require('../images/setting.png')}
                                style={styles.menuIcon}
                                resizeMode="contain"
                            />
                            <TextMedium style={styles.menuItemText}>{t('common.changePass')}</TextMedium>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity onPress={() => navigation.navigate("LatestTransactions")} style={styles.menuItem}>
                        <Image source={require('../images/payment.png')}
                            style={styles.menuIcon}
                            resizeMode="contain"
                        />
                        <TextMedium style={styles.menuItemText}>{t('common.payment')}</TextMedium>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("ManageCards")} style={styles.menuItem}>
                        <Image source={require('../images/payment.png')}
                            style={styles.menuIcon}
                            resizeMode="contain"
                        />
                        <TextMedium style={styles.menuItemText}>{t('common.manageCards')}</TextMedium>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        if (currentUser.stripe_account_id != '') {
                            navigation.navigate("ManageBankAccount")
                        } else {
                            navigation.navigate("SetupStripe")
                        }
                    }


                    } style={styles.menuItem}>
                        <Image source={require('../images/payment.png')}
                            style={styles.menuIcon}
                            resizeMode="contain"
                        />
                        <TextMedium style={styles.menuItemText}>{t('common.manageBankAccount')}</TextMedium>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.menuItem}>
                        <Image source={require('../images/notification.png')}
                            style={styles.menuIcon}
                            resizeMode="contain"
                        />
                        <TextMedium style={styles.menuItemText}>{t('common.notifications')}</TextMedium>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Image source={{ uri: selectedLanguage?.countryUrl }}
                            style={[styles.menuIcon]}
                            resizeMode="contain"
                        />
                        <DropDownPicker
                            open={isOpen}
                            items={items}
                            listMode='MODAL'
                            modalProps={{
                                animationType: 'slide'
                            }}
                            value={selectedLanguage}
                            onSelectItem={(item) => {
                                setSelectedLanguage(item)
                                i18n.changeLanguage(item?.value)
                                storeCurrentLanguage(item?.value)
                            }}
                            placeholder={t('common.changeLanguage')}
                            placeholderStyle={{ textAlign: 'left' }}
                            style={{ borderWidth: 0 }}
                            onPress={() => { setOpen(!isOpen) }}
                            onClose={() => { setOpen(!isOpen) }}
                            textStyle={{ fontFamily: Platform.OS == 'ios' ? 'Gilroy-Medium' : 'GilroyMedium', fontSize: 16 }}
                        />
                    </TouchableOpacity>
                </ScrollView>

            </View>
        </SafeAreaView>
    );

}