import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import axios from 'axios'
import * as Location from 'expo-location'
import { RFValue } from 'react-native-responsive-fontsize'

// Custom Components
import Container from '../Components/layouts/Container'
import Text from '../Components/helpers/Text'
import HomeScreenContext from '../contexts/HomeScreenContext'
import { yelp_api_key } from '../config/yelpConfig'
import { primary, white, darkOrange, lightPurple } from '../Styles/variables'
import Swiper from '../Components/helpers/Swiper'
import SpinWheelScreen from './SpinWheelScreen'

interface IHomeScreenProps {
  navigation: {
    navigate: (arg: string) => void
  }
}


const HomeScreen = (props: IHomeScreenProps) => {
  const [location, setLocation] = useState()
  const [restaurants, setRestaurants] = useState([] as any)
  const [initializing, setInitializing] = useState(true)
  const [noAccessLocation, setNoAccessLocation] = useState(false)
  const { onSpinner, setOnSpinner } = useContext(HomeScreenContext)
   
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied, we need access to your location to find restaurants in your area.');
        setNoAccessLocation(true)
      } else {
        setNoAccessLocation(false)
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        handleGettingRestaraunts(location)
      }
    })();
  }, []);
  
  const handleGettingRestaraunts = (location: any) => {
    if (restaurants.length === 0 && initializing) {
      axios.get(`https://api.yelp.com/v3/businesses/search?term=restaurant&longitude=${location.coords.longitude}&latitude=${location.coords.latitude}&limit=50`, {
        headers: {
          Authorization: `Bearer ${yelp_api_key}`
        }
      }).then((resp) => {
        setRestaurants(resp.data.businesses),
        setInitializing(false)
      }).catch((err) => {
        console.log(err)
      })
    } else {
      return null
    }
  }

  return (
    <Container navigation={props.navigation}>
      <ScrollView style={{ backgroundColor: primary }} contentContainerStyle={{ flex: 1 }}>
        {
          onSpinner ? (
            <View style={{ height: "100%", width: "100%" }}>
              <SpinWheelScreen />
            </View>
          ) : (
            <View style={{ height: "100%", width: "100%" }}>
              {
                restaurants.length > 0 ? (
                  <View style={{ height: "100%", width: "100%" }}>
                    <Swiper restaurants={restaurants} location={location} setRestaurants={setRestaurants} navigation={props.navigation} />
                  </View>
                ) : (
                  <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    {
                      noAccessLocation ? (
                        <View style={{ width: "80%", height: "100%", alignItems: "center", justifyContent: "space-evenly" }}>
                          <Text style={{ fontSize: RFValue(20, 896), color: darkOrange, textAlign: "center" }}>We need access to location if you want to use this feature!</Text>

                          <Text style={{ fontSize: RFValue(20, 896), color: lightPurple, textAlign: "center" }}>You can change this in your settings.</Text>
                        </View>
                      ) : (
                        <ActivityIndicator size="large" color={white} />
                      )
                    }
                  </View>
                )
              }
            </View>
          )
        }
      </ScrollView>
    </Container>
  )
}

export default HomeScreen