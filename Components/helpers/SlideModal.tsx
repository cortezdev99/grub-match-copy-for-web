import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import Modal from 'react-native-modal';

// Custom Components
import Text from '../helpers/Text'
import { white, green, lightPurple } from '../../Styles/variables';
import ScrollableModal from './ScrollModal'

interface ISlideModalProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
  card: any;
  usersWhoMatched?: any;
  setUsersWhoMatched?: any;
  username?: string;
}

export default (props: ISlideModalProps) => {
  const [scrollModalOpen, setScrollModalOpen] = useState(false)

  const handleUsersToBeRendered = () => {
    const filteredUsersWhoMatch = props.usersWhoMatched.filter((user: string) => user !== props.username)
    return (
      <View style ={{ width: "100%", alignItems: "center", paddingLeft: 15, paddingRight: 15, height: 40 }}>
        {
          filteredUsersWhoMatch.length > 1 ? (
            <View>
              <Text style={{ color: lightPurple, fontSize: RFValue(22, 896), fontWeight: "500" }}>You,</Text>
            </View>
          ) : (
            <View />
          )
        }

        <View style={{  flexDirection: "row" }}>
          {
            filteredUsersWhoMatch.length === 1 ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: lightPurple, fontSize: RFValue(22, 896), fontWeight: "500" }}>You and </Text>

                {
                  filteredUsersWhoMatch.map((user: any, index: number) => {
                    return (
                      <Text key={index} style={{ color: lightPurple, fontSize: RFValue(22, 896), fontWeight: "500" }}>{user}</Text>
                    )
                  })
                }
            </View>
            ) : (
              <View style={{ justifyContent: "space-evenly", alignItems: "center" }}>
                {
                  filteredUsersWhoMatch.map((user: any, index: number) => {
                    if (index + 1 !== filteredUsersWhoMatch.length) {
                      return (
                        <Text key={index} style={{ color: lightPurple, fontSize: RFValue(22, 896), fontWeight: "500" }}> {user}, </Text>
                      )
                    } else {
                      return (
                        <Text key={index} style={{ color: lightPurple, fontSize: RFValue(22, 896), fontWeight: "500" }}> and {user}</Text>
                      )
                    }
                  })
                }
              </View>
            )
          }
        </View>

        <View>
          <Text style={{ color: lightPurple, fontSize: RFValue(22, 896), fontWeight: "500" }}> like this restaurant!</Text>
        </View>
      </View>
    )
  }

  return (
    <Modal
      isVisible={props.isModalVisible}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      backdropOpacity={0.9}
    >

    <View style={{ height: "100%", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
      <View style={{ alignItems: "center" }}>
          {
            props.usersWhoMatched ? (
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text font="fancy-bold" style={{ color: green, fontSize: RFValue(35, 896), fontWeight: "500" }}>Its a</Text>
                  <View style={[{ paddingLeft: 7, marginTop: 8 }, {
                    transform: [
                      { skewX: "-15deg" }
                    ]
                  }]}>
                    <Text font="norm" style={{ color: green, fontSize: RFValue(35, 896), fontWeight: "500"}}>M</Text>
                  </View>
                  <Text font="fancy-bold" style={{ color: green, fontSize: RFValue(35, 896), fontWeight: "500" }}>atch!</Text>
                </View>
                {
                  handleUsersToBeRendered()
                }
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text font="fancy-bold" style={{ fontSize: RFValue(40, 896), color: green, fontWeight: "500" }}>
                  You liked
                </Text>

                <Text style={{ fontSize: RFValue(28, 896), color: lightPurple, textAlign: "center", fontWeight: "500" }}>
                  {props.card.name}
                </Text>
              </View>
            )
          }
      </View>

      {
        props.usersWhoMatched ? (
          <View style={{ alignItems: "center" }}>
            <Text font="fancy-bold" style={{ color: green, fontSize: RFValue(35, 896) }}>Restaurant</Text>
            <Text style={{ fontSize: RFValue(25, 896), color: lightPurple, textAlign: "center", fontWeight: "500" }}>{props.card.name}</Text>
          </View>
        ) : (
          <View />
        )
      }

      

      <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
        <TouchableOpacity onPress={() => setScrollModalOpen(true)}>
          <Text style={{ fontSize: RFValue(20, 896), color: green, fontWeight: "500" }}>See details</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          if (props.usersWhoMatched && props.usersWhoMatched.length > 0) {
            props.setUsersWhoMatched([])
          }

          return props.setIsModalVisible(false)
        }}>
          <Text style={{ fontSize: RFValue(20, 896), color: white, fontWeight: "500" }}>Continue Swiping</Text>
        </TouchableOpacity>
      </View>
      <ScrollableModal isModalVisible={scrollModalOpen} setIsModalVisible={setScrollModalOpen} card={props.card} />
    </View>
  </Modal>
  );
}