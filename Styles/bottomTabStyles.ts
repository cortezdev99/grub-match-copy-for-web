import { StyleSheet } from 'react-native'
import { dark, white } from './variables';

export default StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    backgroundColor: dark,
    paddingBottom: 15,
    position: "absolute",
    bottom: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  textInput: {
    color: white
  }
})