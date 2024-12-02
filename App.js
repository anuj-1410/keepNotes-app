import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Intro from './app/screens/Intro';
import NoteScreen from './app/screens/NoteScreen';
import NoteDetail from './app/components/NoteDetail';
import NoteProvider from './app/contexts/NoteProvider';
import { EventRegister } from 'react-native-event-listeners';
import theme from './app/misc/theme';
import themeContext from './app/misc/themeContext';
import { CardStyleInterpolators } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({});
  const [isAppFirstTimeOpen, setIsAppFirstTimeOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeApp = async () => {
    try {

      const userResult = await AsyncStorage.getItem('user');
      const themeResult = await AsyncStorage.getItem('theme');

      if (userResult === null) {
        setIsAppFirstTimeOpen(true);
      } else {
        setUser(JSON.parse(userResult));
        setIsAppFirstTimeOpen(false);
      }

      if (themeResult !== null) {
        setDarkMode(JSON.parse(themeResult));
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      initializeApp();
    }
  }, [loading]);

  
  useEffect(() => {
    const listener = EventRegister.addEventListener('ChangeTheme', (data) => {
      setDarkMode(data);
      saveThemePreference(data); 
    });

    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);

  const saveThemePreference = async (isDarkMode) => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (isAppFirstTimeOpen) {
    return <Intro onFinish={async() => {
      const user = await AsyncStorage.getItem('user');
      setUser(JSON.parse(user));
      setIsAppFirstTimeOpen(false);
    }} />;
  }


  return (
    <themeContext.Provider value={darkMode ? theme.dark : theme.light}>
      <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
        <NoteProvider>
          <Stack.Navigator
            screenOptions={{
              headerTitle: '',
              headerTransparent: true,
              cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 400 } },
                close: { animation: 'timing', config: { duration: 400 } },
              },
            }}
          >
            <Stack.Screen name="NoteScreen">
              {(props) => <NoteScreen {...props} user={user} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="NoteDetail" component={NoteDetail} />
          </Stack.Navigator>
        </NoteProvider>
      </NavigationContainer>
    </themeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
