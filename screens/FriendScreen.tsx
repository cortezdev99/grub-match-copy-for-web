import React from 'react'
import { View, ScrollView } from 'react-native'
import 'firebase/firestore'

// Custom Components
import Container from '../Components/layouts/Container'
import Text from '../Components/helpers/Text'
import FriendScreenStyles from '../Styles/stacks/friends/FriendScreenStyles'
import Friends from '../Components/helpers/Friends'
import Search from '../Components/helpers/Search'
import { green, lightGrey } from '../Styles/variables'


interface IFriendScreenProps {
  navigation: {
    navigate: (arg: string) => void
  }
}

const FriendScreen = (props: IFriendScreenProps) => {
  const {
    scrollViewContainer,
    topHeadingTextWrapper,
    topHeadingText,
    bottomHeadingTextWrapper,
    bottomHeadingText
  } = FriendScreenStyles

  return (
    <Container navigation={props.navigation}>
      <ScrollView style={ scrollViewContainer } contentContainerStyle={{  flexGrow: 1 }}>
        <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
          <View style={{ width: "80%", height: "100%",justifyContent: "space-evenly" }}>
            <View>
              <View style={ [topHeadingTextWrapper, { height: 60, borderBottomColor: lightGrey, borderBottomWidth: 1 }] } >
                <Text style={ [topHeadingText, { textAlign: "center", color: green, width: "100%" }] }>
                  Add a friend!
                </Text>
              </View>

              <View style={{ marginTop: 50 }}>
                <Search searchType="ADD_FRIEND" />
              </View>
            </View>

            <View style={{ paddingTop: 100 }}>
              <View style={ bottomHeadingTextWrapper }>
                <Text style={ [bottomHeadingText, { color: green }] }>Current Friends!</Text>
              </View>

              <Friends actionType="DELETE_FRIEND" />
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}

export default FriendScreen
