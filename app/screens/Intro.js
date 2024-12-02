import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RoundIconBtn from '../components/RoundIconBtn';
import colors from '../misc/colors';
import icon from '../misc/icon.png';

const Intro = ({ onFinish }) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    const user = { name: name };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    if (onFinish) onFinish();
  };

  return (
    <>
      <StatusBar hidden />
      <SafeAreaView style={[styles.container]}>
        <Image source={icon} style={styles.iconIntro} resizeMode='cover'/>
        <Text style={[styles.inputTitle]}>Enter Your Name to Continue</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder='User Name'
          style={[styles.textInput]}
        />
        {name.trim().length >= 3 ? (
          <RoundIconBtn antIconName='arrowright' onPress={handleSubmit} />
        ) : null}
      </SafeAreaView>
    </>
  );
};


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"flex-start",
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.PRIMARY,
    color: colors.PRIMARY,
    width : width-50,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 22,
    marginBottom: 15,
  },
  inputTitle: {
    alignSelf: 'flex-start',
    paddingLeft: 30,
    marginBottom: 5,
    opacity: 0.5,
    fontSize:18
  },
  iconIntro:{
    height:200,
    width:200,
    marginTop:100,
    marginBottom:50,
  }
});

export default Intro;
