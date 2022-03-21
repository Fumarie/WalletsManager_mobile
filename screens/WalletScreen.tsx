import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {useRoute} from "@react-navigation/native";
import {cutBalance, formatAddress} from "../utils/wallets";
import * as Clipboard from 'expo-clipboard';
import WalletReceiveComponent from "../components/WalletReceiveComponent";
import {useAppDispatch, useAppSelector} from "../redux/store";
import {fetchGasPrice} from "../redux/Reducers/walletsSlice"
import WalletSendComponent from "../components/WalletSendComponent";

const WalletScreen = () => {
    const route = useRoute()
    const dispatch = useAppDispatch()
    const { address } = route.params;

    const {wallets} = useAppSelector(state => state.wallets)

    const wallet = wallets.find(elem => elem.address === address)

    const formattedAddress = useMemo(() => wallet?.address && formatAddress(wallet.address), [wallet?.address])
    const formattedBalance = useMemo(() => wallet?.balance &&cutBalance(wallet.balance), [wallet?.balance])

    const [activeComponent, setActiveComponent] = useState<"Send" | "Receive">("Send")

    useEffect(() => {
        dispatch(fetchGasPrice())
    }, [])

    const copyAddressToClipboard = () => {
        Clipboard.setString(address)
    }

    return (
        <>
            <View style={styles.header}>
                <View>
                    <TouchableOpacity onPress={() => copyAddressToClipboard()}>
                        <Text style={styles.title}>{formattedAddress}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.balance}>{formattedBalance} MATIC</Text>
            </View>
            <View style={styles.switchButtonsBlock}>
                <TouchableOpacity style={styles.switchButton} disabled={activeComponent === "Send"}  onPress={() => setActiveComponent("Send")}>
                    <Text style={{textAlign: "center"}}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchButton} disabled={activeComponent === "Receive"} onPress={() => setActiveComponent("Receive")}>
                    <Text style={{textAlign: "center",}}>Receive</Text>
                </TouchableOpacity>
            </View>
            {
                activeComponent === "Receive" &&
                    <WalletReceiveComponent address={address} />
            }
            {
                activeComponent === "Send" &&
                    <WalletSendComponent />
            }
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 10,
        height: "25%",
        width: "100%",
        alignItems: "center",
        borderBottomColor: "#383838",
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 16,
        color: "#383838",
        textAlign: "center",
    },
    balance: {
        marginTop: 30,
        fontSize: 30
    },
    switchButtonsBlock: {
        flexDirection: "row",
        width: "100%",
        height: 30,
        borderBottomWidth: 1,
        borderBottomColor: "black"
    },
    switchButton: {
        width: "50%",
        height: 30,
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
})

export default WalletScreen;
