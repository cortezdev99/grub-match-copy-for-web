import React, { useEffect, useState } from 'react'
import { View, Image, FlatList, YellowBox, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { RFValue } from 'react-native-responsive-fontsize'
import 'firebase/auth'
import 'firebase/firestore'

// Custom Components
import { primary, white, green, lightPurple } from '../Styles/variables'
import ScrollModal from '../Components/helpers/ScrollModal'
import Text from '../Components/helpers/Text'

interface IMultiPartyDetailsProps {
  route: {
    params: any
  }
  navigation: {
    navigate: (arg: string) => void;
  }
}


YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state'
])


export default (props: IMultiPartyDetailsProps) => {
  const firestore = firebase.firestore()
  const [isLoading, setIsLoading] = useState(true)
  const [card, setCard] = useState(props.route.params.likedRestaurantsData[0].restaurant)
  const [scrollModalOpen, setScrollModalOpen] = useState(false)
  var users: any[] = []
  const [refresh, setRefresh] = useState(false)
  const [userArraysLoading, setUserArraysLoading] = useState(false)
  const [userArraysForEachCard, setUserArraysForEachCard] = useState([] as any)
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)
  const { partyId, setLikedRestaurantsData } = props.route.params
  
  useEffect(() => { 
    handleRenderingUsers()

    return () => {
      setLikedRestaurantsData([])
    }
  })

  const handleRestrauntPress = (restaurant: any) => {
    setCard(restaurant)
    setScrollModalOpen(true)
  }


  const HandleRefresh = () => {
    setRefresh(true)
    setUserArraysLoading(true)
    setUserArraysForEachCard([])
    handleRenderingUsers
  }

  const handleRenderingUsers = () => {
    userRef.get().then((resp) => {
      const { likedRestaurantsData } = props.route.params

      if (refresh || isLoading) {
        // @ts-ignore
        const username = resp.data().Username
        likedRestaurantsData.map((likedRestaurantData: any, idx: any) => {
          const { Index } = likedRestaurantData
          firestore.collection('partys').doc(partyId).collection('likedCards').doc(Index.toString()).get().then((snapshot) => {
            if (snapshot.exists) {
              // @ts-ignore
              snapshot.data().usersWhoLiked.map((user) => {
                if (user !== username) {
                  users.push(user)
                }
              })
  
              //@ts-ignore
              userArraysForEachCard.push({ arrIndex: Index, usersWhoLiked: users })
              users = []
            } else {
              userArraysForEachCard.push({ arrIndex: Index, usersWhoLiked: [] })
            }
          }).then(() => {
            if (idx + 1 === likedRestaurantsData.length) {
              setIsLoading(false)
              setUserArraysLoading(false)
              setRefresh(false)
            }
          }).catch(() => {
            alert('Sorry there was an error')
          })
        })
      }
    })
  }

  const LikedRestaurant = (likedRestaurant: any) => {
    const { restaurant, Index } = likedRestaurant.likedRestaurant.item
    return (
      <View style={{ minHeight: 400, maxHeight: 1400 }}>
      {
        restaurant.img_url !== "" ? (
          <Image
            source={{ uri: `${restaurant.image_url}`}}
            style={{ minHeight: 400, maxHeight: 800, width: "100%", resizeMode: "cover" }}
          />
        ) : (
          <Image
            source={require('../assets/restaurantImage.png')}
            style={{ height: "60%", width: "100%" }}
          />
        )
      }
  
      <View style={{ marginTop: 18, height: 100, justifyContent: "center", alignItems: "center" }}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: white, width: "80%" }}>
          <Text style={{ fontSize: RFValue(22, 896), textAlign: "center", marginBottom: 15, color: green }}>{restaurant.name}</Text>
        </View>
      </View>

      <View style={{ height: 30 }}>
        {
          restaurant.is_closed ? (
            <Text style={{ textAlign: "center", fontSize: RFValue(18, 896), color: white }}>Closed Now</Text>
          ) : (
            <Text style={{ textAlign: "center", fontSize: RFValue(18, 896), color: white }}>Open Now</Text>
          )
        }
      </View>

      <View style={{ marginTop: 15 }}>
        {
          userArraysLoading ? (
            <View>
              <ActivityIndicator size="small" color={white} />
            </View>
          ) : (
            <View>
              {
                userArraysForEachCard.map((userArrayObject: any, index: any) => {
                  const { arrIndex, usersWhoLiked} = userArrayObject
                  return (
                    <View key={index}>
                      {
                        arrIndex === Index ? (
                          <View>
                            {                           
                              usersWhoLiked.length > 0 ? (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                  <View style={{ alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#fff", width: "60%" }}>
                                    <Text font="fancy-bold" style={{ fontSize: RFValue(20, 896), color: green, height: 25, marginBottom: 15 }}>Liked By</Text>
                                  </View>

                                  {
                                    usersWhoLiked.map((user: any, idx: any) => {
                                      if (idx <= usersWhoLiked.length) {
                                        return (
                                          <Text key={idx} style={{ fontSize: RFValue(16, 896), marginTop: 15, color: lightPurple }}>{user}</Text>
                                        )
                                      }
                                    })
                                  }

                                  <View  style={{ borderBottomWidth: 1, borderBottomColor: "#fff", width: "60%", marginTop: 15 }} />
                                </View>
                              ) : (
                                <View style={{ height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                  <View style={[{marginLeft: 5, marginBottom: 2, marginRight: 2, height: "100%" }, {
                                    transform: [
                                      { skewX: "-15deg" }
                                    ]
                                  }]}>
                                    <Text font="norm" style={{ fontSize: RFValue(18, 896), color: "#15CC00" }}>
                                      N
                                    </Text>
                                  </View>

                                  <Text font="fancy-bold" style={{ textAlign: "center", fontSize: RFValue(18, 896), color: "#15CC00", height: "100%" }}>
                                    o 
                                  </Text>

                                  <View style={[{marginLeft: 5, marginBottom: 2, marginRight: 1, height: "100%" }, {
                                    transform: [
                                      { skewX: "-15deg" }
                                    ]
                                  }]}>
                                    <Text font="norm" style={{ fontSize: RFValue(18, 896), color: "#15CC00" }}>
                                      M
                                    </Text>
                                  </View>

                                  <Text font="fancy-bold" style={{ fontSize: RFValue(18, 896), color: "#15CC00", height: "100%" }}>
                                    atches yet!
                                  </Text>
                                </View>
                              )
                            }
                          </View>
                        ) : (
                          <View />
                        )
                      }
                    </View>
                  )
                })
              }
            </View>
          )
        }
      </View>

      <View style={{ height: 50, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={() => handleRestrauntPress(restaurant)}>
          <Text style={{ color: white, fontSize: RFValue(16, 896) }}>See details</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }

  const Footer = () => {
    return (
      <View style={{ height: 30 }}>

      </View>
    )
  }

  const { likedRestaurantsData } = props.route.params
  return (
    <View style={{ height: "100%", width: "100%", backgroundColor: primary }}>
      {
        isLoading ? (
          <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={white} />
          </View>
        ) : (
        <View>
          <ScrollModal isModalVisible={scrollModalOpen} setIsModalVisible={setScrollModalOpen}  card={card} />

          <View style={{ height: 100, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Text font="fancy-bold" style={{ fontSize: RFValue(26, 896), color: "#15CC00", fontWeight: "600" }}>Liked Restaurants!</Text>
          </View>
    
          <View style={{ marginBottom: 200 }}>
            <FlatList
              data={likedRestaurantsData}
              renderItem={(likedRestaurant) => <LikedRestaurant likedRestaurant={likedRestaurant} />}
              keyExtractor={(likedRestaurant) => likedRestaurant.Index.toString()}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              refreshControl={<RefreshControl  refreshing={refresh} onRefresh={HandleRefresh} tintColor="#fff" />}
              ListFooterComponent={() => <Footer />}
              contentContainerStyle={{ marginBottom: 100 }}
            />
          </View>
        </View>
        )
      }
    </View>
  )
}