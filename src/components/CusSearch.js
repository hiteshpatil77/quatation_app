import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FS, HP, WP } from "../utils/Dimention";
import Icon from "react-native-vector-icons/Ionicons";
export default function CusSearch({ onp, onchange, TextVal }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.searchBox}>
        <Icon name="search" size={22} color={"gray"} />
        <TextInput
          placeholder="Search Order"
          style={{ flex: 1, marginLeft: 8, color: "#333" }}
          value={TextVal}
          onChangeText={onchange}
          placeholderTextColor={"gray"}
        />
      </View>
      <TouchableOpacity
        style={{
          padding: HP(1.5),
          backgroundColor: "#fff",
          borderRadius: HP(1.5),
          elevation: 5,
        }}
        onPress={onp}
      >
        <Icon name="menu" size={25} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  searchBox: {
    elevation: 5,
    margin: HP(1),
    backgroundColor: "#fff",
    borderRadius: HP(1),
    width: WP(75),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    right: WP(2),
  },
});
