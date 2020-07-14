import React from 'react'
import { Image } from 'react-native'

const imgPath = require("../../assets/logo.png")

export default () => {
  return (
    <Image source={imgPath} style={{ height: 35, width: 45 }} />
    )
}