import { Alert, Text, TouchableOpacity, View } from "react-native";
import { FS, HP } from "../utils/Dimention";

export default function CsButton({
  color = "#000",
  textColor = "#fff",
  name = "",
  onClick,
  width = "auto",
  height = "auto",
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick && onClick();
      }}
    >
      <View
        style={{
          backgroundColor: color,
          paddingHorizontal: HP(5),
          paddingVertical: HP(1.5),
          borderRadius: HP(2),
          alignItems: "center",
          width,
          height,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: textColor, fontWeight: "700", fontSize: FS(2) }}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
