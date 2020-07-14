import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { lightGrey, white, green } from '../../variables';

export default StyleSheet.create({
  container: {
    backgroundColor: "#33363a",
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  textInputWrapper: {
    marginTop: 20,
    marginBottom: 20
  },
  textInput: {
    backgroundColor: white,
    borderRadius: 20,
    maxHeight: 80,
    minHeight: 40,
    paddingLeft: 20
  },
  screenTextWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    width: "100%",
    color: green,
    fontSize: RFValue(18, 896),
    textAlign: "center",
  },
  text: {
    color: white,
    minHeight: 40,
    maxHeight: 80,
    fontSize: RFValue(15, 896)
  }
})