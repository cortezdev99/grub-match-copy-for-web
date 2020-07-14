import React from 'react'
import { TouchableOpacity } from 'react-native'

// Custom Components
import Text from '../helpers/Text'

interface IButtonProps {
  text: string;
  action?: any;
  styleWrapper?: any;
  styleButton?: any;
  disabled?: boolean;
}

const Button = (props: IButtonProps) => {
  return (
    <TouchableOpacity onPress={props.action ? props.action : null } style={props.styleWrapper} {...props}>
      <Text style={ props.styleButton } {...props}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default Button