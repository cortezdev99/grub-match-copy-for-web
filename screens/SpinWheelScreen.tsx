import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  ScrollView,
  ActivityIndicator,
  Platform,
  YellowBox,
TouchableOpacity
} from 'react-native';
import { Svg, G, Text, TSpan, Path } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import { RFValue } from 'react-native-responsive-fontsize'
import * as d3Shape from 'd3-shape';
import * as FacebookAds from 'expo-ads-facebook';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
import * as Location from 'expo-location'

// Custom Components
import TextComp from '../Components/helpers/Text'
import { primary, darkOrange, white, dark } from '../Styles/variables';
import Search from '../Components/helpers/Search';
import SpinWheelScreenModal from '../Components/helpers/SpinWheelScreenModal';



YellowBox.ignoreWarnings([
  'Cannot update during an existing state transition'
])

const makeWheel = (numberOfSegments: any) => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  // @ts-ignore
  const arcs = d3Shape.pie()(data);
  
  const colors = color({
    luminosity: 'dark',
    count: numberOfSegments
  });
  
  var result = arcs.map((arc: any, index: any) => {
    const instance = d3Shape
    .arc()
    .padAngle(0.01)
    .outerRadius(width / 2)
    .innerRadius(20);
    
    return {
      path: instance(arc),
      color: colors[index],
      value: index + 1,
      centroid: instance.centroid(arc)
    };
  });
  
  return _wheelPaths = result
};

const random = require('random')
const { width } = Dimensions.get('screen');
var _wheelPaths: any = makeWheel(4);
var oneTurn = 360;
var numberOfSegments = 4
var angleBySegment = oneTurn / numberOfSegments;
var angleOffset = angleBySegment / 2;
var _angle = new Animated.Value(0);
var angle = 0;

if (width < 740) {
  var wheelSize = width * 0.8;
} else {
  var wheelSize = width * 0.5;
}

var fontSize = RFValue(26, 896);
var knobFill = color({ hue: 'purple' });

export default class SpinWheelScreen extends Component {
  constructor(props: any) {
    super(props)  
  }

  state = {
    enabled: false,
    winner: {},
    setKeysForRestaurants: [{key: 1, value: 'Add a restaurant!'}, {key: 2, value: 'Add a restaurant!'}, {key: 3, value: 'Add a restaurant!'}, {key: 4, value: 'Add a restaurant!'}] as any,
    placeHolderRestaurants: ['Add a restaurant!', 'Add a restaurant!', 'Add a restaurant!', 'Add a restaurant!'] as any,
    restaurants: [] as any,
    noAccessLocation: false,
    location: {},
    modalVisable: false
  };
  
  componentDidMount() {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied, we need access to your location to find restaurants in your area.');
        
        this.setState({
          noAccessLocation: true
        });
      } else {
        let location = await Location.getCurrentPositionAsync({});
        
        this.setState({
          noAccessLocation: false,
          location: location
        })
      }
    })();

    _angle.setValue(0)
    angle = 0;
    numberOfSegments = 4
    angleBySegment = oneTurn / numberOfSegments;
    angleOffset = angleBySegment / 2;
    makeWheel(4)
    
    _angle.addListener(event => {
      angle = event.value;
    });
  }

  render() {
    const _getWinnerIndex = () => {
      const deg = Math.abs(Math.round(angle % oneTurn));

      return (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments;
    };

    const _renderKnob = () => {
      const knobSize = 30;
      const YOLO = Animated.modulo(
        Animated.divide(
          Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
          new Animated.Value(angleBySegment)
          ),
          1
          );
  
      return (
        <Animated.View
          style={{
            width: knobSize,
            height: knobSize * 2,
            justifyContent: 'flex-end',
            alignItems: "center",
            zIndex: 1,
            transform: [
              {
                rotate: YOLO.interpolate({
                  inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                  outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
                })
              }
            ]
          }}
        >
          <Svg
            width={knobSize}
            height={(knobSize * 100) / 57}
            viewBox={`0 0 57 100`}
            style={{ transform: [{ translateY: 8 }] }}
          >
            <Path
              d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
              fill={knobFill}
            />
          </Svg>
        </Animated.View>
      );
    };

    const _renderSvgWheel = () => {

      return (
        <View style={{ width: "100%", alignItems: "center" }}>
          {_renderKnob()}
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                {
                  rotate: _angle.interpolate({
                    inputRange: [-oneTurn, 0, oneTurn],
                    outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                  })
                }
              ]
            }}
          >
            <Svg
              width={wheelSize}
              height={wheelSize}
              viewBox={`0 0 ${width} ${width}`}
              style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
            >
              <G y={width / 2} x={width / 2}>
                {_wheelPaths.map((arc: any, i: any) => {
                  const [x, y] = arc.centroid;
                  const number = arc.value.toString();
                  const segmentsLength = this.state.restaurants.length > 0 ? this.state.restaurants.length : numberOfSegments
                  return (
                    <G key={`arc-${i}`}>
                      <Path d={arc.path} fill={arc.color} />
                      <G
                        rotation={(i * oneTurn) / segmentsLength + angleOffset}
                        origin={`${x}, ${y}`}
                      >
                        <Text
                          x={x}
                          y={y - 70}
                          fill="white"
                          textAnchor="middle"
                          fontSize={fontSize}
                        >
                          { 
                            Array.from({ length: number.length }).map((_, j) => {
                              return (
                                <TSpan
                                  x={x}
                                  dy={fontSize}
                                  key={`arc-${i}-slice-${j}`}
                                >
                                  {number.charAt(j)}
                                </TSpan>
                              );
                            })
                          }
                        </Text>
                      </G>
                    </G>
                  );
                })}
              </G>
            </Svg>
          </Animated.View>
        </View>
        );
      };

    const _onPan = () => {
      this.setState({
        enabled: true
      })
  
    numberOfSegments = this.state.restaurants.length > 0 ? this.state.restaurants.length : this.state.placeHolderRestaurants.length
    const velocityY = random.int(500, 3000)
      Animated.decay(_angle, {
        velocity: velocityY / 200,
        deceleration: 0.999,
        useNativeDriver: true
      }).start(() => {
        _angle.setValue(angle % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(_angle, {
          toValue: snapTo(angle),
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          const winnerIndex = _getWinnerIndex();          
          
          this.setState({
            enabled: false,
            winner: this.state.setKeysForRestaurants[winnerIndex],
            modalVisable: true
          })
          console.log('hit', this.state.modalVisable)
        });
      });
    };    

    const _renderKeys = () => {
      if (this.state.restaurants.length > 0) {
        _wheelPaths.map((path: any, idx: any) => {
          const filteredArray = this.state.setKeysForRestaurants.filter((key: any) => key.key === path.value.toString())
    
          if (this.state.setKeysForRestaurants.length !== _wheelPaths.length) {
            if (this.state.restaurants.length > 0 && filteredArray.length === 0) {
              var currentKeys = this.state.setKeysForRestaurants
              currentKeys.push({ key: path.value.toString(), value: this.state.restaurants[idx] })
              this.setState({
                setKeysForRestaurants: currentKeys
              })
            } else if (filteredArray.length === 0) {
              var currentKeys = this.state.setKeysForRestaurants
              currentKeys.push({ key: path.value.toString(), value: this.state.placeHolderRestaurants[idx] })
              this.setState({
                setKeysForRestaurants: currentKeys
              })
            }
          }
        })
      }
  
      return (
        <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
          {
            this.state.setKeysForRestaurants.length > 0 ? (
            <LinearGradient colors={[darkOrange, "#ff4e00"]} start={[0.65, 0.2]} style={{ borderRadius: 20, width: "100%" }}>
              <View style={{ width: "100%" }}>
                <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginTop: 20 }}>
                  <View style={{ borderBottomWidth: 1, borderColor: dark, width: "80%", alignItems: "center", justifyContent: "center" }}>
                    <TextComp font="norm-semi-bold" style={{ fontSize: RFValue(20, 896) }}>Winning Numbers</TextComp>
                  </View>
                </View>
  
                <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginTop: 20, marginBottom: 20 }}>
                  <View style={{ width: "80%", alignItems: "center", justifyContent: "center" }}>
                    {
                      this.state.setKeysForRestaurants.map((key: any, idx: number) => {
                        return (
                          <View key={`key-${key.key}-idx-${idx}`} style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                            <View style={{ justifyContent: "center", alignItems: "flex-start", width: "20%" }}>
                              <TextComp font="norm-semi-bold" style={{ fontSize: RFValue(18, 896), color: dark }}>
                                {key.key}: 
                              </TextComp>
                            </View>
  
                            <View style={{ justifyContent: "center", alignItems: "flex-end", width: "80%", height: 40 }}>
                              {
                                this.state.restaurants.length > 0 ? (
                                  <TextComp font="norm-semi-bold" style={{ marginLeft: 10, textAlign: "right", width: "100%", fontSize: RFValue(17, 896), color: dark }}>
                                    {key.value.name}
                                  </TextComp>
                                  ) : (
                                  <TextComp font="norm-semi-bold" style={{ marginLeft: 10, textAlign: "right", width: "100%", fontSize: RFValue(17, 896), color: dark }}>
                                    {key.value}
                                  </TextComp>
                                )
                              }
                            </View>
                          </View>
                          )
                        })
                      }
                    </View>
                  </View>
                </View>
              </LinearGradient>
            ) : (
              <ActivityIndicator size="small" color={white} />
            )
          }
        </View>
      )
    }

    const handleSettingRestaurantState = (resp: any) => {
      var currentRestaurantState = [...this.state.restaurants]
      currentRestaurantState.push(resp.data.businesses[0])
      if (this.state.setKeysForRestaurants.length === this.state.placeHolderRestaurants.length) {
        _angle.setValue(0)
        angle = 0;

        this.setState({
          setKeysForRestaurants: []
        })
      }

      this.setState({
        restaurants: currentRestaurantState
      })

      numberOfSegments = this.state.restaurants + 1
      var currentRestaurantLength = this.state.restaurants.length + 1
      angleBySegment = oneTurn / (currentRestaurantLength);
      angleOffset = angleBySegment / 2;
      return makeWheel(this.state.restaurants.length + 1)
    }

    const setModalVisibleCallback = () => {
      this.setState({
        modalVisable: false,
        winner: {}
      })

      if (this.state.restaurants.length > 0) {
        if (Platform.OS === "ios") {
          FacebookAds.InterstitialAdManager.showAd('189255192517582_189300992513002').then(() => {
            console.log('shown')
          }).catch((err: any) => {
            console.log(err)
          })
        } else if (Platform.OS === "android") {
          FacebookAds.InterstitialAdManager.showAd('2699941510250499_2699942066917110').then(() => {
            console.log('shown')
          }).catch((err) => {
            console.log(err, 'ERROR')
          })
        }
      }
    }

    return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: "space-around" }}>
      <SpinWheelScreenModal isModalVisible={this.state.modalVisable} setIsModalVisible={setModalVisibleCallback} winner={this.state.winner} />
      <View style={{ height: "100%", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
        <View style={{ width: "80%", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
          <Search searchType="RESTAURANT_EXISTS" location={this.state.location} action={this.state.restaurants} setAction={(resp: any) => handleSettingRestaurantState(resp)} />
        </View>

        <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center", width: "80%" }}>
          {_renderKeys()}
        </View>


        <View style={{ marginTop: 40, marginBottom: 50 }}>
          {_renderSvgWheel()}
        </View>

        <View style={{ width: "80%", justifyContent: "center", marginBottom: 50 }}>
          {
            this.state.enabled ? (
              <TouchableOpacity style={{ width: "100%", height: 40, alignItems: "center", justifyContent: "center", borderColor: darkOrange, borderWidth: 1, borderRadius: 5, backgroundColor: darkOrange }}>
                <TextComp style={{ color: dark }}>Spining!</TextComp>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={_onPan} style={{ width: "100%", height: 40, alignItems: "center", justifyContent: "center", borderColor: darkOrange, borderWidth: 1, borderRadius: 5, backgroundColor: darkOrange }}>
                <TextComp style={{ color: dark }}>Spin</TextComp>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 80,
    backgroundColor: primary
  },
  winnerText: {
    fontSize: RFValue(32, 896),
    color: darkOrange,
    fontFamily: 'Menlo',
    position: 'absolute',
    bottom: 10
  }
});