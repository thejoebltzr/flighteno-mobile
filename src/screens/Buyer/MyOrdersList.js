import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { color } from '../../Utility/Color';
import { styles } from '../../Utility/Styles';
import { useSelector, useDispatch } from 'react-redux'
import SearchInput from '../../components/SearchInput';
var windowWidth = Dimensions.get('window').width;
import moment from 'moment'
import CardOrder from '../../components/CardOrder';
import TextBold from '../../components/atoms/TextBold';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

{/* Fix for FLIGHT-46 */}
export default function MyOrdersList({ route }) {
    const { orderStatus, orders } = route.params
    const navigation = useNavigation()
    const [searchedOrders, setSearchedOrders] = useState(orders)
    const {t} = useTranslation()

    const handleSearch = (text) => {
        var res = orders.filter(function (element) {
            return element._id.toLowerCase().includes(text.toLowerCase()) || element.name.toLowerCase().includes(text.toLowerCase());
        });
        setSearchedOrders(res)
    }

    const goToDetails = (order) => {
        navigation.navigate("OrderDetails", { order: order })
    }

    return (
        <SafeAreaView style={{flex:1}}> 
            <View style={{ flex: 1, backgroundColor: color.backgroundColor, marginLeft:18, marginRight:18 }}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
                style={styles.backImg}
                resizeMode='stretch'
                source={require('../../images/back.png')}
            />
        </TouchableOpacity>

<TextBold style={[styles.HeadingText, { marginTop: (windowWidth * 4) / 100,  textAlign:'left' }]}>
    {t('track.my')} {orderStatus == "Pending" ? t('track.pending') : orderStatus == "Completed" ? t('track.completed') : t('track.cancelled')} {t('track.orders')}
</TextBold>
<SearchInput
    placeholder="Search Product Name, Order No."
    onChangeText={(text) => handleSearch(text)}
/>

<FlatList
    data={searchedOrders}
    renderItem={({ item, index }) =>
        <TouchableOpacity onPress={() => goToDetails(item)} style={Styles.listView}>
            <CardOrder order={item}></CardOrder>
        </TouchableOpacity>
    }
    keyExtractor={(item,index) => item + index }
    ListEmptyComponent={<TextBold style={styles.emptyListText}>
        {t('common.thereAreNo')} {orderStatus == "Pending" ? t('track.pending') : orderStatus == "Completed" ? t('track.completed') : t('track.cancelled')}  {t('track.orders').toLowerCase()}!
    </TextBold>}
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
        fontWeight: 'bold',
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
})