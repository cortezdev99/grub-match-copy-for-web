import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { View, ActivityIndicator } from 'react-native'
import axios from 'axios'

// Custom Components
import Container from '../Components/layouts/Container'
import Swiper from '../Components/helpers/Swiper'
import { white, primary } from '../Styles/variables';
import { yelp_api_key } from '../config/yelpConfig'


interface IMultiPartyScreenProps {
  route: {
    params: any;
  }
  navigation: {
    navigate: (arg: string) => void;
  }
}

export default (props: IMultiPartyScreenProps) => {
  const { partyId } = props.route.params
  const [restaurants, setRestaurants] = useState([] as any)
  const [location, setLocation] = useState()
  const firestore = firebase.firestore()
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)

  useEffect(() => {
    handleGettingRestaurants()
  })

  const handleGettingRestaurants = () => {
    if (!location) {
      userRef.collection('multiParty').where('partyId', '==', partyId).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          setLocation(doc.data().location)
          if (restaurants.length === 0) {
            axios.get(`https://api.yelp.com/v3/businesses/search?term=food&longitude=${doc.data().location.coords.longitude}&latitude=${doc.data().location.coords.latitude}&limit=50`, {
              headers: {
                Authorization: `Bearer ${yelp_api_key}`
              }
            }).then((resp) => {
              setRestaurants(resp.data.businesses)
            }).catch((err) => {
              console.log(err)
            })
          }
        })
      })
    }
  }

  return (
    <Container navigation={props.navigation}>
      <View style={{ height: "100%", width: "100%", backgroundColor: primary }}>
        {
          restaurants.length > 0 ? (
            <Swiper 
              restaurants={restaurants}
              location={location}
              partyId={partyId}
              navigation={props.navigation}
            />
          ) : (
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator size="large" color={white} />
            </View>
          )
        }
      </View>
    </Container>
  )
}