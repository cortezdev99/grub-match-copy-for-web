import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { primary, lightGrey, white } from '../../variables';

export default StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: primary,
    height: "100%",
    marginBottom: 80,
    flexDirection: "column"
  },
  topHeadingTextWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderBottomColor: lightGrey,
    borderBottomWidth: 1
  },
  topHeadingText: {
    fontSize: RFValue(18, 896),
    color: white,
    fontWeight: "700"
  },
})