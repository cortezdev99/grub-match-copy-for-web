import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Linking, ActivityIndicator } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import axios from 'axios'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modal';
import { showLocation } from 'react-native-map-link';
import { LinearGradient } from 'expo-linear-gradient';

// Custom Components
import Text from '../helpers/Text'
import { green, darkOrange, lightPurple, white } from '../../Styles/variables';
import { yelp_api_key } from '../../config/yelpConfig';

interface ISpinWheelScreenModalProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
  winner: any;
}

export default (props: ISpinWheelScreenModalProps) => {
  var scrollViewRef: React.RefObject<ScrollView>;
  scrollViewRef = React.createRef();
  const [scrollOffset, setScrollOffset] = useState()
  const [reviews, setReviews] = useState([] as any)

  const handleOnScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y)
  };

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  if (props.winner.value !== undefined) {
    const {
      name,
      image_url,
      is_closed,
      categories,
      price,
      url,
      coordinates,
      phone,
      display_phone,
      id,
      rating,
      review_count
    } = props.winner.value

    const handleGettingReviews = () => {
      if (reviews.length === 0) {
        axios.get(`https://api.yelp.com/v3/businesses/${id}/reviews`, {
          headers: {
            Authorization: `Bearer ${yelp_api_key}`
          }
        }).then((resp) => {
          setReviews(resp.data.reviews)
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  
    if (props.isModalVisible && props.winner) {
      if (props.winner.value !== "Add a restaurant!") {
        handleGettingReviews()
      }
    } else {
      if (reviews.length !== 0) {
        setReviews([])
      }
    }

    const handleRenderingYelpStarImage = () => {
      return (
        <View>
          {
            rating === 0 ? (<Image source={require('../../assets/yelp-stars/small_0.png')}  />) : rating === 0.5 ? (<Image source={require('../../assets/yelp-stars/small_1.png')}  />) : rating === 1 ? (<Image source={require('../../assets/yelp-stars/small_1.png')}  />) : rating === 1.5 ? (<Image source={require('../../assets/yelp-stars/small_1_half.png')}  />) : rating === 2 ? (<Image source={require('../../assets/yelp-stars/small_2.png')}  />) : rating === 2.5 ? (<Image source={require('../../assets/yelp-stars/small_2_half.png')}  />) : rating === 3 ? (<Image source={require('../../assets/yelp-stars/small_3.png')}  />) : rating === 3.5 ? (<Image source={require('../../assets/yelp-stars/small_3_half.png')} />) : rating === 4 ? (<Image source={require('../../assets/yelp-stars/small_4.png')} />) : rating === 4.5 ? (<Image source={require('../../assets/yelp-stars/small_4_half.png')} />) : (<Image source={require('../../assets/yelp-stars/small_5.png')} />)
          }
        </View>
      )
    }  

    return (
      <Modal
        isVisible={props.isModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={1}
        swipeDirection={['down']}
        onSwipeComplete={ () => props.setIsModalVisible()}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        propagateSwipe={true}
        style={{ justifyContent: 'flex-start', margin: 0 }}
      >
        <ScrollView 
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          style={{ marginTop: 80, flex: 1 }}
        >
          <View style={{ height: "100%", width: "100%", marginBottom: 80 }}>
            <View style={{ width: "100%", alignItems: "flex-end", justifyContent: "center", paddingRight: 20, paddingTop: 20, paddingBottom: 20 }}>
              <TouchableOpacity onPress={ () => props.setIsModalVisible() } style={{ width: 20 }} >
                <Text><AntDesign name="closecircleo" color="white" size={20}  /></Text>
              </TouchableOpacity>
            </View>

            {
              props.winner.value === "Add a restaurant!" ? (
                <View style={{ alignItems: "center", justifyContent: 'center' }}>
                  <View style={{ width: "100%", height: 400 }}>
                    <Image
                      source={require('../../assets/restaurantImage.png')}
                      style={{ height: "100%", width: "100%", resizeMode: "cover" }}
                    />
                  </View>

                  <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", height: "40%", minHeight: 200 }}>
                    <Text style={{ color: green, fontSize: RFValue(24, 896), textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>The winner is... A placeholder!</Text>
                    <Text style={{ color: darkOrange, textAlign: "center", fontSize: RFValue(20, 896) }}>Try it with real restaurants now!</Text>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={{ width: "100%", height: 400 }}>
                    {
                      image_url !== "" ? (
                        <Image
                          source={{ uri: `${image_url}`}}
                          style={{ height: "100%", width: "100%", resizeMode: "cover" }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/restaurantImage.png')}
                          style={{ height: "100%", width: "100%", resizeMode: "cover" }}
                        />
                      )
                      }
                    </View>

                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "80%", justifyContent: "center", alignItems: "center", borderWidth: 1, borderBottomColor: "white" }}>
                      <Text style={{ textAlign: "center", fontSize: RFValue(24, 896), color: green, paddingTop: 20, paddingBottom: 20 }}>The winning restaurant is {name}!</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "60%", alignItems: "center", justifyContent: "center", borderWidth: 1, borderBottomColor: "white" }}>
                      <Text style={{ textAlign: "center", color: darkOrange, fontSize: RFValue(20, 896), paddingTop: 20, paddingBottom: 20 }}>Restraunt Type</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
                      <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                        {
                          categories && categories.map((categorie: any, index: number) => {
                            return (
                              <Text key={index} style={{ color: lightPurple, fontSize: RFValue(18, 896) }}>{categorie.title}</Text>
                            )
                          })
                        }
                    </View>
                  </View>
                </View>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: "60%", alignItems: "center", justifyContent: "center", borderWidth: 1, borderBottomColor: "white" }}>
                    <Text style={{ textAlign: "center", color: darkOrange, fontSize: RFValue(20, 896), paddingTop: 10, paddingBottom: 20 }}>MISC Details</Text>
                  </View>

                  <View style={{ paddingTop: 20 }}>
                    <Text style={{ color: lightPurple, fontSize: RFValue(18, 896) }}>{is_closed ? "Closed Now" : "Open Now"}</Text>
                  </View>

                  <View style={{ paddingTop: 20 }}>
                    <Text style={{ color: lightPurple, fontSize: RFValue(18, 896) }}>{ price === "$" ? `Price: ${price} Cheap` : price === "$$" ? `Price: ${price} Moderate` : `Price: ${price} Above Average` }</Text>
                  </View>

                  <View style={{ paddingTop: 20 }}>
                    <TouchableOpacity onPress={() => Linking.openURL(`${url}`)}>
                      <Text style={{ color: lightPurple, fontSize: RFValue(18, 896), textDecorationLine: "underline" }}>Website on Yelp</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingTop: 20 }}>
                    <TouchableOpacity onPress={() => {
                      showLocation({
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        alwaysIncludeGoogle: true
                      })
                    }}>
                      <Text style={{ color: lightPurple, fontSize: RFValue(18, 896), textDecorationLine: "underline" }}>Get Directions!</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingTop: 20 }}>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
                      <Text style={{ color: lightPurple, fontSize: RFValue(18, 896), textDecorationLine: "underline" }}>Call {display_phone}!</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {
                  reviews.length > 0 ? (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <View style={{ width: "60%", alignItems: "center", justifyContent: "center", borderWidth: 1, borderBottomColor: "white" }}>
                        <Text style={{ textAlign: "center", color: darkOrange, paddingTop: 20, paddingBottom: 20, fontSize: RFValue(20, 896) }}>Reviews</Text>
                      </View>

                      <View style={{ alignItems: "center", justifyContent: "center", width: "80%" }}>
                        <View style={{ flexDirection: "row", minHeight: 30, maxHeight: 100, alignItems: "center", justifyContent: "space-evenly", width: "100%", marginTop: 20 }}>
                          <View style={{ alignItems: "center",justifyContent: "space-evenly", height: "75%" }}>
                            <View style={{ alignItems: "center", justifyContent: "center"}}>
                              <Text style={{ color: lightPurple, fontSize: RFValue(18, 896) }}>Rated: </Text>
                            </View>

                            <View>
                              {
                                handleRenderingYelpStarImage()
                              }
                            </View>
                          </View>

                          <View style={{ justifyContent: "space-evenly", minHeight: 30, maxHeight: 100, }}>
                            <Text style={{ color: lightPurple, textAlign: "center", marginTop: 2.5,fontSize: RFValue(18, 896) }}>Out of:</Text>
                            <Text style={{ color: lightPurple, textAlign: "center", marginTop: 2.5 }}>{review_count} reviews.</Text>
                          </View>
                        </View>
                      </View>


                      {
                        reviews.map((review: any) => {
                          const { url } = review
                          return (
                            <View key={review.id} style={{ alignItems: "center", justifyContent: "center", width: "80%", paddingTop: 15 }}>
                              <Text style={{ textAlign: "center", color: darkOrange, fontSize: RFValue(20, 896) }}>Written By: {review.user.name.trim()}</Text>
                              <Text style={{ textAlign: "center", color: lightPurple, fontSize: RFValue(18, 896) }}>{review.text.trim()}</Text>

                              <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                                <LinearGradient colors={[ "#136a8a", "#267871" ]} start={[0, 0.65]} style={{ borderRadius: 5, marginTop: 20, width: "100%", minHeight: 30, maxHeight: 80, alignItems: "center", justifyContent: "center" }}>
                                  <TouchableOpacity style={{ width: "100%", alignItems: "center", justifyContent: "center" }} onPress={() => Linking.openURL(`${url}`)}>
                                    <Text style={{ width: "100%", textAlign: "center", color: white }}>Continue reading on yelp</Text>
                                  </TouchableOpacity>
                                </LinearGradient>
                              </View>
                            </View>
                          )
                        })
                      }
                    </View>
                  ) : (
                    <ActivityIndicator size="small" color="#fff" />
                  )
                }
              </View>
              )
            }
          </View>
        </ScrollView>
      </Modal>
    );
  } else {
    return (
      <Modal
        isVisible={props.isModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.9}
        swipeDirection={['down']}
        onSwipeComplete={ () => props.setIsModalVisible()}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        propagateSwipe={true}
        style={{ justifyContent: 'flex-start', margin: 0 }}
      >
        <ScrollView 
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={18}
          style={{ marginTop: 80, flex: 1 }}
        >
          <View style={{ height: "100%", width: "100%" }}>
        
          </View>
        </ScrollView>
      </Modal>
    );
  }
}