import React, { useRef, useState } from 'react'
import { useWindowDimensions, Animated, View, StyleSheet, LayoutChangeEvent } from 'react-native'
import { cards as data } from './data.ts'
import { CardType } from './types'
import { Card } from './Card'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 24
  }
})

type RenderItemArgs = {
  item: CardType
  index: number
}

export const Cards = () => {
  const y = useRef(new Animated.Value(0)).current
  const [height, setHeight] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { height: _height } = event?.nativeEvent?.layout
    setHeight(_height)
  }

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
    useNativeDriver: true
  })

  const keyExtractor = (item: CardType) => item.url

  const renderItem = ({ item, index }: RenderItemArgs) => (
    <Card card={item} {...{ y, index, height }} />
  )

  const { height: windowHeight } = useWindowDimensions()

  /* We need zIndex for bottom cards */
  const CellRendererComponent = ({ children, index, style, ...props }) => {
    const HEIGHT = windowHeight / 3
    const bottomRange = [index * HEIGHT - height, (index + 1) * HEIGHT - height]
    const zIndex = y.interpolate({
      inputRange: bottomRange,
      outputRange: [0, 10],
      extrapolate: 'clamp'
    })

    const cellStyle = [style, { zIndex }]

    return (
      <Animated.View style={cellStyle} {...{ index }} {...props}>
        {children}
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        {...{
          data,
          renderItem,
          keyExtractor,
          onScroll,
          scrollEventThrottle: 16,
          onLayout,
          CellRendererComponent
        }}
      />
    </View>
  )
}
