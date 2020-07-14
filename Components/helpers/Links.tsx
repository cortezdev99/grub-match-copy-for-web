import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

// Custom Components
import Text from './Text'
import { white, green } from '../../Styles/variables'

interface ILinksProps {
  headingText: string;
  headingTextStyles?: any;
  buttonText: string;
  buttonTextStyles?: any;
  action: any;
}

export default (props: ILinksProps) => {
  return (
    <View style={{ height: 100, alignItems: "center", justifyContent: "center", width: "100%" }}>
      <View style={{ borderBottomColor: white, borderBottomWidth: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
        <Text style={[{ fontSize: RFValue(22, 896), color: green }, props.headingTextStyles]}>{props.headingText}</Text>
      </View>

      <TouchableOpacity onPress={props.action} style={{ marginTop: 10, width: "100%", alignItems: "center", justifyContent: "center", height: 40 }}>
        <Text style={[{ color: white, fontSize: RFValue(16, 896), textDecorationLine: 'underline' }, props.buttonTextStyles]}>{props.buttonText}</Text>
      </TouchableOpacity>
    </View>
  )
}