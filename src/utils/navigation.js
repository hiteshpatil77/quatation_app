import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SlpashScreen from "../screens/splashScreen";
import AuthenticationOptionScreen from "../screens/authOptions";
import SignInScreen from "../screens/signInScreen";
import SignUpScreen from "../screens/signUpScreen";
import HomeScreen from "../screens/HomeScreen";
import { Image, View } from "react-native";
import CustomerScreen from "../screens/CustomerScreen";
import BillForm from "../screens/BillForm";
import Pddf from "../screens/QuotationForm";
import FileList from "../screens/RequestScreen";
import ViewQuotation from "../screens/ViewQuotation";
import Icon from "react-native-vector-icons/AntDesign";
import { FS, HP } from "./Dimention";
import Colors from "./Colors";
import CreatLead from "../screens/CreatLead";
import ViewLead from "../screens/ViewLead";
import Support from "../screens/Support";
import ComplaintScreen from "../screens/CompnaintScreen";
const stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function InitialRoutes() {
  return (
    <>
      <stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <stack.Screen
          name="Splash"
          component={SlpashScreen}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="AuthOptions"
          component={AuthenticationOptionScreen}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="MainStack"
          component={BottomNavigations}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="ViewQuotation"
          component={ViewQuotation}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="CreatLead"
          component={CreatLead}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="ViewLead"
          component={ViewLead}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Quotation"
          component={Pddf}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Support"
          component={Support}
          options={{ headerShown: false }}
        />
      </stack.Navigator>
    </>
  );
}

export const BottomNavigations = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "ViewQuotation") {
            iconName = "filetext1";
          } else if (route.name === "Lead") {
            iconName = "user";
          } else if (route.name === "Complaint") {
            iconName = "exclamationcircle";
          }

          return (
            <View
              style={{
                backgroundColor: focused ? Colors.primary : "#f2f2f2",
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Icon
                name={iconName}
                size={20}
                color={focused ? "#fff" : "gray"}
              />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: HP(8),
          borderRadius: HP(2),
          position: "absolute",
          margin: HP(1),
          elevation: 5,
          opacity: 100,
        },
        tabBarItemStyle: {
          marginVertical: 5,
          borderRadius: 15,
        },
        tabBarLabelStyle: {
          fontSize: FS(1.2),
          marginTop: 2,
          borderRadius: HP(1),
          paddingHorizontal: 6,
          paddingVertical: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ViewQuotation" component={ViewQuotation} />
      <Tab.Screen name="Lead" component={ViewLead} />
      <Tab.Screen name="Complaint" component={ComplaintScreen} />
    </Tab.Navigator>
  );
};
