import React, { useRef } from 'react'
import {
  Animated,
  Linking,
  Pressable,
  Text,
  Image,
  View,
  StyleSheet,
  useWindowDimensions
} from 'react-native'
import { CardType } from './types'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%'
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: 'flex-end'
  },
  name: {
    fontSize: 24,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: 'white',
    marginBottom: 4
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.1,
    color: 'white'
  }
})

type Props = {
  card: CardType
  index: number
  y: Animated.Value
  height: number
}

export const Card = ({ card, y, index, height }: Props) => {
  const scale = useRef(new Animated.Value(1)).current
  const { height: windowHeight } = useWindowDimensions()
  const HEIGHT = windowHeight / 3

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  const onPress = () => {
    Linking.openURL(card.url)
  }

  /* Start animation when the item touches the top edge: scrollY === index * HEIGHT */
  const topRange = [-100, index * HEIGHT, (index + 1) * HEIGHT]

  const topTranslateY = y.interpolate({
    inputRange: topRange,
    outputRange: [0, 0, HEIGHT * 1.2]
  })

  const topScaleY = y.interpolate({
    inputRange: topRange,
    outputRange: [1, 1, 0.8]
  })

  const topOpacity = y.interpolate({
    inputRange: topRange,
    outputRange: [1, 1, 0]
  })

  /* Start animation when the item should appear from the bottom */
  const bottomRange = [index * HEIGHT - height, (index + 1) * HEIGHT - height]

  const bottomTranslateY = y.interpolate({
    inputRange: bottomRange,
    outputRange: [-1 * HEIGHT, 0],
    extrapolate: 'clamp'
  })

  const bottomScaleY = y.interpolate({
    inputRange: bottomRange,
    outputRange: [0.8, 1],
    extrapolateRight: 'clamp'
  })

  const bottomOpacity = y.interpolate({
    inputRange: bottomRange,
    outputRange: [0, 1],
    extrapolateRight: 'clamp'
  })

  return (
    <Pressable {...{ onPress, onPressIn, onPressOut }}>
      <Animated.View
        style={[
          styles.container,
          {
            height: HEIGHT,
            opacity: Animated.multiply(topOpacity, bottomOpacity)
          },
          {
            transform: [
              { scale: topScaleY },
              { scale: bottomScaleY },
              { translateY: topTranslateY },
              { translateY: bottomTranslateY }
            ]
          }
        ]}
        {...{ onPress, onPressIn, onPressOut }}
      >
        <Image source={card.image} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.author}>{`by ${card.author}`}</Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}
