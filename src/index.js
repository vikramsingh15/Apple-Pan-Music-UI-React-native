import React, {Component} from 'react';
import {
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  PanResponder,
  ScrollView,
  Slider,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

let View = Animated.View;
let {height, width} = Dimensions.get('window');

class index extends Component {
  state = {
    panPosition: 'down',
  };
  UNSAFE_componentWillMount() {
    this.startHeight = height * 0.9;

    this.position = new Animated.ValueXY({x: 0, y: this.startHeight});
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        //dy<0 means on swipe up
        if (gestureState.dy < 0 && this.state.panPosition == 'down') {
          return true;
        }
        if (gestureState.dy > 0 && this.state.panPosition == 'top') return true;

        return false;
      },
      onPanResponderGrant: () => {
        //on touch modal doesn' move to x,y(0,0)
        this.position.extractOffset();
      },
      onPanResponderMove: (event, gestureState) => {
        this.position.setValue({x: 0, y: gestureState.dy});
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < 0) {
          this.setState({panPosition: 'top'});
          Animated.spring(this.position.y, {
            toValue: -height + 90,
            tension: 1,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy > 0) {
          this.setState({panPosition: 'down'});
          Animated.spring(this.position.y, {
            toValue: height - 90,
            tension: 1,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }

  render() {
    this.animatedImageHeight = this.position.y.interpolate({
      inputRange: [0, this.startHeight],
      outputRange: [250, 40],
      extrapolate: 'clamp',
    });

    this.animatedHeaderHeight = this.position.y.interpolate({
      inputRange: [0, this.startHeight],
      outputRange: [270, 80],
      extrapolate: 'clamp',
    });

    this.animatedOpacity = this.position.y.interpolate({
      inputRange: [0, height * 0.5, this.startHeight],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    this.animatedMarginLeft = this.position.y.interpolate({
      inputRange: [0, this.startHeight],
      outputRange: [width / 2 - 117, 10],
      extrapolate: 'clamp',
    });

    this.animatedSongDetailOpacity = this.position.y.interpolate({
      inputRange: [0, 0.5 * height, this.startHeight],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    this.animatedSongDetailHeight = this.position.y.interpolate({
      inputRange: [0, height * 0.7, this.startHeight],
      outputRange: [300, 0, 0],
      extrapolate: 'clamp',
    });

    this.animatedBgColor = this.position.y.interpolate({
      inputRange: [0, height - 90],
      outputRange: ['rgba(0,0,0,0.5)', 'white'],
    });

    return (
      <View style={{flex: 1, backgroundColor: this.animatedBgColor}}>
        <View
          {...this.panResponder.panHandlers}
          style={[
            this.position.getTranslateTransform(),
            {
              ...styles.modal,
            },
          ]}>
          <View
            style={{
              ...styles.summary,
              marginLeft: this.animatedMarginLeft,
              alignItems: 'center',
              height: this.animatedHeaderHeight,
            }}>
            <View style={{...styles.imageTitleContainer}}>
              <View
                style={{
                  height: this.animatedImageHeight,
                  width: this.animatedImageHeight,
                }}>
                <Image
                  source={require('./assets/venom.jpg')}
                  style={{...styles.image}}
                />
              </View>
              <Animated.Text
                style={{
                  paddingLeft: 10,
                  fontSize: 18,
                  opacity: this.animatedOpacity,
                }}>
                Venom Eminem (Live)
              </Animated.Text>
            </View>
            <View style={{...styles.icon, opacity: this.animatedOpacity}}>
              <Icon name="md-pause" size={32} />
              <Icon name="md-skip-forward" size={32} />
            </View>
          </View>
          <View
            style={{
              height: this.animatedSongDetailHeight,
              opacity: this.animatedSongDetailOpacity,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 22}}>
                Hotel California (Live)
              </Text>
              <Text style={{fontSize: 18, color: '#fa95ed'}}>
                Eagles - Hell Freezes Over
              </Text>
            </View>
            <View style={{alignItems: 'center', marginVertical: 40}}>
              <Slider
                width="80%"
                step={1}
                minimumValue={18}
                maximumValue={71}
                value={18}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Icon name="md-rewind" size={40} style={{margin: 10}} />
              <Icon name="md-pause" size={50} style={{margin: 10}} />
              <Icon name="md-fastforward" size={40} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  imageTitleContainer: {flexDirection: 'row', alignItems: 'center', flex: 4},
  icon: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },

  image: {
    height: null,
    width: null,
    flex: 1,
  },

  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modal: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
    zIndex: 10,
    height,
    // elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    // alignItems: 'center',
  },
});

export default index;
