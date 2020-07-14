import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { primary, white } from './variables';

export default StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  scrollableModal: {
    height: "40%"
  },
  closeButtonWrapper: {
    backgroundColor: primary,
    minHeight: 45,
    maxHeight: 80,
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  closeButtonText: {
    color: white,
    textAlign: "right"
  },
  contentWrapper: {
    backgroundColor: primary,
    paddingLeft: 15,
    paddingRight: 15
  },
  restrauntHeadingWrapper: {
    minHeight: 44,
    maxHeight: 80,
    borderBottomColor: white,
    borderBottomWidth: 1
  },
  restrauntHeadingText: {
    color: white,
    textAlign: "center",
    fontSize: RFValue(18, 896),
    fontWeight: "800"
  },
  restrauntTypesWrapper: {
    marginTop: 10,
    minHeight: 60,
    maxHeight: 80,
    justifyContent: "space-between"
  },
  restrauntTypesHeadingWrapper: {
    minHeight: 30,
    maxHeight: 80,
    minWidth: 150,
    maxWidth: 250,
    borderBottomWidth: 1,
    borderBottomColor: white,
    alignSelf: "center"
  },
  restrauntTypesHeadingText: {
    color: white,
    fontSize: RFValue(17, 896),
    textAlign: "center",
    fontWeight: "600"
  },
  restrauntTypesCategoriesWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  miscDetailsWrapper: {
    marginTop: 20
  },
  miscDetailsHeaderWrapper: {
    minHeight: 30,
    maxHeight: 80,
    minWidth: 130,
    maxWidth: 250,
    borderBottomWidth: 1,
    borderBottomColor: white,
    alignSelf: "center"
  },
  miscDetailsHeaderText: {
    color: white,
    fontSize: RFValue(17, 896),
    textAlign: "center",
    fontWeight: "600"
  },
  miscDetailsIsOpenWrapper: {
    marginTop: 10,
    minHeight: 30,
    maxHeight: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  miscDetailsWebsiteWrapper: {
    minHeight: 30,
    maxHeight: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  miscDetailsPriceWrapper: {
    minHeight: 30,
    maxHeight: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  miscDetailsLocationWrapper: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  miscDetailsPhoneWrapper: {
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  reviewsWrapper: {
    backgroundColor: primary,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  reviewsHeaderWrapper: {
    minHeight: 30,
    maxHeight: 80,
    minWidth: 100,
    maxWidth: 250,
    borderBottomWidth: 1,
    borderBottomColor: white
  },
  reviewsHeaderText: {
    color: white,
    fontSize: RFValue(17, 896),
    textAlign: "center",
    fontWeight: "600"
  },
  reviewsCountWrapper: {
    marginTop: 20,
    minHeight: 20,
    maxHeight: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  reviewWrapper: {
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomColor: white,
    borderBottomWidth: 1
  },
  reviewHeaderText: {
    color: white, textAlign: "center", paddingBottom: 10,
    fontWeight: "600"
  },
  reviewBottomText: {
    color: white, textAlign: "center"
  },
  defaultTextUnderline: {
    color: white, textDecorationLine: "underline"
  },
  defaultText: {
    color: white,
    fontSize: RFValue(16, 896)
  }
})