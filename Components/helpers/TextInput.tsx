import React from 'react'
import { TextInput } from 'react-native'

// Custom Components
import { white } from '../../Styles/variables'

interface ITextInputProps {
  value: string;
  placeholder: string;
  onChangeText: (arg: string) => void;
  style?: Object | undefined;
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
  autoCapitalize?: any
}

export default (props: ITextInputProps) => {
  const defaultStyles = { 
    backgroundColor: white,
    borderRadius: 20,
    height: 40,
    paddingLeft: 20,
    width: "100%"
  }

  const style = props.style ? props.style : defaultStyles
  
  const allProps = Object.assign({}, props, {style: style})

  return (
    <TextInput 
      {...allProps}
    />
  )
}