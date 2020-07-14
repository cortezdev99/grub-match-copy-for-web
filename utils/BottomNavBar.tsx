import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
// @ts-ignore
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5'
// @ts-ignore
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import bottomTabStyles from '../Styles/bottomTabStyles'

interface IBottomNavBarProps {
  navigation: {
    navigate: (arg: string) => void
  }
}

const BottomNavBar = (props: IBottomNavBarProps) => {
  return (
    <View style={bottomTabStyles.container}>
      <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
        <FontAwesome5Icons name="home" color="white" size={30} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate("Friends")}>
        <MaterialCommunityIcons name="account-multiple-plus" color="white" size={47} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => props.navigation.navigate("DuoMatch")}>
        <FontAwesome5Icons name="users" color="white" size={30} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate("Settings")}>
        <FontAwesomeIcons name="gear" color="white" size={30} />
      </TouchableOpacity>
    </View>
  )
}

export default BottomNavBar