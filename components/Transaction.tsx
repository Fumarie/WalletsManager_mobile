import React, {useMemo} from 'react';
import {cutBalance, formatAddress} from "../utils/wallets";
import {View, Text, StyleSheet} from "react-native";

interface TransactionProps {
    address: string,
    balance: string,
    status: string
}

const Transaction: React.FC<TransactionProps> = ({address, balance, status}) => {
    const formattedAddress = useMemo(() => formatAddress(address), [address])
    const formattedBalance = useMemo(() => cutBalance(balance), [balance])

    return (
        <View
            style={styles.walletContainer}
        >
            <Text>{formattedAddress}</Text>
            <Text>{status}</Text>
            <Text style={styles.balance}>{formattedBalance}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    walletContainer: {
        width: "100%",
        height: 50,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#383838",
        color: "#383838",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    balance: {
        color: "black",
        fontWeight: "bold"
    }
})

export default Transaction;
