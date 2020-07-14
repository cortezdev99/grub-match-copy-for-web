import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { highlight, lightGrey, white, lightPurple, dark, green, darkOrange } from './variables';

export default StyleSheet.create({
  buttonWrapper: {
    backgroundColor: darkOrange,
    minHeight: 40,
    maxHeight: 80,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
   color: dark,
   fontSize: RFValue(20, 896),
   fontWeight: "700"
  },
  submittingButtonWrapper: {
    backgroundColor: green,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  submittingButton: {
    color: dark,
    fontSize: RFValue(20, 896),
    fontWeight: "700"
  }
})