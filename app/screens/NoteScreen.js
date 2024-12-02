import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Note from '../components/Note';
import NoteInputModal from '../components/NoteInputModal';
import NotFound from '../components/NotFound';
import RoundIconBtn from '../components/RoundIconBtn';
import SearchBar from '../components/SearchBar';
import { useNotes } from '../contexts/NoteProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../components/Sidebar';
import SettingBtn from '../components/SettingBtn';
import themeContext from '../misc/themeContext';
import colors from '../misc/colors';

const reverseData = data => {
  return data.sort((a, b) => {
    const aInt = parseInt(a.time);
    const bInt = parseInt(b.time);
    if (aInt < bInt) return 1;
    if (aInt == bInt) return 0;
    if (aInt > bInt) return -1;
  });
};

const NoteScreen = ({ user,setUser, navigation }) => {
  const [greet, setGreet] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultNotFound, setResultNotFound] = useState(false);
  const [visibleSet,setVisibleSet] = useState(false);
  const theme = useContext(themeContext);

  const { notes, setNotes, findNotes } = useNotes();

  const findGreet = () => {
    const hrs = new Date().getHours();
    if (hrs === 0 || hrs < 12) return setGreet('Morning');
    if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
    setGreet('Evening');
  };

  useEffect(() => {
    findGreet();
  }, []);

  const reverseNotes = reverseData(notes);

  const handleOnSubmit = async (title, desc,attachment) => {
    const note = { id: Date.now(), title, desc,attachment, time: Date.now() };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const openNote = note => {
    navigation.navigate('NoteDetail', { note });
  };

  const handleOnSearchInput = async text => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchQuery('');
      setResultNotFound(false);
      return await findNotes();
    }
    const filteredNotes = notes.filter(note => {
      if (note.title.toLowerCase().includes(text.toLowerCase())) {
        return note;
      }
    });

    if (filteredNotes.length) {
      setNotes([...filteredNotes]);
    } else {
      setResultNotFound(true);
    }
  };

  const handleOnClear = async () => {
    setSearchQuery('');
    setResultNotFound(false);
    await findNotes();
  };

  const handleVisibleSet=()=>{
    setVisibleSet(!visibleSet);
  }

  return (
    <>
      <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundColor} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container,{backgroundColor:theme.backgroundColor}]}>

          {visibleSet && <Sidebar userName={user} setUser={setUser} setVisibleSet={()=>{setVisibleSet(!visibleSet)}}/>}
            
          <Text style={[styles.header,{color:theme.color}]}>{`Good ${greet} ${user.name}`}</Text>
          {notes.length ? (
            <SearchBar
              value={searchQuery}
              onChangeText={handleOnSearchInput}
              containerStyle={{ marginVertical: 15}}
              onClear={handleOnClear}
            />
          ) : null}

          {resultNotFound ? (
            <NotFound />
          ) : (
            <FlatList
              data={reverseNotes}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Note onPress={() => openNote(item)} item={item} />
              )}
            />
          )}

          {!notes.length ? (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                styles.emptyHeaderContainer,
              ]}
            >
              <Text style={[styles.emptyHeader,{color:colors.WARNBACK}]}>Add Notes</Text>
            </View>
          ) : null}
      <View style={styles.homeBtn}>
        <RoundIconBtn
          onPress={() => setModalVisible(true)}
          antIconName='plus'
          style={{marginBottom:15}}
        />
        <SettingBtn 
        onPress={handleVisibleSet}
        ionIconName='settings'
        />
      </View>

      
      </SafeAreaView>
      </TouchableWithoutFeedback>
      <NoteInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmit}
      />
    </>
  );
};

const widthWin = Dimensions.get('window').width;
const heightWin = Dimensions.get('window').height;
const widthScreen = Dimensions.get('screen').width;
const heightScreen = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    zIndex: 1,
  },
  emptyHeader: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    opacity: 0.5,
  },
  emptyHeaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  homeBtn: {
    position: 'absolute',
    right: 20,
    bottom: (heightScreen-heightWin)+10,
    zIndex: 1,
  },
});

export default NoteScreen;
