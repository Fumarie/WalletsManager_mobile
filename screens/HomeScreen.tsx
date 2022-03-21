import React, {useMemo} from 'react';
import TotalBalanceBlock from "../components/TotalBalanceBlock";
import {ScrollView, Text} from "react-native";
import WalletItem from "../components/WalletItem";
import {useAppSelector} from "../redux/store";

const HomeScreen = () => {
    const {wallets, isLoading} = useAppSelector(state => state.wallets)

    const totalBalance = useMemo(() => {
        let balance = 0
        wallets.forEach(elem => {
            balance += +elem.balance
        })
        return balance.toString()
    }, [wallets])

    return (
        <>
            {
                isLoading ? <Text style={{textAlign: "center"}}>Loading...</Text>
                    :
                <>
                <TotalBalanceBlock totalBalance={totalBalance}/>
                <ScrollView>
            {wallets.map((wallet, index) => <WalletItem key={index} address={wallet.address} balance={wallet.balance} />)}
                </ScrollView>
                </>
            }
        </>
    );
};

export default HomeScreen;
