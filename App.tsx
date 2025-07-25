/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import SlpashScreen from './src/screens/splashScreen';
import {NavigationContainer} from '@react-navigation/native';
import {InitialRoutes} from './src/utils/navigation';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  return (
    <NavigationContainer>
      <InitialRoutes />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
