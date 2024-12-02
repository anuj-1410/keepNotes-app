import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import themeContext from '../misc/themeContext';

const NotFound = () => {
  const theme = useContext(themeContext);

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <AntDesign name='frowno' size={90} color={theme.color} />
      <Text style={{ marginTop: 20, fontSize: 20, color:theme.color }}>Result Not Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    zIndex: -1,
  },
});

export default NotFound;
