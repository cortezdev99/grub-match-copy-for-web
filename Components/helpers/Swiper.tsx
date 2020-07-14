import React, { useState, useEffect } from 'react'
import * as FacebookAds from 'expo-ads-facebook';
import { View, TouchableOpacity, Image, Platform, YellowBox, ActivityIndicator } from 'react-native'
// @ts-ignore
import Swiper from 'react-native-deck-swiper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import { RFValue } from 'react-native-responsive-fontsize'

// Custom Components
import ScrollableModal from './ScrollModal'
import scrollableModalStyles from '../../Styles/scrollableModalStyles'
import SlideModal from './SlideModal'
import SlideModalCards from './SlideScrollModalCards'
import { yelp_api_key } from '../../config/yelpConfig'
import { primary, white, green, lightPurple, dark, darkOrange } from '../../Styles/variables'
import Text from '../helpers/Text'

YellowBox.ignoreWarnings([
  'Setting a timer'
])

interface ISwiperProps {
  restaurants?: any;
  location?: any;
  setRestaurants?: any;
  partyId?: string;
  navigation: {
    navigate: (arg: string, arg2?: object) => void;
  }
}

export default (props: ISwiperProps) => {
  const [card, setCard] = useState({})
  const [matchedCard, setMatchedCard] = useState({})
  const [modalOpen, setModalOpen] = useState(false);
  const [likedRestrauntsModalOpen, setLikedRestrauntsModalOpen] = useState(false)
  const [swipedRightModalOpen, setSwipedRightModalOpen]= useState(false)
  const [likedRestraunts, setLikedRestraunts] = useState([] as any)
  const [likedCardsIndexes, setLikedCardsIndexes] = useState([] as any)
  const [loading, setLoading] = useState(false)
  const [prefetched, setPrefetched] = useState([] as any)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [users, setUsers] = useState([] as any)
  const [username, setUsername] = useState("")
  const [matchedUsers, setMatchedUsers] = useState([] as any)
  const [matchedSwipedRightModalOpen, setMatchedSwipedRightModalOpen] = useState(false)
  const firestore = firebase.firestore()
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)

  const {
    defaultText
  } = scrollableModalStyles

  useEffect(() => {
    setCard(props.restaurants[0])
  }, [])

  const handleGettingMoreRestraunts = (cardIndex: number) => {
    axios.get(`https://api.yelp.com/v3/businesses/search?term=food&longitude=${props.location.coords.longitude}&latitude=${props.location.coords.latitude}&limit=50&offset=${props.restaurants.length}`, {
      headers: {
        Authorization: `Bearer ${yelp_api_key}`
      }
    }).then((resp) => {
      setCurrentIndex(cardIndex)
      resp.data.businesses.forEach((biz: any) => {
        props.restaurants.push(biz)
      })

      setLoading(false)
    }).catch(() => {
      alert("Your internet connection is not secure! You will need access to internet to use this feature.")
    })
  }

  const handleSwipedLeft = (cardIndex: number) => {
    setCard(props.restaurants[cardIndex + 1])

    if (cardIndex + 2 === props.restaurants.length) {
      setLoading(true)
      handleGettingMoreRestraunts(cardIndex)
    }

    if (cardIndex % 5 === 0 && cardIndex !== 0) {
      if (Platform.OS === "ios") {
        FacebookAds.InterstitialAdManager.showAd('189255192517582_189300992513002').then(() => {
        }).catch((err: any) => {
          console.log(err)
        })
      } else if (Platform.OS === "android") {
        FacebookAds.InterstitialAdManager.showAd('2699941510250499_2699942066917110').then(() => {
          console.log('shown')
        }).catch((err) => {
          console.log(err, 'ERROR')
        })
      }
    }
  }

  const handleSwipedRight = (cardIndex: number) => {
    if (props.partyId) {
      handlePartySwipeRight(cardIndex)
    } else {
      setCard(props.restaurants[cardIndex + 1])
      setMatchedCard(props.restaurants[cardIndex])
      likedCardsIndexes.push(cardIndex)
      setSwipedRightModalOpen(true)
  
      if (cardIndex + 2 === props.restaurants.length) {
        setLoading(true)
        handleGettingMoreRestraunts(cardIndex)
      }
    }

    if (cardIndex % 5 === 0 && cardIndex !== 0) {
      if (Platform.OS === "ios") {
        FacebookAds.InterstitialAdManager.showAd('189255192517582_189300992513002').then(() => {
          console.log('shown')
        }).catch((err: any) => {
          console.log(err)
        })
      } else if (Platform.OS === "android") {
        FacebookAds.InterstitialAdManager.showAd('2699941510250499_2699942066917110').then(() => {
          console.log('shown')
        }).catch((err) => {
          console.log(err, 'ERROR')
        })
      }
    }
  }

  const handlePartySwipeRight = (cardIndex: number) => {
    likedCardsIndexes.push(cardIndex)

    userRef.get().then((currentUserSnapshot) => {
      // @ts-ignore
      const username = currentUserSnapshot.data().Username
      setUsername(username)
      userRef.collection('multiParty').doc(props.partyId).get().then((currentUserMultiPartySnapshot) => {
        if (users.length === 0) {
          // @ts-ignore
          setUsers(currentUserMultiPartySnapshot.data().party)
        }

        firestore.collection('partys').doc(props.partyId).collection('likedCards').get().then((snapshot) => {
          if (snapshot.empty) {
            firestore.collection('partys').doc(props.partyId).collection('likedCards').doc(cardIndex.toString()).set({
              usersWhoLiked: [username]
            }).then(() => {
              setMatchedCard(props.restaurants[cardIndex])
              setSwipedRightModalOpen(true)
            }).catch(() => {
              alert('Sorry there was an error')
            })
          } else {
            firestore.collection('partys').doc(props.partyId).collection('likedCards').doc(cardIndex.toString()).get().then((doc) => {
              if (doc.exists) {
                // @ts-ignore
                var currentUsersFromDB = doc.data().usersWhoLiked
                currentUsersFromDB.push(username)
                // @ts-ignore
                doc.data().usersWhoLiked.map((user: any, idx: any) => {
                  // @ts-ignore
                  if (user !== username && idx + 1 === doc.data().usersWhoLiked.length) {
                    firestore.collection('partys').doc(props.partyId).collection('likedCards').doc(doc.id).set({
                      usersWhoLiked: currentUsersFromDB
                    }).then(() => {
                      // @ts-ignore
                      setMatchedUsers(doc.data().usersWhoLiked)
                      setMatchedCard(props.restaurants[cardIndex])
                    }).then(() => {
                      return setMatchedSwipedRightModalOpen(true)
                    }).catch(() => {
                      alert('Sorry there was an error')
                    })
                  } else if (user === username) {
                    // @ts-ignore
                    const result = doc.data().usersWhoLiked.filter((user: string) => user !== username)
                    setMatchedUsers(result)
                    setMatchedCard(props.restaurants[cardIndex])

                    if (result.length === 0) {
                      return setSwipedRightModalOpen(true)
                    } else {
                      return setMatchedSwipedRightModalOpen(true)
                    }
                  }
                })
              } else {
                firestore.collection('partys').doc(props.partyId).collection('likedCards').doc(cardIndex.toString()).set({
                  usersWhoLiked: [username]
                }).then(() => {
                  setMatchedCard(props.restaurants[cardIndex])
                  return setSwipedRightModalOpen(true)
                }).catch(() => {
                  alert('Sorry there was an error')
                })
              }
            })
          }
        }).catch(() => {
          alert('Sorry there was an error')
        })
      }).catch(() => {
        alert('Sorry there was an error')
      })
    }).catch(() => {
      alert('Sorry there was an error')
    })
  }

  const handleLikedRestrauntsPress = () => {
    if (users && users.length > 0) {
      likedCardsIndexes.map((index: number) => {
        likedRestraunts.push({ Index: index, restaurant: props.restaurants[index]})
      })

      if (likedRestraunts.length > 0) {
        props.navigation.navigate("MultiPartyDetails", {
          likedRestaurantsData: likedRestraunts,
          setLikedRestaurantsData: setLikedRestraunts,
          partyId: props.partyId
        })
      } else {
        setLikedRestrauntsModalOpen(true)
      }
    } else {
      likedCardsIndexes.map((index: number) => {
        likedRestraunts.push(props.restaurants[index])
      })

      setLikedRestrauntsModalOpen(true)
    }
  }

  const Card = ({card}: any) => {
    return (
      <View style={{ height: "100%", justifyContent: "space-evenly" }}>
        {
          card.image_url !== "" ? (
            <Image
              source={{ uri: `${card.image_url}`, cache: 'force-cache' }}
              style={{ height: "80%", width: "100%" }}
              defaultSource={require('../../assets/loadingImage.jpg')}
            />
          ) : (
            <Image
              source={require('../../assets/restaurantImage.png')}
              style={{ height: "80%", width: "100%" }}
              defaultSource={require('../../assets/restaurantImage.png')}
            />
          )
        }

        <View style={{ height: "20%", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
          <Text style={{ fontSize: RFValue(20, 896), textAlign: "center", color: green }}>
            {card.name}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
            {
                card.categories && card.categories.map((categorie: any, index: number) => {
                  return (
                    <Text key={index} style={ [defaultText, {color: lightPurple}] }>{categorie.title}</Text>
                  )
                })
              }
          </View>

          <TouchableOpacity onPress={ () => setModalOpen(true) }>
            <Text style={{ color: white, textDecorationLine: "underline", textAlign: "center" }}>See more details</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <SlideModal isModalVisible={swipedRightModalOpen} setIsModalVisible={setSwipedRightModalOpen} card={matchedCard} />
      <SlideModal isModalVisible={matchedSwipedRightModalOpen} setIsModalVisible={setMatchedSwipedRightModalOpen} card={matchedCard} usersWhoMatched={matchedUsers} setUsersWhoMatched={setMatchedUsers} username={username} />
      <ScrollableModal isModalVisible={modalOpen} setIsModalVisible={setModalOpen} card={card} />
      <SlideModalCards isModalVisible={likedRestrauntsModalOpen} setIsModalVisible={setLikedRestrauntsModalOpen} restraunts={likedRestraunts} setRestraunts={setLikedRestraunts} />

      <View style={{ zIndex: 10000, top: 100 }}>
        <TouchableOpacity onPress={handleLikedRestrauntsPress} style={{ backgroundColor: darkOrange, width: 30, borderRadius: 4, marginRight: 10, borderColor: white, alignSelf: "flex-end" }}>
          <MaterialCommunityIcons name="heart-box" size={45} color={dark} style={{ width: 45, margin: -7 }} />
        </TouchableOpacity>
      </View>

      {
        loading ? (
          <View>
            <ActivityIndicator size="large" color={ white } />
          </View>
        ) : (
          <Swiper
            cards={props.restaurants}
            cardIndex={currentIndex}
            renderCard={(card: any, cardIndex: number) => <Card card={card} cardIndex={cardIndex} />}
            cardStyle={{ backgroundColor: primary, padding: 0, margin: 0, height: "100%" }}
            containerStyle={{ marginBottom: 80, backgroundColor: primary }}
            backgroundColor={primary}
            stackSize={2}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            disableTopSwipe
            disableBottomSwiper
            onSwipedRight={(cardIndex: number) => handleSwipedRight(cardIndex)}
            onSwipedLeft={(cardIndex: number) => handleSwipedLeft(cardIndex)}
            animateOverlayLabelsOpacity
            infinite={true}
            useViewOverflow={Platform.OS === 'ios'}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: "transparent",
                    borderColor: "red",
                    color: "red",
                    fontWeight: "700",
                    borderWidth: 2,
                    fontSize: RFValue(28, 896)
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 40,
                    marginLeft: -40
                  }
                }
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: "transparent",
                    borderColor: green,
                    color: green,
                    fontWeight: "700",
                    borderWidth: 2,
                    fontSize: RFValue(28, 896)
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 40,
                    marginLeft: 40
                  }
                }
              }
            }}
          />
        )
      }
    </View>
  )
}