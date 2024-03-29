// Core packages
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';


// Packages
import IconEntypo from 'react-native-vector-icons/Entypo';
import { CreditCardInput, LiteCreditCardInput } from "../../components/react-native-credit-card-input-plus";
import { useDispatch, useSelector } from 'react-redux';

// Custom Imports
import TextBold from '../../components/atoms/TextBold';
import TextMedium from '../../components/atoms/TextMedium';
import TextRegular from '../../components/atoms/TextMedium';
import { commonStyles } from '../../Utility/CommonStyles';
import Constants from '../../Utility/Constants';
import ButtonLarge from '../../components/ButtonLarge';
import { ADD_CARD, IS_LOADING } from '../../redux/constants';

import { createCard } from '../../services/Stripe/CardManagement'
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentAddNewCard({ navigation }) {
    const { t } = useTranslation();
    const { currentUser, token } = useSelector(({ authRed }) => authRed)
    const { myCards, defaultCard } = useSelector(({ myCardsRed }) => myCardsRed)


    const [cardDetails, setCardDetails] = useState();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    function _onChange(form) {
        console.log("Form", form)
        setCardDetails(form);
    }

    async function addCard() {

        if (cardDetails) {
            // Validation for Card Number
            if ((cardDetails.status.number == "invalid" || cardDetails.status.number == "incomplete" ) && cardDetails.values.number.length > 0 ) {
                Toast.show({
                    type: 'error',
                    text1: "Invalid Card Number"
                })
                return;
            }

            if (cardDetails.values.number == "") {
                Toast.show({
                    type: 'error',
                    text1: "Card Number is Required"
                })
                return;
            }

            // Validation for CVC
            if (cardDetails.status.cvc == "incomplete" && cardDetails.values.cvc.length > 0) {
                Toast.show({
                    type: 'error',
                    text1: "Invalid CVC"
                })
                return;
            }

            if (cardDetails.values.cvc == "") {
                Toast.show({
                    type: 'error',
                    text1: "CVC is Required"
                })
                return;
            }

            ///Validation for Expiry Date
            if (cardDetails.status.expiry == "incomplete" && cardDetails.values.expiry.length > 0) {
                Toast.show({
                    type: 'error',
                    text1: "Invalid Expiry Date"
                })
                return;
            }

            if (cardDetails.values.expiry == "") {
                Toast.show({
                    type: 'error',
                    text1: "Expiry Date is Required"
                })
                return;
            }

            // Validation for Name
            if (cardDetails.status.name == "incomplete") {
                Toast.show({
                    type: 'error',
                    text1: "Name is Required"
                })
                return;
            }
        } else {
            Toast.show({
                type: 'error',
                text1: "Please Enter Your Card Details"
            })
            return;
        }

        setLoading(true)
        if (myCards && myCards.length > 0) {
            const existingCard = myCards.find((card) => card.metadata.number == cardDetails.values.number)
            if (existingCard) {
                Toast.show({
                    type: 'error',
                    text1: "Card Already Exists"
                })
                setLoading(false)
                return;
            }
        }

        const data = await createCard(cardDetails, currentUser.stripe_customer_id);
        if (data.id) {
            dispatch({ type: ADD_CARD, data: data })
            navigation.pop();
        } else {

            Toast.show({
                type: 'error',
                text1: data.error.message
            })
        }


        setLoading(false);

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={[styles.container, commonStyles.marginTop10]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <IconEntypo name="chevron-left" size={34} color="#000" />
                    </TouchableOpacity>
                    <>
                        <View style={[commonStyles.marginTop30]}>
                            <TextBold style={[commonStyles.fs26, {textAlign:'left'}]}>{t('payment.addNewCard')}</TextBold>
                        </View>

                        <View style={[commonStyles.marginTop30]}>
                            <CreditCardInput
                                horizontal={false}
                                requiresName
                                onChange={(form) => _onChange(form)} 
                                labels={{number:t('common.cardNumber'),expiry:t('common.expiry'), name:t('common.cardHolder'), cvc: t('common.cvc') }}
                                labelStyle={{textAlign:'left'}}
                            />
                        </View>
                        <View style={[commonStyles.marginTop30]}>
                            <ButtonLarge
                                title={t('payment.addCard')}
                                loader={loading}
                                onPress={() => {
                                    addCard()
                                }}
                            />
                        </View>
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
    }
});