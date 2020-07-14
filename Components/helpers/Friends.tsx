import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import AntDesign from 'react-native-vector-icons/AntDesign'
import 'firebase/firestore'

// Custom Components
import Text from '../helpers/Text'
import FriendComponentStyles from '../../Styles/stacks/friends/FriendComponentStyles'

interface IFriendsProps {
  action?: any
  actionType?: string;
  setAction?: any;
}

export default (props: IFriendsProps) => {
  const [items, setItems] = useState([] as any)
  const [isLoading, setIsLoading] = useState(true)
  const [isResetDone, setIsResetDone] = useState(true)
  const firestore = firebase.firestore()
  // @ts-ignore
  const userRef = firestore.collection('users').doc(firebase.auth().currentUser.uid)

  const handleSettingItems = () => {
    setIsLoading(true)

    userRef.collection('friends').onSnapshot(querySnapshot => {
      setIsLoading(true)

      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          return items.push(change.doc.data())
        } else if (change.type === 'modified') {
          items.push(change.doc.data())
        } else if (change.type === 'removed') {
          return setItems([]), setIsResetDone(false)
        }
      })

      return (
        setIsLoading(false)
      )
    }) 
  }

  useEffect(() => {
    handleSettingItems()
   }, [])

  const handleDeleteFriend = (username: any) => {
    userRef.collection('friends').where('Username', '==', username).get().then(snapshot => {
      snapshot.forEach(doc => {
        userRef.collection('friends').doc(doc.id).delete().then(() => {
          return handleSettingItems
        }).catch((err) => console.log(err))
      })
    })
  }
  const {
    friendContainer,
    friendsListContainer,
    friendsListTextWrapper,
    friendsListText,
    friendsListButtonWrapper,
    friendsListButtonText,
    sharedFriendsContainer,
    sharedFriendsText
  } = FriendComponentStyles

  const setFriendsToSendLink = (username: any) => {
    if (props.action.includes(username.toLowerCase().trim())) {
      alert('You already added that user!')
    } else {
      var currentState = props.action
      currentState.push(username.toLowerCase().trim())
      props.setAction([...currentState])
    }
  }

  const friendsToBeRendered = () => {
  let index = 0;
  
  return (
    <View style={ friendContainer }>
      {
        items.length > 0 && !isLoading ? (
          items.map((user: any) => {
            index += 1
            return (
              <View key={index} style={ friendsListContainer }>
                <View style={ friendsListTextWrapper }>
                  <Text key={index} style={ friendsListText }>{user.Username}</Text>
                </View>

                <View style={ friendsListButtonWrapper }>
                  {
                    props.actionType === 'DELETE_FRIEND' ? (
                      <TouchableOpacity onPress={() => handleDeleteFriend(user.Username)}>
                        <Text style={ friendsListButtonText }><AntDesign name="closesquareo" size={18} /></Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={ () => setFriendsToSendLink(user.Username) }>
                        <Text style={ friendsListButtonText }><AntDesign name="plussquareo" size={18} /></Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              </View>
            )
          })
        ) : (
          items.length == 0 && !isLoading && isResetDone ? (
            <View style={ sharedFriendsContainer }>
              <Text style={ sharedFriendsText }>Add some friends to see them here!</Text>
            </View>
          ) : (
            <View style={ sharedFriendsContainer }>
              <ActivityIndicator size="small" color="white" />
            </View>
          )
        )
      }
    </View>
    )
  }
  

  const handleResetItems = () => {
    setIsLoading(true)
    userRef.collection('friends').onSnapshot(querySnapshot => {
      if (querySnapshot.docs.length > 0  && items.length < querySnapshot.docs.length) {
        querySnapshot.forEach((doc: any) => {
          items.push(doc.data())
        })

        return setIsResetDone(true), setIsLoading(false)
      } else if (querySnapshot.docs.length === 0 && items.length == 0) {
        return setIsResetDone(true), setIsLoading(false)
      }
    })
  }

  if (items.length === 0 && isLoading !== true && !isResetDone) {
    handleResetItems();
  }
  
  return (
    <View>
      { friendsToBeRendered() }
    </View>
  )
}