import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../misc/colors';
import Animated, { Easing, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const AniSetBtn = ({ ionAIconName, onPressBtn ,anime, style }) => {
  const rotate = useSharedValue(0);

  const rotateAnimation = () => {
    rotate.value = withTiming(rotate.value === 0 ? 1 : 0, {
      duration: 500,
      easing: Easing.linear,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value * 90}deg` }],
    };
  });

  const handleCLick = () => {
    onPressBtn();
    if(anime){rotateAnimation();}  
  };

  return (
    <TouchableHighlight onPress={handleCLick} underlayColor={""}>
      <Animated.View style={[styles.iconAnime,{...style},(anime ? animatedStyle : null)]}>
        <Ionicons name={ionAIconName} size={24} color="black" />
      </Animated.View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  iconAnime: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    zIndex: 2,
  },
});

export default AniSetBtn;
