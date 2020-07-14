import React from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

// Custom Components
import { dark, white } from '../../Styles/variables'

export default () => {
  return (
    <View style={{ height: "100%", width: "100%", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: dark }}>
      <View style={{ height: "40%", width: "100%" }}>
        <Image 
          source={require('../../assets/icon.png')}
          style={{ height: "100%", width: "100%" }}
          resizeMode={"center"}
        />
      </View>

      <View>
        <Text style={{ fontSize: RFValue(20, 896), color: white }}>Checking Auth Status</Text>

        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator size="large" color={white} />
        </View>
      </View>
    </View>
  )
}