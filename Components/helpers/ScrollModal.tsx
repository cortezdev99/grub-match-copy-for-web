import React, { useState } from 'react';
import {ScrollView, View, TouchableOpacity, Linking, ActivityIndicator, Image} from 'react-native';
import axios from 'axios'
import Modal from 'react-native-modal';
import { showLocation } from 'react-native-map-link'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { LinearGradient } from 'expo-linear-gradient';

// Custom Components
import Text from '../helpers/Text'
import { yelp_api_key } from '../../config/yelpConfig';
import { green, lightPurple, darkOrange, primary, white } from '../../Styles/variables';
import scrollableModalStyles from '../../Styles/scrollableModalStyles';

interface IScrollModalProps {
  isModalVisible?: Boolean,
  setIsModalVisible?: any,
  card?: any
}

export default (props: IScrollModalProps) => {
  var scrollViewRef: React.RefObject<ScrollView>;
  scrollViewRef = React.createRef();
  const [scrollOffset, setScrollOffset] = useState()
  const [reviews, setReviews] = useState([])

  const handleOnScroll = (event: any) => {
      setScrollOffset(event.nativeEvent.contentOffset.y)
  };

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleGettingReviews = () => {
    if (reviews.length === 0) {
      axios.get(`https://api.yelp.com/v3/businesses/${props.card.id}/reviews`, {
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

  if (props.isModalVisible) {
    handleGettingReviews()

  } else {
    if (reviews.length !== 0) {
      setReviews([])
    }
  }

  const {
    name,
    rating,
    is_closed,
    phone,
    review_count,
    price,
    url,
    categories,
    coordinates,
    display_phone
  } = props.card

  const {
    modal,
    scrollableModal,
    closeButtonWrapper,
    closeButtonText,
    contentWrapper,
    restrauntHeadingWrapper,
    restrauntHeadingText,
    restrauntTypesWrapper,
    restrauntTypesHeadingWrapper,
    restrauntTypesHeadingText,
    restrauntTypesCategoriesWrapper,
    miscDetailsWrapper,
    miscDetailsHeaderWrapper,
    miscDetailsHeaderText,
    miscDetailsWebsiteWrapper,
    miscDetailsIsOpenWrapper,
    miscDetailsPriceWrapper,
    miscDetailsLocationWrapper,
    miscDetailsPhoneWrapper,
    reviewsWrapper,
    reviewsHeaderWrapper,
    reviewHeaderText,
    reviewWrapper,
    reviewsHeaderText,
    reviewBottomText,
    defaultText,
    defaultTextUnderline
  } = scrollableModalStyles

  const handleRenderingYelpStarImage = () => {
    return (
      <View>
        {
          rating === 0 ? (<Image source={require('../../assets/yelp-stars/small_0.png')} style={{ height: "100%" }} />) : rating === 0.5 ? (<Image source={require('../../assets/yelp-stars/small_1.png')} style={{ height: "100%" }} />) : rating === 1 ? (<Image source={require('../../assets/yelp-stars/small_1.png')} style={{ height: "100%" }} />) : rating === 1.5 ? (<Image source={require('../../assets/yelp-stars/small_1_half.png')} style={{ height: "100%" }} />) : rating === 2 ? (<Image source={require('../../assets/yelp-stars/small_2.png')} style={{ height: "100%" }} />) : rating === 2.5 ? (<Image source={require('../../assets/yelp-stars/small_2_half.png')} style={{ height: "100%" }} />) : rating === 3 ? (<Image source={require('../../assets/yelp-stars/small_3.png')} style={{ height: "100%" }} />) : rating === 3.5 ? (<Image source={require('../../assets/yelp-stars/small_3_half.png')} />) : rating === 4 ? (<Image source={require('../../assets/yelp-stars/small_4.png')} />) : rating === 4.5 ? (<Image source={require('../../assets/yelp-stars/small_4_half.png')} />) : (<Image source={require('../../assets/yelp-stars/small_5.png')} />)
        }
      </View>
    )
  }

  return (
    <Modal
      // @ts-ignore
      isVisible={props.isModalVisible}
      swipeDirection={['down']}
      onSwipeComplete={ () => props.setIsModalVisible(false) }
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={400 - 300} // content height - ScrollView height
      propagateSwipe={true}
      style={ modal }>
      <View style={ scrollableModal }>
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}>
          <View style={ [closeButtonWrapper, { paddingRight: 40 }] }>
            <TouchableOpacity onPress={ () => props.setIsModalVisible(false) } style={{ width: 20 }} >
              <Text style={ closeButtonText }><AntDesign name="closecircleo" color="white" size={20}  /></Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: primary }}>
            <View style={{ width: "80%" }}>
              <View style={ contentWrapper }>
                <View style={ restrauntHeadingWrapper }>
                  <Text style={ [restrauntHeadingText, { color: green }] }>{name}</Text>
                </View>

                <View style={ restrauntTypesWrapper }>
                  <View style={ restrauntTypesHeadingWrapper }>
                    <Text style={ [restrauntTypesHeadingText, { color: darkOrange }] }>Restraunt Type</Text>
                  </View>

                  <View style={ restrauntTypesCategoriesWrapper }>
                    {
                        categories && categories.map((categorie: any, index: number) => {
                          return (
                            <Text key={index} style={[ defaultText, { color: lightPurple }]}>{categorie.title}</Text>
                          )
                        })
                      }
                  </View>
                </View>

                <View style={ miscDetailsWrapper }>
                  <View style={ miscDetailsHeaderWrapper }>
                    <Text style={ [miscDetailsHeaderText, { color: darkOrange }] }>MISC Details</Text>
                  </View>

                  <View style={ miscDetailsIsOpenWrapper }>
                    <Text style={[ defaultText, { color: lightPurple }]}>{is_closed ? "Closed Now" : "Open Now"}</Text>
                  </View>

                  <View style={ miscDetailsPriceWrapper }>
                    <Text style={[ defaultText, { color: lightPurple }]}>{ price === "$" ? `Price: ${price} Cheap` : price === "$$" ? `Price: ${price} Moderate` : `Price: ${price} Above Average` }</Text>
                  </View>

                  <View style={ miscDetailsWebsiteWrapper } >
                    <TouchableOpacity onPress={() => Linking.openURL(`${url}`)}>
                      <Text style={[ defaultTextUnderline, { color: lightPurple }]}>Website on Yelp</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={ miscDetailsLocationWrapper }>
                    <TouchableOpacity onPress={() => {
                      showLocation({
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        alwaysIncludeGoogle: true
                      })
                    }}>
                      <Text style={[ defaultTextUnderline, { color: lightPurple }]}>Get Directions!</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={ miscDetailsPhoneWrapper }>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
                      <Text style={[ defaultTextUnderline, { color: lightPurple }]}>Call {display_phone}!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: primary, width: "100%" }}>
                { reviews.length > 0 ? (
                  <View style={ reviewsWrapper }>

                    <View style={ reviewsHeaderWrapper }>
                      <Text style={ [reviewsHeaderText, { color: darkOrange }] }>Reviews</Text>
                    </View>

                    <View style={{ flexDirection: "row", minHeight: 30, maxHeight: 100, alignItems: "center", justifyContent: "space-evenly", width: "100%", marginTop: 20 }}>
                      <View style={{ alignItems: "center",justifyContent: "space-evenly", height: "75%" }}>
                        <View style={{ alignItems: "center", justifyContent: "center"}}>
                          <Text style={[ defaultText, { color: lightPurple }]}>Rated: </Text>
                        </View>

                        <View>
                          {
                            handleRenderingYelpStarImage()
                          }
                        </View>
                      </View>

                      <View style={{ justifyContent: "space-evenly", minHeight: 30, maxHeight: 100, }}>
                        <Text style={[ defaultText, { color: lightPurple, textAlign: "center", marginTop: 2.5 }]}>Out of:</Text>
                        <Text style={[ defaultText, { color: lightPurple, textAlign: "center", marginTop: 2.5 }]}>{review_count} reviews.</Text>
                      </View>
                    </View>

                    {
                      reviews.map((review: any) => {
                        const { url } = review
                        return (
                          <View key={review.id} style={ [reviewWrapper, { width: "100%" }] }>
                            <Text style={ [reviewHeaderText, { color: darkOrange }] }>Written By: {review.user.name.trim()} on Yelp</Text>
                            <Text style={ [reviewBottomText, { color: lightPurple }] }>{review.text.trim()}</Text>

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
                  <View style={{ height: 200, alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator size="small" color={white} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}