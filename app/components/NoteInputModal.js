import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../misc/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingBtn from './SettingBtn';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import themeContext from '../misc/themeContext';
import RoundIconBtn from './RoundIconBtn';

const NoteInputModal = ({ visible, onClose, onSubmit, note, isEdit }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [warnValue, setWarnValue] = useState('');
  const theme = useContext(themeContext);
  const [imgDelete, setImgDelete] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your photo library.');
      }
    })();

    if (isEdit) {
      setTitle(note.title);
      setDesc(note.desc);
      setAttachment(note.attachment || null);
    }
    setWarnValue('');
  }, [isEdit]);

  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  const handleOnChangeText = (text, valueFor) => {
    if (valueFor === 'title') setTitle(text);
    if (valueFor === 'desc') setDesc(text);
  };

  const handleSubmit = () => {
    if ((!title.trim() && !desc.trim() && !attachment) || (!title.trim() && !desc.trim() && attachment)) {
      return setWarnValue('At least give a title to save');
    }

    if (isEdit) {
      onSubmit(title, desc, attachment, Date.now());
    } else {
      onSubmit(title, desc, attachment);
      setTitle('');
      setDesc('');
      setAttachment(null);
    }
    onClose();
    setWarnValue('');
  };

  const closeModal = () => {
    if (!isEdit) {
      setTitle('');
      setDesc('');
      setAttachment(null);
    }
    setWarnValue('');
    onClose();
  };

  const handleDeleteBtn = () => {
    Alert.alert(
      'Are You Sure!',
      'You want to remove this image?',
      [
        {
          text: 'Yes',
          onPress: ()=> setAttachment(null),
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

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setAttachment({ uri: selectedImage.uri, type: selectedImage.type });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundColor} />
      <Modal visible={visible} animationType="fade" transparent={false}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <View style={styles.modelHead}>
            <TouchableHighlight style={styles.iconBackModal} onPress={closeModal} underlayColor={colors.WARNBACK}>
              <Ionicons name="arrow-back-outline" size={24} color={theme.color} />
            </TouchableHighlight>

            <TouchableOpacity style={styles.addDocumentBtn} onPress={handlePickImage}>
              <FontAwesome5 name="image" size={24} color={theme.color} />
              <Text style={[styles.addDocumentText, { color: theme.color }]}>Add Image</Text>
            </TouchableOpacity>
          </View>

          {warnValue && (title.trim() || desc.trim() ? null : (
            <View style={styles.warnHead}>
              <Text style={{ textAlign: 'center' }}>{warnValue}</Text>
            </View>
          ))}

          <TextInput
            value={title}
            onChangeText={(text) => handleOnChangeText(text, 'title')}
            placeholder="Title"
            placeholderTextColor={colors.WARNBACK}
            style={[styles.input, styles.title,{color:theme.color}]}
          />
        </SafeAreaView>
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <TextInput
            value={desc}
            multiline
            placeholder="Note"
            placeholderTextColor={colors.WARNBACK}
            style={[styles.input, styles.desc,{color:theme.color}]}
            onChangeText={(text) => handleOnChangeText(text, 'desc')}
          />
          

          {attachment && attachment.type === 'image' && (
            <TouchableOpacity>
              <View style={[styles.attachmentPreview, styles.input]}>
                <Image source={{ uri: attachment.uri }} style={styles.imagePreview} resizeMode="cover" />
              </View>
            </TouchableOpacity>
          )}
          
        </ScrollView>

          <View style={[styles.btnContainer,{backgroundColor:theme.backgroundColor}]}>
            <SettingBtn size={15} ionIconName="checkmark-sharp" onPress={handleSubmit} />
            {title.trim() || desc.trim() ? (
              <SettingBtn size={15} style={{ marginLeft: 15 }} ionIconName="close" onPress={closeModal} />
            ) : null}
            { attachment && 
            <>
            <RoundIconBtn size={24} style={{marginLeft: 15}} antIconName="delete" onPress={handleDeleteBtn} text="Image"/>
            </>
            }
          </View>
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={[styles.modalBG, StyleSheet.absoluteFillObject, { backgroundColor: theme.backgroundColor }]} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modelHead: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addDocumentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
  },
  addDocumentText: {
    marginLeft: 5,
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
    fontSize: 20,
    color: colors.DARK,
    borderRadius: 12,
  },
  title: {
    height: 50,
    marginBottom: 15,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  desc: {
    minHeight: 100,
    paddingHorizontal: 10,
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  attachmentPreview: {
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
  },
  imagePreview: {
    width: 300,
    height: 200,
    marginTop: 5,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  warnHead: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.WARNBACK,
    marginBottom: 20,
  },
  iconBackModal: {
    padding: 10,
    borderRadius: 50,
  },
});

export default NoteInputModal;
