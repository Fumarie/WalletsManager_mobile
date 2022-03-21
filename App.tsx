import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useEffect} from "react";
import {fetchWalletsList, refreshBalances} from "./redux/Reducers/walletsSlice";
import {store, useAppDispatch, useAppSelector} from "./redux/store";
import {Provider} from "react-redux";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import WalletScreen from "./screens/WalletScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import {Button} from "react-native";

const Stack = createNativeStackNavigator();

const AppInner = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchWalletsList())
    }, [])

    const {isLoading} = useAppSelector(state => state.wallets)

    const refresh = async () => {
        console.log('dispatched')
        await dispatch(refreshBalances())
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        options={{
                            headerRight: () => (
                                <Button
                                    onPress={() => refresh()}
                                    title={isLoading ? "Refreshing" : "Refresh"}
                                    disabled={isLoading}
                                    color="black"
                                />)
                        }}
                        name="Home" component={HomeScreen} />
                    <Stack.Screen name="Wallet" component={WalletScreen} />
                    <Stack.Screen name="Transactions" component={TransactionsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )

}

export default function App() {
    return (
        <Provider store={store}>
            <AppInner />
        </Provider>
    )
}
