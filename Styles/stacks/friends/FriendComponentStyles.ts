import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { white } from '../../variables';

export default StyleSheet.create({
  friendContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingTop: 40
  },
  friendsListContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 60
  },
  friendsListTextWrapper: {
    width: "60%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  friendsListText: {
    height: "100%",
    fontSize: RFValue(16, 896),
    color: white,
    fontWeight: "500"
  },
  friendsListButtonWrapper: {
    width: "20%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  friendsListButtonText: {
    color: white,
    fontSize: RFValue(18, 896)
  },
  sharedFriendsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 60
  },
  sharedFriendsText: {
    height: "100%",
    fontSize: RFValue(16, 896),
    color: white,
    fontWeight: "500"
  }
})