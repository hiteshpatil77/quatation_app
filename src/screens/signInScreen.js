import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Octicons";
import { WP } from "../utils/Dimention";
import { apiCalls } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../utils/Colors";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await apiCalls.login(email, password);

      console.log("Login Response:", response);

      if (response?.token) {
        await AsyncStorage.setItem("accessToken", response.token);
        await AsyncStorage.setItem("UserName", response.user.name);
      }

      // Alert.alert("Success", "Logged in successfully");
      navigation.navigate("MainStack", { name: response });
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../assets/backGround.png")}
      >
        {/* Title */}
        <View
          style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../assets/solarLogo.png")}
            style={{ resizeMode: "center" }}
          />
        </View>
        <View
          style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 30, fontWeight: "bold", color: Colors.primary }}
          >
            Sign In
          </Text>
        </View>

        {/* Email / Phone */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Email or Phone"
            style={{ flex: 1, color: "#333" }}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={"#333"}
          />
        </View>

        {/* Password */}
        <View style={styles.inputBoxRow}>
          <TextInput
            style={{ width: WP(75), color: "#333" }}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword} // 👈 toggle here
            placeholderTextColor={"#333"}
          />
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? "eye" : "eye-closed"}
              size={25}
              color="#333"
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding: 10,
              borderRadius: 10,
              width: "90%",
              alignItems: "center",
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    margin: 20,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#F5F9FE",
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  inputBoxRow: {
    margin: 20,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#F5F9FE",
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
});
