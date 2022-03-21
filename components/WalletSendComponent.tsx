import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../redux/store";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";

const WalletSendComponent = () => {
    const [goalValue, setGoalValue] = useState("0.2")
    const [minimalSend, setMinimalSend] = useState("0.1")
    const [gasPrice, setGasPrice] = useState("0")

    const {gasLoading, gasPriceList} = useAppSelector(state => state.wallets)

    useEffect(() => {
        if(gasPriceList?.fast)
            setGasPrice(gasPriceList.fast.toString())
    }, [gasPriceList])

    const sendTx = () => {
        if(!goalValue || !minimalSend || !gasPrice) return
        console.log({
            goalValue,
            minimalSend,
            gasPrice
        })
    }

    return (
        <View style={styles.container}>
            <Text>Goal value on each wallet (MATIC)</Text>
            <TextInput
                style={styles.leftValueInput}
                onChangeText={setGoalValue}
                value={goalValue}
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
                <Button title={"Send"} onPress={sendTx} />
            </View>
        </View>
    );
};

export default WalletSendComponent;

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
