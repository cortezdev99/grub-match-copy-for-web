import React from 'react'
import { Text } from 'react-native'

interface ITextProps {
  children: any
  font?: string
  style?: any
  key?: number
}

export default (props: ITextProps) => {
  const setFontType = (type: string) => {
    switch (type) {
      case 'norm-medium':
        return 'normal-medium'
      case 'norm-semi-bold':
        return 'normal-semi-bold'
      case 'fancy':
        return 'fancy-regular'
      case 'fancy-bold':
        return 'fancy-bold'
      default:
        return 'normal'
    }
  }
  const font = setFontType(props.font ? props.font : 'norm-semi-bold')
  const style = [
    {
      fontFamily: font
    },
    props.style || {}
  ]
  const allProps = Object.assign({}, props, {style: style})

  return <Text {...allProps} >{props.children}</Text>
}