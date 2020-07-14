import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { primary, white } from './variables';

export default StyleSheet.create({
  closeButtonWrapper: {
    height: 60,
    padding: 15,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  closeButtonText: {
    color: white,
    alignSelf: "flex-end"
  },
  contentWrapper: {
    paddingLeft: 15,
    paddingRight: 15
  },
  restrauntWrapper: {
    width: "100%",
    height: 60,
    backgroundColor: primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50
  },
  restrauntTitleText: {
    color: white,
    fontSize: RFValue(18, 896),
    textAlign: "center"
  },
  noRestrauntsLikedWrapper: {
    height: "125%",
    justifyContent: "center"
  },
  noRestrauntsLikedTopText: {
    color: "green",
    fontSize: RFValue(25, 896),
    textAlign: "center"
  },
  noRestrauntsLikedBottomText: {
    paddingTop: 50,
    color: white,
    fontSize: RFValue(20, 896),
    textAlign: "center"
  },
  defaultText: {
    color: white,
    fontSize: RFValue(16, 896)
  }
})