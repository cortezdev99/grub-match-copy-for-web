import React from 'react'
import { View } from 'react-native'

// Custom Components
import BottomNavBar from '../../utils/BottomNavBar'
import containerStyles from '../../Styles/containerStyles'

interface IContainerProps {
  children: any,
  navigation: {
    navigate: (arg: string) => void
  },
  style?: any
}

export default (props: IContainerProps) => {
  return (
    <View style={containerStyles.container}>
      {props.children}

      <BottomNavBar navigation={props.navigation}/>
    </View>
  )
}