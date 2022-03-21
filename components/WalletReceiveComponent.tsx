import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View, Text, Button} from "react-native";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {receiveTokensDataInterface, receiveTokens, clearReceive, updateBalance} from "../redux/Reducers/walletsSlice";
import {useNavigation} from "@react-navigation/native";

interface WalletReceiveComponentProps {
    address: string
}

const WalletReceiveComponent: React.FC<WalletReceiveComponentProps> = ({address}) => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    const [leftValue, setLeftValue] = useState("0.1")
    const [minimalSend, setMinimalSend] = useState("0.1")
    const [gasPrice, setGasPrice] = useState("0")

    const {gasLoading, gasPriceList, wallets} = useAppSelector(state => state.wallets)

    useEffect(() => {
        if (gasPriceList?.fast)
            setGasPrice(gasPriceList.fast.toString())
    }, [gasPriceList])

    const sendTx = async () => {
        dispatch(clearReceive())
        if (!leftValue || !minimalSend || !gasPrice) return
        console.log({
            leftValue,
            minimalSend,
            gasPrice
        })

        const fromWallets = wallets.filter(wallet => wallet.address !== address)

        const receiveTxData: receiveTokensDataInterface = {
            fromWallets: fromWallets,
            toAddress: address,
            leftValue,
            minimalSend,
            gasPrice
        }
        dispatch(receiveTokens(receiveTxData))
        navigation.navigate("Transactions")
    }

    return (
        <View style={styles.container}>
            <Text>Leave on wallets (MATIC)</Text>
            <TextInput
                style={styles.leftValueInput}
                onChangeText={setLeftValue}
                value={leftValue}
                keyboardType="number-pad"
            />
            <Text>Minimal send (MATIC)</Text>
            <TextInput
                style={styles.leftValueInput}
                onChangeText={setMinimalSend}
                value={minimalSend}
                keyboardType="number-pad"
            />
            <Text>Gas price (GWEI)</Text>
            <TextInput
                style={styles.leftValueInput}
                onChangeText={setGasPrice}
                value={gasPrice}
                keyboardType="number-pad"
            />
            <View style={styles.sendButton}>
                <Button title={"Receive"} onPress={() => sendTx()}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        height: "100%",
    },
    leftValueInput: {
        height: 30,
        borderBottomWidth: 1,
        borderBottomColor: "black",
        textAlign: "center"
    },
    sendButton: {
        marginTop: 10
    }
})

export default WalletReceiveComponent;
