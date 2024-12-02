import React, { useContext } from 'react';
import { View, StyleSheet, TextInput, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../misc/colors';
import themeContext from '../misc/themeContext';

const SearchBar = ({ containerStyle, value, onClear, onChangeText }) => {
  const theme = useContext(themeContext);
  return (
    <View style={[styles.container, { ...containerStyle ,  backgroundColor : theme.search}]}>
      <Ionicons name="search" size={24} color={theme.color} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.searchBar,{color:theme.color}]}
        placeholder='Search here...'
        placeholderTextColor={colors.WARNBACK}
      />
      {value ? (
        <Ionicons name="close-circle" size={24} color={theme.color} onPress={onClear}
        style={styles.clearIcon}/>
      ) : null}
    </View>
  );
};

const widthWin = Dimensions.get('window').width;

const styles = StyleSheet.create({
  searchBar: {
    height: 45,
    paddingHorizontal: 45,
    fontSize: 15,
  },
  container: {
    borderRadius: 40,
    justifyContent: 'center',
    width: widthWin - 30,
    alignSelf:'center',
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
  },
  searchIcon:{
    position:'absolute',
    marginLeft:10,
  },
});

export default SearchBar;
