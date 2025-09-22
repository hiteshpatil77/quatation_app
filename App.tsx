import React from "react";
import type { PropsWithChildren } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { InitialRoutes } from "./src/utils/navigation";
import store from "./src/screens/redux/Store";
import { Provider } from "react-redux";

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  return (
    <Provider store={store}>
      <NavigationContainer>
        <InitialRoutes/>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});

export default App;
