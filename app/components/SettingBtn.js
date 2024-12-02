import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../misc/colors';

const SettingBtn = ({ ionIconName, style, onPress}) => {

  return (
    <TouchableHighlight style={[styles.icon, style ]} onPress={onPress} underlayColor={colors.SECONDARY}>

        <Ionicons name={ionIconName} size={24} color="black" />

    </TouchableHighlight>
    
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    zIndex:2,
  },
});

export default SettingBtn;
