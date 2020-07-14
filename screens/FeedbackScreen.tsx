import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Container from '../Components/layouts/Container'
import { primary, white, green, lightPurple, dark, darkPurple, darkOrange } from '../Styles/variables'
import Button from '../Components/helpers/Button'
import TextInput from '../Components/helpers/TextInput'
import firebase from 'firebase'
import { RFValue } from 'react-native-responsive-fontsize'
import 'firebase/firestore'
// import 'firebase/auth'

interface IFeedbackScreenProps {
  navigation: {
    navigate: (arg: string) => void;
  }
}

export default (props: IFeedbackScreenProps) => {
  const [question1, setQuestion1] = useState("")
  const [question2, setQuestion2] = useState("")
  const [question3, setQuestion3] = useState("")
  const [initializing, setInitializing] = useState(true)
  const [username, setUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [numOfFeedbacks, setNumOfFeedbacks] = useState(4)
  const [noMoreFeedback, setNoMoreFeedback] = useState(false)

  const firestore = firebase.firestore()
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)

  useEffect(() => {
    userRef.get().then((snapshot) => {
      // @ts-ignore
      setUsername(snapshot.data().Username)

      firestore.collection('feedback').where("username", "==", username).onSnapshot((snapshot) => {
        if (!snapshot.empty && initializing) {
          setInitializing(false)
          setNumOfFeedbacks(numOfFeedbacks - snapshot.docs.length)

          if (snapshot.docs.length === 4) {
            setNoMoreFeedback(true)
          }
        }
      })
    })
  })

  const handleSubmit = () => {
    setIsSubmitting(true)

    if (question1 === "" && question2 === "" && question3 === "") {
      alert('I gotta have something to read! Type a message and try again.')
      setIsSubmitting(false)
    } else if (numOfFeedbacks === 0) {
      alert('Sorry you have already submitted all the feedback you can for now!')
      setIsSubmitting(false)
    } else {
      firestore.collection("feedback").add({
        username: username,
        future: question1,
        rate: question2,
        improve: question3
      }).then(() => {
        setQuestion1("")
        setQuestion2("")
        setQuestion3("")
        setIsSubmitting(false)
        setSubmitted(true)
      }).catch(() => {
        alert('Sorry there was an error, please try again!')
        setIsSubmitting(false)
      })
    }
  }

  const _handleJSXToBeRendered = (headingText: string, handleSubmitEditing: boolean | null, val: string, setVal: (arg: string) => void) => {
      return (
        <View style={{ width: "100%", height: 100 }}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: RFValue(18, 896), color: green, textAlign: "center" }}>
              { headingText }
            </Text>
          </View>

          <View style={{ marginTop: 20, marginBottom: 20 }}>
            {
              handleSubmitEditing ? (
                <TextInput 
                  value={val}
                  placeholder="Answer"
                  onChangeText={setVal}
                  onSubmitEditing={handleSubmit}
                />
              ) : (
                <TextInput 
                  value={val}
                  placeholder="Answer"
                  onChangeText={setVal}
                />
              )
            }
            
          </View>
        </View>
      )
  }

  return (
    <Container navigation={props.navigation}>
      <ScrollView style={{ backgroundColor: primary }} contentContainerStyle={{ flexGrow: 1, marginBottom: 80 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {
            submitted ? (
              <View style={{ height: "100%", width: "80%", justifyContent: "space-evenly", alignItems: "center" }}>
                <Text style={{ color: green, fontSize: RFValue(30, 896), textAlign: "center" }}>Thank you for giving me feedback!</Text>
                <Text style={{ fontSize: RFValue(30, 896), textAlign: "center", color: lightPurple }}>{numOfFeedbacks > 0 ? "You can do this " + `${numOfFeedbacks} ` + "more " + `${numOfFeedbacks > 1 ? ("times") : ("time") }!` : "You can not submit anymore at this time."}</Text>
              </View>
            ) : (
              <View style={{ height: "100%", width: "80%", justifyContent: "space-evenly", alignItems: "center" }}>
                {
                  noMoreFeedback ? (
                    <View style={{ height: "100%", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
                      <Text style={{ color: green, fontSize: RFValue(30, 896), textAlign: "center"}}>Thank you for your feedback!</Text>
                      <Text style={{ fontSize: RFValue(30, 896), textAlign: "center", color: lightPurple }}>You can not submit anymore at this time.</Text>
                    </View>
                  ) : (
                    <View style={{ height: "100%", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
                      {
                        _handleJSXToBeRendered("What would you like to see in the future?", null, question1, (val) => setQuestion1(val))
                      }

                      {
                        _handleJSXToBeRendered("Do you like the app? Why or why not?", null, question2, (val) => setQuestion2(val))
                      }

                      {
                        _handleJSXToBeRendered("If theres one thing you'd improve what would it be?", true, question3, (val) => setQuestion3(val))
                      }
            
                      {
                        isSubmitting ? (
                          <View style={{ width: "100%", height: 100, alignItems: "center", justifyContent: "center" }}>
                            <Button text="Submitting..." styleWrapper={{ backgroundColor: green, width: "100%", height: "50%", alignItems: "center", justifyContent: "center", borderRadius: 5 }} styleButton={{ color: dark, fontSize: 18 }} />
                          </View>
                        ) : (
                          <View style={{ width: "100%", height: 100, alignItems: "center", justifyContent: "center" }}>
                            <Button text="Submit" action={handleSubmit} styleWrapper={{ backgroundColor: darkOrange, width: "100%", height: "50%", alignItems: "center", justifyContent: "center", borderRadius: 5 }} styleButton={{ color: dark, fontSize: 18 }} />
                          </View>
                        )
                      }
                    </View>
                  )
                }
              </View>
            )
          }
        </View>
      </ScrollView>
    </Container>
  )
}