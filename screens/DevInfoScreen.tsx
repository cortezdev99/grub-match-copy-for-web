import React from 'react'
import { View, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

// Custom Components
import Container from '../Components/layouts/Container'
import { primary } from '../Styles/variables'
import Links from '../Components/helpers/Links'

interface IDevInfoScreenProps {
  navigation: {
    navigate: (arg: string) => void;
  }
}

export default (props: IDevInfoScreenProps) => {
  const handlePortfolioPress = () => {
    Linking.openURL("https://mc-portfolio-6a5df.firebaseapp.com/").then(() => {
      console.log('Success')
    }).catch(() => {
      alert('Sorry there was an error, Please try again!')
    })
  }

  const handleLinkedInPress = () => {
    Linking.openURL("https://www.linkedin.com/in/michael-cortez-9634781a1/").then(() => {
      console.log('Success')
    }).catch(() => {
      alert('Sorry there was an error, Please try again!')
    })
  }

  const handleInstagramPress = () => {
    Linking.openURL("https://www.instagram.com/cortezdev99/").then(() => {
      console.log('Success')
    }).catch(() => {
      alert('Sorry there was an error, Please try again!')
    })
  }
  
  const handleResumePress = () => {
    Linking.openURL("https://docs.google.com/document/d/1t-wWDeHOpuUgrK6V57rJeL6Q7obu6Vqt3Ktv01Fd8yw/edit?usp=sharing").then(() => {
      console.log('Success')
    }).catch(() => {
      alert('Sorry there was an error, Please try again!')
    })
  }

  const handleCoverLetterPress = () => {
    Linking.openURL("https://docs.google.com/document/d/1x03n_wU4C0oet1ii3IYQXSIYNZQh5FjpD3EdW_6mZMg/edit?usp=sharing").then(() => {
      console.log('Success')
    }).catch(() => {
      alert('Sorry there was an error, Please try again!')
    })
  }

  return (
    <Container navigation={props.navigation} style={{ backgroundColor: primary, height: "100%", width: "100%" }}>
      <ScrollView style={{ backgroundColor: primary, marginBottom: 80 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={{ height: "100%", width: "80%", flexDirection: "column", justifyContent: "space-evenly" }}>
            <Links headingText="Portfolio" buttonText="Check it out!" action={handlePortfolioPress} />
            <Links headingText="Linked In" buttonText="Check it out!" action={handleLinkedInPress} />
            <Links headingText="Instagram" buttonText="Check it out!" action={handleInstagramPress} />
            <Links headingText="Cover Letter" buttonText="Check it out!" action={handleCoverLetterPress} />
            <Links headingText="Resume" buttonText="Check it out!" action={handleResumePress} />
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}