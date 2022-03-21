import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import axios from "axios";

interface IWallet {
    address: string,
    balance: string
}

interface IGasPricesList {
    safeLow: number,
    standard: number,
    fast: number,
    fastest: number
}

interface WalletStateInterface {
    wallets: IWallet[],
    isLoading: boolean,
    error: string,
    gasPriceList: IGasPricesList | null,
    gasLoading: boolean,
    received: receivedWallets[],
    receiveLoading: boolean
}

const initialState: WalletStateInterface = {
    wallets: [],
    isLoading: false,
    error: "",
    gasPriceList: null,
    gasLoading: false,
    received: [],
    receiveLoading: false
}

export const fetchWalletsList = createAsyncThunk(
    "wallets/fetchWalletsList",
    async (_, thunkApi) => {
        try {
            const walletsList = await axios.get<IWallet[]>("http://10.0.2.2:7070/api/wallets").then(resp => resp.data)
            return walletsList.sort((a,b) => {
                if(a.balance < b.balance)
                    return 1
                else return -1

            })
        } catch (e) {
            console.log(e)
        }
    },
)

export const refreshBalances = createAsyncThunk(
    "wallets/refreshBalances",
    async (_, thunkApi) => {
        console.log("REFRESH")
        try {
            console.log("REFRESH BALANCES")
            const walletsList = await axios.get<IWallet[]>("http://10.0.2.2:7070/api/wallets/refreshBalances").then(resp => resp.data)
            console.log("walletsList", walletsList)
            return walletsList.sort((a,b) => {
                if(a.balance < b.balance)
                    return 1
                else return -1
            })
        } catch (e) {
            console.log(e)
        }
    },
)


export const updateBalance = createAsyncThunk(
    "wallets/updateBalance",
    async (address: string, thunkApi) => {
        try {
            console.log("UPDATE BALANCE", address)
            const wallet = await axios.post<IWallet>("http://10.0.2.2:7070/api/wallets/updateBalance", {address}).then(resp => resp.data)
            console.log("updatedTo", wallet)
            return wallet
        } catch (e) {
            console.log(e)
        }
    },
)


export const fetchGasPrice = createAsyncThunk(
    "wallets/getGasPrice",
    async (_, thunkApi) => {
        try {
            const gasPricesList = await axios.get("https://gasstation-mainnet.matic.network/").then(response => response.data)
            console.log(gasPricesList)
            return gasPricesList
        } catch (e) {
            console.log(e)
        }
    }
)

export interface receiveTokensDataInterface {
    fromWallets: IWallet[],
    toAddress: string,
    leftValue: string,
    minimalSend: string,
    gasPrice: string
}

interface receivedWallets extends IWallet{
    status: "Done" | "Not enough balance" | "Error"
}

export const receiveTokens = createAsyncThunk(
    "wallets/receiveTokens",
    async (data:receiveTokensDataInterface, thunkApi) => {
        try {
            const updatedWallets = await axios.post<receivedWallets[]>("http://10.0.2.2:7070/api/wallets/receiveTokens", data).then(resp => resp.data)
            console.log("updatedWallets", updatedWallets)
            thunkApi.dispatch(updateBalance(data.toAddress))
            return updatedWallets
        } catch (e) {
            console.log(e)
        }
    }
)

export const walletsSlice = createSlice({
    name: "wallets",
    initialState,
    reducers: {
        clearReceive(state) {
            state.received = []
        }
    },
    extraReducers: {
        [fetchWalletsList.pending.type]: (state) => {
            state.isLoading = true
        },
        [fetchWalletsList.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
        [fetchWalletsList.fulfilled.type]: (state, action:PayloadAction<IWallet[]>) => {
            state.isLoading = false
            state.wallets = action.payload
        },

        [refreshBalances.pending.type]: (state) => {
            state.isLoading = true
        },
        [refreshBalances.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
        [refreshBalances.fulfilled.type]: (state, action:PayloadAction<IWallet[]>) => {
            state.isLoading = false
            state.wallets = action.payload
        },

        [fetchGasPrice.pending.type]: (state) => {
            state.gasLoading = true
        },
        [fetchGasPrice.rejected.type]: (state, action: PayloadAction<string>) => {
            state.gasLoading = false
            state.error = action.payload
        },
        [fetchGasPrice.fulfilled.type]: (state, action:PayloadAction<IGasPricesList>) => {
            state.gasLoading = false
            state.gasPriceList = {
                safeLow: action.payload.safeLow,
                standard: action.payload.standard,
                fast: action.payload.fast,
                fastest: action.payload.fastest
            }
        },
        [receiveTokens.pending.type]: (state) => {
            state.receiveLoading = true
        },
        [receiveTokens.rejected.type]: (state, action: PayloadAction<string>) => {
            state.receiveLoading = false
            state.error = action.payload
        },
        [receiveTokens.fulfilled.type]: (state, action:PayloadAction<receivedWallets[]>) => {
            state.receiveLoading = false
            state.received = action.payload
            const newWallets:IWallet[] = action.payload.map(receivedWallet => {
                return {address: receivedWallet.address, balance: receivedWallet.balance}
            })
            newWallets.forEach(wallet => {
                const index = state.wallets.findIndex(elem => elem.address === wallet.address)
                state.wallets[index] = wallet
            })
        },
        [updateBalance.fulfilled.type]: (state, action:PayloadAction<IWallet>) => {
            const updatedWallet = state.wallets.findIndex(wallet => wallet.address === action.payload.address)
            state.wallets[updatedWallet] = action.payload
        },
    },
})

export const { clearReceive } = walletsSlice.actions

export default walletsSlice.reducer
