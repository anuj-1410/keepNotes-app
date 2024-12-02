import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert,Image, SafeAreaView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import colors from '../misc/colors';
import RoundIconBtn from './RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from '../contexts/NoteProvider';
import NoteInputModal from './NoteInputModal';
import themeContext from '../misc/themeContext';

const formatDate = ms => {
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
};

const NoteDetail = props => {
  const [note, setNote] = useState(props.route.params.note);
  const headerHeight = useHeaderHeight();
  const { setNotes } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const theme = useContext(themeContext);

  const deleteNote = async () => {
    const result = await AsyncStorage.getItem('notes');
    let notes = [];
    if (result !== null) notes = JSON.parse(result);

    const newNotes = notes.filter(n => n.id !== note.id);
    setNotes(newNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    props.navigation.goBack();
  };

  const displayDeleteAlert = () => {
    Alert.alert(
      'Are You Sure!',
      'This action will delete your note permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteNote,
        },
        {
          text: 'No Thanks',
          onPress: () => console.log('no thanks'),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleUpdate = async (title, desc,attachment, time) => {
    const result = await AsyncStorage.getItem('notes');
    let notes = [];
    if (result !== null) notes = JSON.parse(result);

    const newNotes = notes.filter(n => {
      if (n.id === note.id) {
        n.title = title;
        n.desc = desc;
        n.isUpdated = true;
        n.time = time;
        n.attachment = attachment;
        setNote(n);
      }
      return n;
    });

    setNotes(newNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
  };
  const handleOnClose = () => setShowModal(false);

  const openEditModal = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <SafeAreaView style={[styles.containerOuter,{paddingTop:headerHeight, backgroundColor:theme.backgroundColor}]}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor:theme.backgroundColor}]}
      >
        <Text style={[styles.time,{color:theme.color}]}>
          {note.isUpdated
            ? `Updated At ${formatDate(note.time)}`
            : `Created At ${formatDate(note.time)}`}
        </Text>
        <Text style={styles.title}>{note.title}</Text>
      
        <Text style={[styles.desc,{color:theme.color}]}>{note.desc}</Text>
        {note.attachment && <Image source={{ uri: note.attachment.uri }} style={styles.imagePreviewDetails} resizeMode='cover'/>}

      </ScrollView>
      
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName='delete'
          style={{ backgroundColor: colors.ERROR, marginBottom: 15 }}
          onPress={displayDeleteAlert}
        />
        <RoundIconBtn antIconName='edit' onPress={openEditModal} />
      </View>
      
      
      <NoteInputModal
        isEdit={isEdit}
        note={note}
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerOuter:{
   flex:1
  },
  container: {
    paddingHorizontal : 20,
    paddingBottom:200,
  },

  title: {
    fontSize: 30,
    color: colors.PRIMARY,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 20,
    opacity: 0.8,
    marginBottom:10,
  },
  time: {
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.7,
  },
  btnContainer: {
    position: 'absolute',
    right: 20,
    bottom: 50,
  },
  imagePreviewDetails: {
    width: 300,
    height: 200,
    marginTop: 5,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default NoteDetail;
