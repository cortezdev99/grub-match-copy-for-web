import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'
import axios from 'axios'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

// Custom Components
import Text from '../helpers/Text'
import FriendScreenStyles from '../../Styles/stacks/friends/FriendScreenStyles'
import { dark } from '../../Styles/variables'
import { yelp_api_key } from '../../config/yelpConfig'

interface ISearchProps {
  searchType: string;
  action?: any;
  setAction?: any;
  location?: any;
}

export default (props: ISearchProps) => {
  const firestore = firebase.firestore()
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)
  const [ username, setUsername ] = useState("")
  const [ friend, setFriend ] = useState("")
  const [ searching, setSearching ] = useState(false)
  const [ noUsername, setNoUsername ] = useState("")
  const [ restaurant, setRestaurant ] = useState("")
  const [ queryedRestaurantName, setQueryedRestaurantName ] = useState("")
  const [ searched, setSearched ] = useState(false)
  const [ restaurantExists, setRestaurantExists ] = useState(false)
  const [ resp, setResp ] = useState({} as any)
  const noRestraunt = "Sorry we could not find that restaurant."

   useEffect(() => {

    return () => {
      resetState()
    }
   }, [])

  const {
    textInputWrapper,
    textInput,
    searchIconWrapper,
    queryResultFriendOuterWrapper,
    queryResultFriendInnerWrapper,
    queryResultFriendText,
    queryResultFriendButtonsWrapper,
    queryResultNoUserOuterWrapper,
    queryResultNoUserInnerWrapper,
    queryResultNoUserText,
    queryResultNoUserButtonWrapper
  } = FriendScreenStyles

  const handleSearchSubmit = () => { 
    setSearching(true)
    firestore.collection('users').where('Username', '==', `${username.toLowerCase().trim()}`).get().then((snapshot: any) => {
      if (snapshot.empty) {
        setSearching(false)
        setFriend("")
        setNoUsername("Sorry that username doesn't exist...")
      } else {
        setSearching(false)
        setFriend(`${username.toLowerCase().trim()}`)
        setNoUsername("")
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }


  const resetState = () => {
    setFriend("")
    setUsername("")
    setNoUsername("")
    setResp({})
    setRestaurantExists(false)
    setRestaurant("")
    setQueryedRestaurantName("")
    setSearched(false)
  }

  const setFriendsToSendLink = () => {
    userRef.get().then((snapshot) => {
      const currentUserData = snapshot.data()
      if (props.action.includes(username.toLowerCase().trim())) {
        resetState()
        alert("You're already sending a code to that user!")
        // @ts-ignore
      } else if (username.toLowerCase().trim() === currentUserData.Username) {
        resetState()
        alert('You can not send a code to yourself!')
      } else {
        var currentState = props.action
        currentState.push(username.toLowerCase().trim())
        props.setAction([...currentState])
        resetState()
      }
    }).catch(() => {
      resetState()
      alert('Sorry there was an error, please try again.')
    })
  }

  const addFriend = () => {
    userRef.get().then((snapshot) => {
      const currentUserData = snapshot.data()
      // @ts-ignore
      if (username.toLowerCase().trim() === currentUserData.Username) {
        alert("Sorry you can't add yourself as a friend...")
        resetState()
      } else {
         userRef.collection('friends').where('Username', '==', username.toLowerCase().trim()).get().then((snapshot) => {
          if (snapshot.empty) {
            userRef.collection('friends').add({
              Username: username.toLowerCase().trim()
            }).then(() => {
              return resetState()
            }).catch(() => {
              alert('Sorry there was an error on our end. Please try again!')
            })
          } else {
            alert('Opps! That user is already your friend.')
            resetState()
          }
        }).catch(() => {
          alert('Sorry there was an error on our end. Please try again!')
        })
      }
    })
  }

  const handleAddingRestaurant = () => {
    props.setAction(resp)
    resetState()
  }

  const handleSearchingForRestaurant = () => {
    setSearching(true)

    var filteredRestaurants = props.action.filter((currentRestaurant: any) => currentRestaurant.name.toLowerCase().trim() === restaurant.toLowerCase().trim())

    if (filteredRestaurants.length > 0) {
      resetState()
      alert('You already added that restaurant!')
    } else  {
      axios.get(`https://api.yelp.com/v3/businesses/search?term=${restaurant.trim()}&longitude=${props.location.coords.longitude}&latitude=${props.location.coords.latitude}&limit=1`, {
        headers: {
          Authorization: `Bearer ${yelp_api_key}`
        }
      }).then((resp) => {
        var filteredQueryResponse = props.action.filter((currentRestaurants: any) => currentRestaurants.name.toLowerCase().trim() === resp.data.businesses[0].name.toLowerCase().trim())

        setResp(resp)
  
        if (resp.data.businesses.length > 0) {
          if (filteredQueryResponse.length > 0) {
            resetState()
            alert('You already added that restaurant!')
          } else {
            setQueryedRestaurantName(resp.data.businesses[0].name)
            setRestaurantExists(true)
          }
        } else {
          setQueryedRestaurantName("")
          setRestaurantExists(false)
        }
  
        setSearched(true)
        setSearching(false)
      }).catch(() => {
        setSearching(false)
        alert('Sorry something went wrong. Please try again!')
        resetState()
      })
    }
  }

  return(
    <View>
      <View style={ textInputWrapper }>
        <View style={{ width: "80%", height: 40, flexDirection: "row", zIndex: -1 }}>
          {
            props.searchType === 'RESTAURANT_EXISTS' ? (
              <TextInput
                value={restaurant}
                placeholder="Restaurant"
                onChangeText={(val) => setRestaurant(val)}
                style={ textInput }
                autoCapitalize="none"
                onSubmitEditing={handleSearchingForRestaurant}
              />
            ) : (
              <TextInput
                value={username}
                placeholder="Username"
                onChangeText={(val) => setUsername(val)}
                style={ textInput }
                autoCapitalize="none"
                onSubmitEditing={handleSearchSubmit}
              />
            )
          }

          {
            searching ? (
              <View style={{ width: "20%", height: 40, paddingRight: 0, backgroundColor: "#fff", borderBottomRightRadius: 20, borderTopRightRadius: 20, justifyContent: "center" }}>
                <ActivityIndicator size="small" color={dark} />
              </View>
            ) : (
              <View style={{ width: "20%", height: 40, paddingRight: 0, backgroundColor: "#fff", borderBottomRightRadius: 20, borderTopRightRadius: 20, justifyContent: "center" }} />
            )
          }
        </View>

        {
          searching ? (
            <View style={ searchIconWrapper }>
              <TouchableOpacity>
                <EntypoIcon name="magnifying-glass" size={35} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={ searchIconWrapper }>
              {
                props.searchType === 'RESTAURANT_EXISTS' ? (
                  <TouchableOpacity onPress={handleSearchingForRestaurant}>
                    <EntypoIcon name="magnifying-glass" size={35} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleSearchSubmit}>
                    <EntypoIcon name="magnifying-glass" size={35} color="white" />
                  </TouchableOpacity>
                )
              }
            </View>
          )
        }

      </View>
  
    { friend && !noUsername && !searching || restaurant && restaurantExists && !searching ? (
      <View style={ queryResultFriendOuterWrapper }>
        <View style={ queryResultFriendInnerWrapper }>
          {
            props.searchType === "RESTAURANT_EXISTS" ? (
              <Text style={ queryResultFriendText }>{queryedRestaurantName}</Text>
            ) : (
              <Text style={ queryResultFriendText }>{friend}</Text>
            )
          }
  
          <View style={ queryResultFriendButtonsWrapper }>
            <TouchableOpacity style={{ paddingRight: 5, justifyContent: "center", alignItems: "center" }} onPress={resetState}>
              <Text><AntDesign name="closesquareo" size={18} /></Text>
            </TouchableOpacity>
            {
              props.searchType === 'ADD_FRIEND' ? (
                <TouchableOpacity onPress={addFriend}>
                  <Text><AntDesign name="plussquareo" size={18} /></Text>
                </TouchableOpacity>
              ) : (
                <View>
                  {
                    props.searchType === 'RESTAURANT_EXISTS' ? (
                      <TouchableOpacity onPress={handleAddingRestaurant}>
                        <Text><AntDesign name="plussquareo" size={18} /></Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={setFriendsToSendLink}>
                        <Text><AntDesign name="plussquareo" size={18} /></Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )
            } 
          </View>
        </View>
      </View>
    ) : (
      !friend && noUsername && !searching || friend && noUsername && !searching || restaurant && !restaurantExists && !searching && searched ? (
        <View style={ queryResultNoUserOuterWrapper }>
            {
              props.searchType === "RESTAURANT_EXISTS" ? (
                <View style={ queryResultNoUserInnerWrapper }>
                  <Text style={ queryResultNoUserText }>{noRestraunt}</Text>
    
                  <TouchableOpacity onPress={resetState} style={ [queryResultNoUserButtonWrapper, { marginLeft: 17 }] }>
                    <Text><AntDesign name="closesquareo" size={18} /></Text>
                  </TouchableOpacity>
                </View>
              ) : (
              <View style={ queryResultNoUserInnerWrapper }>
                <Text style={ queryResultNoUserText }>{noUsername}</Text>
  
                <TouchableOpacity onPress={resetState} style={ [queryResultNoUserButtonWrapper, { marginLeft: 17 }] }>
                  <Text><AntDesign name="closesquareo" size={18} /></Text>
                </TouchableOpacity>
              </View>
              )
            }
        </View>
      ) : (
        null
      )
    )}
  </View>
  )
}