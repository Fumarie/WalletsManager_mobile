import React, {useMemo} from "react"
import {StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {cutBalance, formatAddress} from "../utils/wallets";
import {useNavigation} from "@react-navigation/native";

interface WalletItemProps {
    address: string,
    balance: string,
}

const WalletItem: React.FC<WalletItemProps> = ({address, balance}) => {
    const navigation = useNavigation()
    const formattedAddress = useMemo(() => formatAddress(address), [address])
    const formattedBalance = useMemo(() => cutBalance(balance), [balance])
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(
                'Wallet',
                {
                    address: address,
                    balance: balance
                }
                )
            }
        >
            <View
                style={styles.walletContainer}
            >
                <Text>{formattedAddress}</Text>
                <Text style={styles.balance}>{formattedBalance}</Text>
            </View>
        </TouchableOpacity>
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

export default WalletItem
