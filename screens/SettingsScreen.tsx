import React, { useState, useEffect } from 'react'
import { TouchableOpacity, ScrollView, View, ActivityIndicator } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

// Custom Components
import Container from '../Components/layouts/Container'
import Button from '../Components/helpers/Button'
import Text from '../Components/helpers/Text'
import { lightPurple, primary, dark, white, green, darkOrange } from '../Styles/variables'

interface ISettingsScreenProps {
  navigation: {
    navigate: (arg: string) => void
  }
}

const SettingsScreen = (props: ISettingsScreenProps) => {
  const [username, setUsername] = useState(false)
  const firestore = firebase.firestore()
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)

  useEffect(() => {
    userRef.get().then((snapshot) => {
      // @ts-ignore
      setUsername(snapshot.data().Username)
    })
  })

  const handleDevInfoPress = () => {
    props.navigation.navigate("DevInfo")
  }

  const handleFeedbackPress = () => {
    props.navigation.navigate("Feedback")
  }
  
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('Success')
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <Container navigation={props.navigation} style={{ backgroundColor: primary, height: "100%", width: "100%" }}>
      <ScrollView style={{ backgroundColor: primary }} contentContainerStyle={{ height: "100%", width: "100%" }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: "80%", height: "100%", flexDirection: "column", justifyContent: "space-evenly"  }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ height: 40, borderBottomColor: white, borderBottomWidth: 1, width: "100%", alignItems: "center" }}>
                <Text style={{ color: green, fontSize: RFValue(20, 896) }}>Username</Text>
              </View>

              {
                username ? (       
                  <Text style={{ color: white, fontSize: RFValue(18, 896), marginTop: 10}}>{username}</Text>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <ActivityIndicator size="small" />
                  </View>
                )
              }
            </View>

            <View style={{ height: 100 }}>
              <View style={{ height: 40, borderBottomColor:  white, borderBottomWidth: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: RFValue(20, 896), color: green }}>This developer is looking for work!</Text>
              </View>

              <TouchableOpacity style={{ marginTop: 10 }} onPress={handleDevInfoPress}>
                <Text style={{ fontSize: RFValue(16, 896), color: lightPurple, textAlign: "center", textDecorationLine: 'underline' }}>Check me out</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 100 }}>
              <View style={{ height: 40, borderBottomColor:  white, borderBottomWidth: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: RFValue(20, 896), color: green }}>Leave some feedback!</Text>
              </View>

              <TouchableOpacity style={{ marginTop: 10 }} onPress={handleFeedbackPress}>
                <Text style={{ fontSize: RFValue(16, 896), color: lightPurple, textAlign: "center", textDecorationLine: 'underline' }}>Go to form</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 50 }}>
              <Button text="LOGOUT" action={handleLogout} styleWrapper={{ width: "100%", minHeight: 40, maxHeight: 80, backgroundColor: darkOrange, alignItems: "center", justifyContent: "center", borderRadius: 5 }} styleButton={{ color: dark }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}

export default SettingsScreen