import React, { useContext } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

// Custom Components
import Text from '../helpers/Text'
import HomeScreenContext from '../../contexts/HomeScreenContext'
import { white, darkOrange } from '../../Styles/variables'

const imgPath = require("../../assets/logo.png")

export default () => {
  const { onSpinner, setOnSpinner } = useContext(HomeScreenContext)
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity style={{ paddingRight: 50 }} onPress={() => setOnSpinner(false)}>
        {
          onSpinner ? (
            <Text style={{ color: white, fontSize: RFValue(16, 896) }}>Swipe</Text>
          ) : (
            <Text style={{ color: darkOrange, fontSize: RFValue(16, 896) }}>Swipe</Text>
          )
        }
      </TouchableOpacity>

      <Image source={imgPath} style={{ height: 35, width: 45 }} />
      
      <TouchableOpacity style={{ paddingLeft: 50 }} onPress={() => setOnSpinner(true)}>
        {
          onSpinner ? (
            <Text style={{ color: darkOrange, fontSize: RFValue(16, 896) }}>Spin    </Text>
          ) : (
            <Text style={{ color: white, fontSize: RFValue(16, 896) }}>Spin    </Text>
          )
        }
      </TouchableOpacity>
    </View>
  )
}