import React, { useState } from 'react'
import HomeScreenContext from '../contexts/HomeScreenContext'

interface IHomeScreenProviderProps {
  children: any;
}

export default (props: IHomeScreenProviderProps) => {
  const [onSpinner, setOnSpinner] = useState(false)

  const stateValues = {
    onSpinner,
    setOnSpinner
  }

  return (
    <HomeScreenContext.Provider value={stateValues}>
      {props.children}
    </HomeScreenContext.Provider>
  )
}