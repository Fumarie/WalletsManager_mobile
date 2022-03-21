const Web3 = require("web3")
// const web3 = new Web3("https://speedy-nodes-nyc.moralis.io/aa352ddd9a91bb5aa1ab6b34/polygon/mumbai")
const web3 = new Web3("https://polygon-rpc.com/")

class WalletsController {
    constructor() {
        this.accounts = (async () => {
            const accounts = await this.getAccounts()
           return accounts
        })()
        this.balances = (async () => {
            const balances = await this.getBalances()
            return balances
        })()
    }

    async getAccounts() {
        const walletsString = process.env.wallets
        const parsedWallets = walletsString.split(" ").map(wallet => wallet)

        const wallets = []

        const loadAccount = async (wallet) => {
            const account = await web3.eth.accounts.privateKeyToAccount(wallet)
            return account
        }

        for(let wallet of parsedWallets) {
            wallets.push(await loadAccount(wallet))
        }

        return wallets
    }

    getBalances = async () => {
        const accounts = await this.accounts
        const balances = []

        for(let account of accounts) {
            const balance = await this.getBalance(account.address)
            const etherBalance = this.weiToEther(balance)
            console.log(etherBalance)
            balances.push({address: account.address, balance: etherBalance})
        }

        return balances
    }

    getBalance = async (address) => {
        const balance = await web3.eth.getBalance(address)
        return balance
    }

    weiToEther = (weiBalance) => {
        const etherBalance = web3.utils.fromWei(weiBalance, "ether")
        return etherBalance
    }

    updateBalance = async (req, res) => {
        try {
            const {address} = req.body
            const balance = await this.getBalance(address)
            const ethBalance = this.weiToEther(balance)
            console.log({address, balance: ethBalance})
            res.status(200).json({address, balance: ethBalance})
        } catch (e) {
            res.status(400).json({message: 'Error updating wallet'})
        }
    }

    refreshBalances = async (req, res) => {
        try {
            console.log("Refreshing")
            this.balances = await this.getBalances()
            const balances = await this.balances
            console.log("WALLETS UPDATED")
            res.status(200).json(balances)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Error refreshing wallets'})
        }
    }

    getAllBalances = async (req, res) => {
        try {

            const balances = await this.balances
            console.log("WALLETS READY")
            res.status(200).json(balances)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Error getting wallets'})
        }
    }

    receiveTokens = async (req, res) => {
        try {
            const receivedWallets = []
            console.log(req.body)
            const {fromWallets, toAddress, leftValue, minimalSend, gasPrice} = req.body

            for(let wallet of fromWallets) {
                const balance = await this.getBalance(wallet.address)
                const etherBalance = this.weiToEther(balance)
                const minimalBalance = +leftValue + +minimalSend
                console.log("eth min", etherBalance, minimalBalance)
                if(+etherBalance > +minimalBalance) {
                    const sendValueEther = +etherBalance - +leftValue
                    const sendValueWei = web3.utils.toWei(sendValueEther.toString(), "ether")
                    const gasPriceWei = web3.utils.toWei(gasPrice, "Gwei")
                    try {
                        const status = await this.sendTx(sendValueWei, wallet.address, toAddress, gasPriceWei)
                        receivedWallets.push(await this.updateWallet(wallet.address, status))
                    } catch (e) {
                        receivedWallets.push(await this.updateWallet(wallet.address, "Error"))
                    }
                } else {
                    receivedWallets.push(await this.updateWallet(wallet.address, "Not enough balance"))
                }
            }
            console.log("Received", receivedWallets)
            res.status(200).json(receivedWallets)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Error receive method'})
        }
    }

    sendTx = async (value, fromAddress, toAddress, gasPrice) => {
        const tx = {
            value,
            from: fromAddress,
            to: toAddress,
            gas: 100000,
            gasPrice: gasPrice
        }
        console.log(tx)

        const accounts = await this.accounts

        const account = accounts.find(account => account.address === fromAddress)

        console.log("private", account.privateKey)

        const status = await web3.eth.accounts.signTransaction(tx, account.privateKey).then(async signedTx => {
            console.log("signedTx", signedTx)
            const status = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((resp) => {
                console.log(resp)
                return "Done"
            }).catch((e) => {
                console.log(e)
                return "Error"
            })
            return status
        }).catch((e) => {
            console.log(e)
            return "Error"
        })
        console.log(status)
        return status
    }

    updateWallet = async (address, status) => {
        const weiBalance = await this.getBalance(address)
        const etherBalance = this.weiToEther(weiBalance)
        return {address, status, balance: etherBalance}
    }

}

module.exports = new WalletsController()
