import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'
import {decode, encode} from 'base-64'

// Custom Components
import TextInput from '../../Components/helpers/TextInput'
import Text from '../../Components/helpers/Text'
import authScreenStyles from '../../Styles/stacks/auth/authScreenStyles';
import Button from '../../Components/helpers/Button'
import buttonStyles from '../../Styles/buttonStyles'
import { lightGrey } from '../../Styles/variables';


// @ts-ignore
if (!global.btoa) { global.btoa = encode }
// @ts-ignore
if (!global.atob) { global.atob = decode }

export default () => {
  const [formToShow, setFormToShow] = useState("REGISTER");
  const [screenTypeText, setScreenTypeText] = useState("Already have an account? Click here to login!")
  const [headerText, setHeaderText] = useState("Register")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAuthTypePress = () => {
    if (formToShow === "LOGIN") {
      setFormToShow("REGISTER")
      setScreenTypeText("Already have an account? Click here to login!")
      setHeaderText("Register")
    } else {
      setFormToShow("LOGIN")
      setScreenTypeText("Need an account? Click here to register!")
      setHeaderText("Login")
    }
  }

  const resetState = () => {
    setEmail(""),
    setPassword(""),
    setUsername(""),
    setHeaderText("Register"),
    setScreenTypeText("Already have an account? Click here to login!"),
    setFormToShow("REGISTER")
  }
  
  const handleSubmit = () => {
    setIsSubmitting(true)
    const firestore = firebase.firestore()

    if (formToShow === "LOGIN") {
      firebase.auth().signInWithEmailAndPassword(email, password).then((resp) => {
        resetState()
        setIsSubmitting(false)
      }).catch(() => {
        alert('It looks like you typed in the wrong email or password, please try again.')
        setIsSubmitting(false)
      })
    } else {
      const usersRef = firestore.collection("users")

      usersRef.where('Username', '==', `${username.toLowerCase().trim()}`).get().then(snapshot => {
        if (snapshot.empty) {
          firebase.auth().createUserWithEmailAndPassword(email, password).then((resp: any) => {
            firestore.collection('users').doc(resp.user.uid).set({
              Username: username.toLowerCase().trim()
            }).then(() => {
              resetState()
              setIsSubmitting(false);
            }).catch(() => {
              alert('Sorry there was an error with our server, please try again!')
            })
          }).catch((err) => {
            setIsSubmitting(false)
            alert("Sorry your account couldn't be created due to the following reason/reasons: " + err)
          })  
        } else {
          setIsSubmitting(false);
          alert("Sorry your account couldn't be created because that username is taken. Please try again.")
        }
      })
    }
  }

  const emailTextInput = (
    <View style={authScreenStyles.textInputWrapper}>
      <TextInput 
        value={email}
        placeholder="Email"
        onChangeText={(val) => setEmail(val)}
        style={ authScreenStyles.textInput }
        autoCapitalize="none"
      />
    </View>
  )

  const passwordTextInput = (
    <View style={authScreenStyles.textInputWrapper}>
      <TextInput 
        value={password}
        placeholder="Password"
        onChangeText={(val) => setPassword(val)}
        style={ authScreenStyles.textInput }
        autoCapitalize="none"
        secureTextEntry={true}
        onSubmitEditing={handleSubmit}
      />
    </View>
  )

  const usernameTextInput = (
    <View style={authScreenStyles.textInputWrapper}>
      <TextInput 
        value={username}
        placeholder="Username"
        onChangeText={(val) => setUsername(val)}
        style={ authScreenStyles.textInput }
        autoCapitalize="none"
      />
    </View>
  )

  const handleInputsToBeRendered = () => {
    if (formToShow === "LOGIN") {
      return (
        <View>
            { emailTextInput }  

            { passwordTextInput }
        </View>
      )
    } else {
      return (
        <View>
            { usernameTextInput }

            { emailTextInput }

            { passwordTextInput }
        </View>
      )
    }
  }


  return (
    <ScrollView style={ authScreenStyles.container } contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "80%", height: "100%", justifyContent: "space-evenly" }}>
          <View style={{ borderBottomColor: lightGrey, minHeight: 40, maxHeight: 80, borderBottomWidth: 1}}>
            <Text style={ authScreenStyles.headerText }>
              {headerText}
            </Text>
          </View>

          {handleInputsToBeRendered()}

          <TouchableOpacity onPress={handleAuthTypePress} style={authScreenStyles.screenTextWrapper}>
            <Text style={ authScreenStyles.text }>{screenTypeText}</Text>
          </TouchableOpacity>

          {
            isSubmitting ? (
              <Button
                text={"Submitting..."}
                action={handleSubmit}
                styleWrapper={buttonStyles.submittingButtonWrapper}
                styleButton={buttonStyles.submittingButton}
                disabled={true}
              />
            ) : (
              <Button
                text={headerText}
                action={handleSubmit}
                styleWrapper={buttonStyles.buttonWrapper}
                styleButton={buttonStyles.button}
              />
            )
          }
        </View>
      </View>
    </ScrollView>
  )
}