import React, { useEffect, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import IconEntypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import TextBold from '../../components/atoms/TextBold';
import { commonStyles } from '../../Utility/CommonStyles';
import Constants from '../../Utility/Constants';
import { getCards, getCustomerDefaultCard } from '../../services/Stripe/CardManagement'
import PaymentCardItem from '../../components/PaymentCardItem';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ManageCards({ navigation }) {
    const { t } = useTranslation();
    const { currentUser, token } = useSelector(({ authRed }) => authRed)
    const dispatch = useDispatch();
    const { myCards, defaultCard } = useSelector(({ myCardsRed }) => myCardsRed)


    useEffect(() => {
        getMyCards()
    }, [])

    async function getMyCards() {

        dispatch(await getCards(currentUser.stripe_customer_id))
        console.log('customer', currentUser.stripe_customer_id)
        //get default card
        dispatch(await getCustomerDefaultCard(currentUser.stripe_customer_id, currentUser));

    }

    return (
        <SafeAreaView style={{flex:1}}>
        <ScrollView>
            <View style={[styles.container, commonStyles.marginTop10]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <IconEntypo name="chevron-left" size={34} color="#000" />
                </TouchableOpacity>
                <>
                    <View style={[commonStyles.marginTop30]}>
                        <TextBold style={[commonStyles.fs26, {textAlign:'left'}]}>{t('common.manageCards')}</TextBold>
                    </View>
                    <View style={{ height: 22 }}></View>
                    {
                        myCards ? myCards.map(card => <PaymentCardItem card={card} defaultCard={defaultCard} key={card.id} />) : null
                    }


                    <TouchableOpacity style={styles.addCardBtn} onPress={() => {
                        navigation.navigate("PaymentAddNewCard")
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                            <IconEntypo name="plus" size={25} color="#36C5F0" />
                            <TextBold style={{ fontSize: 20, color: '#36C5F0', marginLeft: 14 }}>
                                {/* Add New Card */}
                              {t('payment.addNewCard')} 
                            </TextBold>
                        </View>
                    </TouchableOpacity>

                </>
            </View>
        </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: Constants.appLayout.screenContainerMarginHorizontal,
        backgroundColor: '#FFFFFF',
        paddingBottom: 20
    },
    backButton: {
        marginStart: -10,
        width: 30,
    },
    addCardBtn: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#A7A7A7',
        padding: 14,
        borderRadius: 16
    }
});