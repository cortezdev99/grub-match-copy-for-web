import React, { useState, useEffect } from 'react'
import { View, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore'
import { RFValue } from 'react-native-responsive-fontsize'
import * as Location from 'expo-location'

// Custom Components
import { white, green, dark, darkOrange } from '../Styles/variables';
import Text from '../Components/helpers/Text'
import Container from '../Components/layouts/Container'
import DuoMatchScreenStyles from '../Styles/stacks/duoMatch/DuoMatchScreenStyles'
import Friends from '../Components/helpers/Friends'
import Button from '../Components/helpers/Button'
import buttonStyles from '../Styles/buttonStyles'
import Search from '../Components/helpers/Search'

interface IDuoMatchScreenProps {
  navigation: {
    navigate: (arg: string, arg2?: object) => void,
  }
}

const DuoMatchScreen = (props: IDuoMatchScreenProps) => {
  const [friendsToSendTo, setFriendsToSendTo] = useState([] as any)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linksRecieved, setLinksRecieved] = useState([] as any)
  const [initializingLinks, setInitializingLinks] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const firestore = firebase.firestore()
  const [location, setLocation] = useState()
  const [isRefreshing, setIsRefreshing] = useState(false)
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied, we need access to your location to find restaurants in your area.');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
    
    userRef.collection('multiParty').get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const partyId = doc.id
        const party = doc.data().party
        const date = doc.data().date
        const deleteHourInterval = 28800
        const currentDate = new Date()
        const seconds = currentDate.getTime() / 1000

        if (seconds >= date.seconds + deleteHourInterval) {
          setInitializingLinks(true)
          let idx = 0
          party.map((user: any) => {
            idx += 1
            firestore.collection('users').where("Username", "==", user).get().then((snapshot) => {
              snapshot.forEach((doc) => {
                const userId = doc.id
                firestore.collection('users').doc(userId).collection('multiParty').doc(partyId).delete().then(() => {
                  if (idx == party.length) {
                    firestore.collection('partys').doc(partyId).delete().then(() => {
                      console.log('Successfully deleted')
                    }).catch(() => {
                      setInitializingLinks(false)
                    })
                  }
                }).catch(() => {
                  setInitializingLinks(false)
                })
              })
            }).catch(() => {
              setInitializingLinks(false)
            })
          })
        }
      })
    }).catch(() => {
      setInitializingLinks(false)
    })

    return () => {
      resetState()
    }
  }, [])

  const handlePartyPress = (linkId: string) => {
    props.navigation.navigate('MultiParty', {
      partyId: linkId
    })
  }

  const resetState = () => {
    return setLinksRecieved([]), setIsLoading(true), setFriendsToSendTo([])
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setLinksRecieved([])
    handleGettingLinks
  }

  const handleSendingLinks = () => {
    setIsSubmitting(true)
    if (friendsToSendTo.length === 0) {
      setIsSubmitting(false)
      return alert('You have to add friends to the party in order to create one!')
    }

    userRef.get().then((currentUserSnapshot) => {
      // @ts-ignore
      const currentUserSnap = currentUserSnapshot.data().Username
      friendsToSendTo.push(currentUserSnap)

      firestore.collection('partys').add({
        friendsToSendTo
      }).then((docRef: any) => {
        const partyDocId = docRef.id
        friendsToSendTo.map((user: any) => {
          firestore.collection('users').where("Username", "==", user).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              const userId = doc.id
  
              firestore.collection('users').doc(userId).collection('multiParty').doc(partyDocId).set({
                partyId: partyDocId,
                location: location,
                party: friendsToSendTo,
                date: new Date()
              }).then(() => {
                firestore.collection('users').doc(userId).collection('multiParty').doc(partyDocId).collection('likedCards').add({
                  likedCards: []
                }).then(() => {
                  setIsSubmitting(false)
                  resetState()
                }).then(() => {
                  props.navigation.navigate("MultiParty", {
                    partyId: partyDocId
                  })
                }).catch(() => {
                  alert('Sorry there was an error with our server, please try again.')
                  setIsSubmitting(false)
                })
              }).catch(() => {
                alert('Sorry there was an error with our server, please try again.')
                setIsSubmitting(false)
              })
            })
          }).catch(() => {
            alert('Sorry there was an error with our server, please try again.')
            setIsSubmitting(false)
          })
        })
      }).catch(() => {
        alert('Sorry there was an error')
        setIsSubmitting(false)
      })
    }).catch(() => {
      alert('Sorry there was an error')
      setIsSubmitting(false)
    })
  }

  const handleGettingLinks = () => {
    userRef.collection('multiParty').onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added' && linksRecieved.length < querySnapshot.docs.length) {
          linksRecieved.push(change.doc.data())
        } else if (change.type === 'removed') {
          const filteredArray = linksRecieved.filter((link: any) => link.partyId !== change.doc.data().partyId)
          setInitializingLinks(false)
          setLinksRecieved(filteredArray)
        }
      })
      setIsLoading(false)
      if (isRefreshing) {
        setIsRefreshing(false)
      }
    })


    return (
      <View style={{ width: "100%", marginBottom: 25 }}>
        {
          linksRecieved.length > 0 && !isLoading && !isRefreshing && !initializingLinks ? (
            linksRecieved.map((link: any, idx: number) => {
              return (
                <TouchableOpacity key={idx} onPress={() => handlePartyPress(link.partyId)} style={{ marginBottom: 25 }}>
                  <Text style={{ textAlign: "center", color: white, paddingTop: 50, fontSize: RFValue(16, 896) }}>{link.partyId}</Text>
                </TouchableOpacity>
              )
            })
          ) : (
            linksRecieved.length === 0 && !isLoading  && !isRefreshing && !initializingLinks ? (
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ width: "100%", fontSize: RFValue(16, 896), color: white, fontWeight: "500", textAlign: "center", paddingTop: 30 }}>You have no current partys, scroll down to start one!</Text>
              </View>
            ) : (
              <View style={{width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                <ActivityIndicator size="small" color={white} />
              </View>
            )
          )
        }
      </View>
    )
  }

  return (
    <Container navigation={props.navigation}>
      <ScrollView
        style={ DuoMatchScreenStyles.scrollViewContainer }
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl  refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#fff" />}
      >
        <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <View style={{ height: "100%", width: "80%", justifyContent: "space-evenly" }}>
            <View>
              <View style={ DuoMatchScreenStyles.topHeadingTextWrapper}>
                <Text style={ [DuoMatchScreenStyles.topHeadingText, { color: green }] }>Current Parties!</Text>
              </View>

              { handleGettingLinks() }
            </View>

            <View>
              <View style={ DuoMatchScreenStyles.topHeadingTextWrapper }>
                <Text style={ [DuoMatchScreenStyles.topHeadingText, { color: green }] }>Find a place to eat with your friends!</Text>
              </View>

              {
                isSubmitting ? (
                  <View style={{ marginTop: 50 }}>
                    <Button text="Sending..." disabled={true} styleWrapper={[ buttonStyles.buttonWrapper, { backgroundColor: green, borderRadius: 5 } ]} styleButton={[ buttonStyles.button, { color: dark } ]} />
                  </View>
                ) : (
                  <View style={{ marginTop: 50 }}>
                    <Button text="Send Code" action={handleSendingLinks} styleWrapper={ [buttonStyles.buttonWrapper, { backgroundColor: darkOrange, borderRadius: 5 }] } styleButton={ [buttonStyles.button, { color: dark }] }/>
                  </View>
                )
              }

              <View>
                {
                  friendsToSendTo.length > 0 ? (
                    <View style={{ marginTop: 50 }}>
                      <View style={{ minHeight: 30, maxHeight: 80, borderBottomColor: white, borderBottomWidth: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: RFValue(17, 896), color: green }}>Will Send To</Text>
                      </View>

                      {
                        friendsToSendTo.map((friend: string, idx: number) => {
                          return (
                            <View key={idx} style={{ height: 40, paddingTop: 10, justifyContent: "center", alignItems: "center" }}>
                              <Text style={{ fontSize: RFValue(15, 896), color: white }}>{friend}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  ) : (
                    <View />
                  )
                }
              </View>

              <View style={{ marginTop: 50 }}>
                <Search searchType="APPEND_FRIEND_TO_ARRAY" action={friendsToSendTo} setAction={setFriendsToSendTo} />
              </View>

              <Friends actionType="APPEND_FRIEND_TO_ARRAY" action={friendsToSendTo} setAction={setFriendsToSendTo} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}

export default DuoMatchScreen