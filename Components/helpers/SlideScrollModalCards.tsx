import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import Modal from 'react-native-modal';

// Custom Components
import Text from '../helpers/Text'
import { white, green, lightPurple } from '../../Styles/variables';
import ScrollModal from './ScrollModal';
import slideScrollModalStyles from '../../Styles/slideScrollModalStyles'

interface ISlideModalProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
  restraunts: any;
  setRestraunts: any;
}

export default (props: ISlideModalProps) => {
  var scrollViewRef: React.RefObject<ScrollView>;
  scrollViewRef = React.createRef();
  const [scrollOffset, setScrollOffset] = useState()
  const [card, setCard] = useState({})
  const [scrollModalOpen, setScrollModalOpen] = useState(false)

  const handleOnScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y)
  };

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleRestrauntPress = (restraunt: any) => {
    setCard(restraunt)
    setScrollModalOpen(true)
  }

  const {
    closeButtonWrapper,
    closeButtonText,
    contentWrapper,
    restrauntWrapper,
    restrauntTitleText,
    noRestrauntsLikedWrapper,
    noRestrauntsLikedTopText,
    noRestrauntsLikedBottomText,
    defaultText
  } = slideScrollModalStyles

  return (
    <Modal
      isVisible={props.isModalVisible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropOpacity={0.9}
      swipeDirection={['down']}
      onSwipeComplete={ () => { props.setIsModalVisible(false), props.setRestraunts([]) }}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      propagateSwipe={true}
      style={{ justifyContent: 'flex-start', margin: 0 }}
    >
        <ScrollView  ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          style={{ marginTop: 50, flex: 1 }}
        >
        <ScrollModal isModalVisible={scrollModalOpen} setIsModalVisible={setScrollModalOpen}  card={card} />

        <View>
          <View  style={ closeButtonWrapper }>
            <TouchableOpacity onPress={ () => { props.setIsModalVisible(false), props.setRestraunts([]) }} style={{ width: 20 }} >
              <Text style={ closeButtonText }><AntDesign name="closecircleo" color={white} size={20}  /></Text>
            </TouchableOpacity>
          </View>

          <View style={ contentWrapper }>
            {
              props.restraunts.length > 0 ? (
                <View>
                  <View style={{ paddingTop: 50, paddingBottom: 50 }}>
                    <Text font="fancy-bold" style={{ fontSize: RFValue(25, 896), color: green, textAlign: "center" }}>Liked Restraunts</Text>
                  </View>

                  {
                    props.restraunts.map((restraunt: any, index: number) => {
                      // console.log(restraunt)
                      return (
                        <View key={index} style={ restrauntWrapper }>
                          <Text style={ [restrauntTitleText, { color: lightPurple }] }>{restraunt.name}</Text>

                          <TouchableOpacity onPress={() => handleRestrauntPress(restraunt)}>
                            <Text style={ defaultText }>See Details</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    })
                  }
                </View>
              ) : (
                <View style={ noRestrauntsLikedWrapper }>
                  <Text style={ noRestrauntsLikedTopText }>You currently have no liked restraunts.</Text>
                  <Text style={ noRestrauntsLikedBottomText }>Keep Swiping!</Text>
                </View>
              )
            }
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}