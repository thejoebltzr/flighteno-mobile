import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../Utility/Styles';
import { useSelector } from 'react-redux';

import TopTabTraveller from '../TopTabTraveller';
import TextBold from '../../../components/atoms/TextBold';
import { color } from '../../../Utility/Color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

{/* Fix for FLIGHT-46 */}
export default function MyTripTab() {

    const { currentUser } = useSelector(({ authRed }) => authRed)
    const {t} = useTranslation()
    const navigation = useNavigation();
    const [imageValid, setImageValid] = useState(true)

    return (
        <SafeAreaView style={{flex:1}}>
<View style={styles.ScreenCss}>
            {/* <ScrollView> */}
            {/* <View style={styles.selectProfileHeader}> */}
            {/* <View style={[styles.SelectProfileHeaderFirst, { flexDirection: 'row' }]}>
                        <TouchableOpacity disabled={true}>
                            <Image
                                style={[styles.menueImg, { tintColor: null }]}
                                resizeMode='stretch'
                                source={require('../../../images/menu.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.SelectProfileHeaderSecond}>
                        <TouchableOpacity onPress={() => {navigation.navigate('Profile')}}>
                            <Image
                                style={styles.homeProfileImg}
                                source={require('../../../images/manProfile.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View> */}
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextBold style={{ marginLeft: '5%', marginTop: 15, marginBottom: 10, color: color.grayText, }}>{t('travelHome.letsPost')}</TextBold>
                {currentUser ?
                    <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
                        <Image
                            style={[styles.homeProfileImg, { margin: 15 }]}
                            source={imageValid ? {uri: currentUser?.profile_image} : require('../../../images/manProfile.png')} 
                            onError={() => setImageValid(false)}
                        />
                    </TouchableOpacity>
                    : null}
            </View>
            <TopTabTraveller />
            {/* </ScrollView> */}
        </View>
        </SafeAreaView>
    );
}