import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { primary, lightGrey, white } from '../../variables';

export default StyleSheet.create({
  scrollViewContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: primary,
    height: "100%",
    marginBottom: 80,
    flexDirection: "column"
  },
  textInputWrapper: {
    flexDirection: "row"
  },
  textInput: {
    backgroundColor: white,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    height: 40,
    paddingLeft: 20,
    width: "80%"
  },
  topHeadingTextWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 60
  },
  topHeadingText: {
    fontSize: RFValue(18, 896),
    color: white,
    fontWeight: "700"
  },
  searchIconWrapper: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center"
  },
  queryResultFriendOuterWrapper: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "80%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: white,
    borderRadius: 20,
    top: -38,
    zIndex: -10
  },
  queryResultFriendInnerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderTopColor: lightGrey,
    borderTopWidth: 1,
    paddingTop: 15
  },
  queryResultFriendText: {
    fontSize: RFValue(15, 896),
    width: "80%"
  },
  queryResultFriendButtonsWrapper: {
    flexDirection: "row",
    width: "20%",
    justifyContent: "flex-end"
  },
  queryResultNoUserOuterWrapper: {
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "80%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: white,
    borderRadius: 20,
    top: -38,
    zIndex: -10
  },
  queryResultNoUserInnerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopColor: lightGrey,
    borderTopWidth: 1,
    paddingTop: 10
  },
  queryResultNoUserText: {
    fontSize: RFValue(15, 896),
    width: "80%"
  },
  queryResultNoUserButtonWrapper: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomHeadingTextWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderBottomColor: lightGrey,
    borderBottomWidth: 1
  },
  bottomHeadingText: {
    fontSize: RFValue(18, 896),
    color: white,
    fontWeight: "700"
  }
})