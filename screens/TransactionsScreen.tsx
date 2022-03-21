import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useAppDispatch, useAppSelector} from "../redux/store";
import Transaction from "../components/Transaction";
import {clearReceive, updateBalance} from "../redux/Reducers/walletsSlice";

const TransactionsScreen = () => {
    const dispatch = useAppDispatch()
    const {received, receiveLoading} = useAppSelector(state => state.wallets)

    useEffect(() => {
        return dispatch(clearReceive())
    }, [])
    return (
        <>
            {
                receiveLoading ?
                    <View style={styles.loadingContainer}>
                        <Text>Loading...</Text>
                    </View>

                    :
                    <>
                        <ScrollView>
                            {received.map(wallet => <Transaction key={wallet.address} address={wallet.address}
                                                                 balance={wallet.balance} status={wallet.status}/>)}
                        </ScrollView>
                    </>
            }
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default TransactionsScreen;
