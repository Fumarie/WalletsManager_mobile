export const formatAddress = (address: string) => {
    const firstPart = address.slice(0, 5)
    const lastPart = address.slice(-4)
    const formattedAddress = `${firstPart}...${lastPart}`
    return formattedAddress
}

export const cutBalance = (balance: string) => {
    const numericBalance = +balance
    const cutBalance = numericBalance.toFixed(4)
    return cutBalance.toString()
}
