import {
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from "react-native";
import CsButton from "../components/CustomeButton";
import { FS, HP, WP } from "../utils/Dimention";
import { FloatingAction } from "react-native-floating-action";
import Colors from "../utils/Colors";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation }) {
  const [User, setUser] = useState("");
  const actions = [
    {
      text: "Add Lead",
      icon: <Feather name="edit" size={20} color="#fff" />, // Use your icon here
      name: "Add_Lead",
      position: 1,
    },
    {
      text: "View Lead",
      icon: <Feather name="file-minus" size={20} color="#fff" />,
      name: "View_Lead",
      position: 2,
    },
  ];
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const NumberData = [
    {
      number: 23,
      title: "Pending Order",
      color: "#FFA726",
      icon: "clock-outline",
    },
    {
      number: 46,
      title: "On Going Project",
      color: "#42A5F5",
      icon: "progress-clock",
    },
    {
      number: 46,
      title: "Close Order",
      color: "#66BB6A",
      icon: "check-circle",
    },
    { number: 10, title: "Lose Order", color: "#EF5350", icon: "close-circle" },
  ];

  const handleActionPress = (name) => {
    if (name === "Add_Lead") {
      navigation.navigate("CreatLead");
    } else if (name === "View_Lead") {
      navigation.navigate("ViewLead");
    }
  };
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("SignIn");
  };

  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    const User = await AsyncStorage.getItem("UserName");
    setUser(User || "");
  };
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../assets/backGround.png")}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 30,
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setLogoutModalVisible(true)}
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                elevation: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>{User}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Support")}
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                elevation: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="support-agent" color={"#fff"} size={25} />
            </TouchableOpacity>
          </View>

          {/* <Image
            source={require("../assets/HomeQuotation1.png")}
            style={{
              resizeMode: "contain",
              width: WP(70),
              height: HP(40),
              alignSelf: "center",
            }}
          /> */}
          <Image
            source={require("../assets/HomeQuotation2.png")}
            style={{
              resizeMode: "contain",
              width: 300,
              height: 300,
              alignSelf: "center",
            }}
          />
        </View>
        <View style={{}}>
          <FlatList
            data={NumberData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 15,
            }}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: HP(2),
                  padding: HP(2),
                  marginHorizontal: 5,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  borderLeftWidth: 5,
                  borderLeftColor: item.color,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Icon name={item.icon} size={35} color={item.color} />
                  <Text
                    style={{
                      fontSize: FS(3.3),
                      fontWeight: "bold",
                      marginVertical: 5,
                    }}
                  >
                    {item.number}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: FS(2),
                    color: "#555",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {item.title}
                </Text>
              </View>
            )}
          />
        </View>
        {/* <View style={{ alignItems: "center", paddingTop: 40, rowGap: 20 }}>
          <View>
            <CsButton
              name={"Create Quotation"}
              color={Colors.primary}
              onClick={() => navigation.navigate("Quotation")}
              width={WP(90)}
              height={HP(6)}
            />
          </View>
          <View>
            <CsButton
              name={"View Quotation"}
              color={Colors.primary}
              width={WP(90)}
              height={HP(6)}
              onClick={() => navigation.navigate("ViewQuotation")}
            />
          </View>
        </View> */}
        {/* <FloatingAction
          overlayColor="rgba(0, 0, 0, 0.2)"
          color={Colors.primary}
          actions={actions}
          buttonSize={60}
          tintColor={"red"}
          onPressItem={handleActionPress}
        /> */}
        {/* Logout Confirmation Modal */}
        <Modal
          transparent
          visible={logoutModalVisible}
          animationType="fade"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 24,
                width: 280,
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 16,
                  color: "#333",
                }}
              >
                Are you sure you want to logout?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.primary,
                    paddingVertical: 10,
                    borderRadius: 8,
                    marginRight: 8,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setLogoutModalVisible(false);
                    handleLogout();
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Logout
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#eee",
                    paddingVertical: 10,
                    borderRadius: 8,
                    marginLeft: 8,
                    alignItems: "center",
                  }}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={{ color: "#333", fontWeight: "bold" }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}
