import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function CsButton({color="#000", textColor="#fff", name="", onClick, width="auto"}) {
    return(
        <TouchableOpacity onPress={()=>{onClick && onClick()}}>
        <View style={{ backgroundColor: color, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, alignItems:'center', width }}>
            <Text style={{ color: textColor, fontWeight:"700" }}>{name}</Text>
        </View>
        </TouchableOpacity>
    )
}