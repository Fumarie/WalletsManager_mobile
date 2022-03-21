import React, {useMemo} from "react"
import {StyleSheet, Text, View} from "react-native"
import {cutBalance} from "../utils/wallets"
import SvgComponent from "../assets/PolygonIcon";

interface TotalBalanceBlockProps {
  totalBalance: string
}

const TotalBalanceBlock:React.FC<TotalBalanceBlockProps> = ({totalBalance}) => {

  const formattedBalance = useMemo(() => cutBalance(totalBalance), [totalBalance])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your total balance</Text>
      {/*<View style={styles.chainIcon} >*/}
      {/*  <SvgComponent />*/}
      {/*</View>*/}
      <Text style={{...styles.title, ...styles.balance}}>{formattedBalance} MATIC</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "25%",
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
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
  chainIcon: {
    height: 30,
    width: 30
  }
})

export default TotalBalanceBlock
