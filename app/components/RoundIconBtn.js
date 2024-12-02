import React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';

const RoundIconBtn = ({ antIconName, size, color, style, onPress, text }) => {
  return (
    <TouchableHighlight style={[styles.icon, { ...style }]} onPress={onPress} underlayColor={colors.SECONDARY}>
      <View style={{flexDirection:'row',justifyContent:"space-between", alignItems:'center'}}>
        <AntDesign
        name={antIconName}
        size={size || 24}
        color={color || colors.DARK}  
        />
        {text && <Text style={{marginLeft:7, fontWeight:600}}>{text}</Text>}
      </View>
    </TouchableHighlight> 
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    zIndex:5
  },
});

export default RoundIconBtn;
