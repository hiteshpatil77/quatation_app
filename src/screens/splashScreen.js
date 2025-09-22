import React, { useEffect } from "react";
import { Image, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Stored Token:", token);

        setTimeout(() => {
          if (token) {
            navigation.replace("MainStack"); // ✅ If token exists
          } else {
            navigation.replace("SignIn"); // ✅ If token doesn't exist
          }
        }, 2000);
      } catch (error) {
        console.error("Error checking token:", error);
        navigation.replace("SignIn");
      }
    };

    checkAuthToken();
  }, [navigation]);

  const image = require("../assets/BrandLogo.png");

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={image}
        resizeMode="center"
        style={{ flex: 1, width: "100%" }}
      />
    </View>
  );
}
