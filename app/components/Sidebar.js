import { Dimensions, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import colors from '../misc/colors';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import themeContext from '../misc/themeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const Sidebar = ({ userName, setUser, setVisibleSet }) => {
  const [changeName, setChangeName] = useState(false);
  const [newName, setNewName] = useState(userName.name);
  const [lengthStr , setLengthStr] = useState(true);
  const [appear, setAppear] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useContext(themeContext);

  const handleChangeName = () => {
    setChangeName(!changeName);
  };

  const handleSaveName = async () => {
    if (newName.trim().length >=3) {
      const updatedUser = { ...userName, name: newName.trim() };
      setUser(updatedUser);

      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User updated in AsyncStorage:', updatedUser);
      } catch (error) {
        console.error('Error saving updated user to AsyncStorage:', error);
      }

      setChangeName(false);
      setLengthStr(true);
    }
    else{
        setLengthStr(false);
    }
  };

  const handleAppear=()=>{
    setAppear(!appear);
  }

  const checker=()=>{
    if(changeName === false && appear === false){
      return true;
    }
    else if((changeName === true && appear === false)||(changeName === false && appear === true)){
      return false;
    }
  }

  const handleBack=()=>{
    if(changeName===true){
      setChangeName(false);
    }
    else if(appear===true){
      setAppear(!appear);
    }
    
  }

  const handleLightThemeChange =()=>{
    setDarkMode(false);
    EventRegister.emit('ChangeTheme',false);
  }

  const handleDarkThemeChange =()=>{
    setDarkMode(true);
    EventRegister.emit('ChangeTheme',true);
  }

  return (
    <BlurView style={styles.outer} intensity={60} tint={theme.theme==="dark" ? "default" : "dark"}>
      <View style={[styles.inner,{backgroundColor:theme.backgroundColor}]}>
        <View style={styles.setHead}>
          {(changeName || appear) && (
            <TouchableHighlight style={styles.iconBack} onPress={handleBack} underlayColor={colors.WARNBACK}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={theme.color}
            />
            </TouchableHighlight>
          )}
          <Text style={[styles.head,{color:theme.color}]}>Setting</Text>
          <TouchableHighlight style={styles.iconClose} onPress={setVisibleSet} underlayColor={colors.WARNBACK}>
          <Fontisto name="close" size={24} color={theme.color}/>
          </TouchableHighlight>
        </View>
        {checker() && (
          <>
            <TouchableOpacity onPress={handleChangeName}>
              <View style={styles.innerTxt}>
                <Text style={{fontWeight:600, fontSize:15}}>Change User Name</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAppear}>
              <View style={styles.innerTxt}>
                <Text style={{fontWeight:600, fontSize:15}}>Appearance</Text>
              </View>
            </TouchableOpacity>
            
          </>
        )}
        {changeName && (
          <View>
            <Text style={{ marginBottom: 10, marginLeft:10, fontWeight: 500, fontSize:15, color:theme.color }}>User Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={[styles.textUser,{color:theme.color}]}
              placeholder="Enter new username"
            />
            {!lengthStr && <Text style={{color:colors.ERROR, alignSelf:'center',marginVertical:5}}>It must be of atleast 3 letters</Text> }
            <TouchableOpacity style={styles.subBtn} onPress={handleSaveName}>
              <Text style={{fontWeight:600, fontSize:15}}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
        {appear && (
          <>
          <TouchableOpacity onPress={handleLightThemeChange}>
            <View style={[styles.innerTxtTheme,
              {borderColor:colors.DARK,borderWidth:(theme.theme==="dark" ? null : 3 )}]}>
              <Text style={{fontWeight:600, fontSize:15}}>Light Mode</Text>
              <MaterialIcons name="light-mode" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDarkThemeChange}>
            <View style={[styles.innerTxtTheme,
              {borderColor:colors.LIGHT,borderWidth:(theme.theme==="dark" ? 3 : null )}]}>
              <Text style={{fontWeight:600, fontSize:15}}>Dark Mode</Text>
              <MaterialIcons name="dark-mode" size={24} color="black" />
            </View>
          </TouchableOpacity>
          
          </>
        )}
      </View>
    </BlurView>
  );
};

export default Sidebar;

const widthWin = Dimensions.get('window').width;
const heightWin = Dimensions.get('window').height;
const widthScreen = Dimensions.get('screen').width;
const heightScreen = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    position: 'absolute',
    height: heightScreen,
    width: widthScreen,
    zIndex: 100,
  },
  inner: {
    width: 240,
    height: 250,
    backgroundColor: colors.LIGHT,
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    left: (widthWin - 240) / 2,
    top: (heightWin - 250) / 2,
    zIndex:2,
  },
  setHead: {
    width: 240,
    marginBottom: 20,
  },
  head: {
    alignSelf: 'center',
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  innerTxt: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    borderRadius: 25,
    backgroundColor: colors.PRIMARY,
    width: 210,
    margin: 5,
    marginBottom: 10,
  },
  innerTxtTheme: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 22,
    borderRadius: 25,
    backgroundColor: colors.PRIMARY,
    width: 210,
    margin: 5,
    marginBottom: 10,
    flexDirection:'row',
  },
  iconClose: {
    position: 'absolute',
    right: 5,
    top: 5,
    padding:10,
    borderRadius:50,
  },
  iconBack: {
    position: 'absolute',
    left: 5,
    top: 5,
    padding:10,
    borderRadius:50,
  },
  subBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
    width: 120,
    alignSelf: 'center',
  },
  textUser: {
    borderWidth: 2,
    borderColor: colors.PRIMARY,
    height: 50,
    width: 200,
    borderRadius: 20,
    fontSize: 15,
    textAlign:'center',
    fontWeight:600,
  },
});
