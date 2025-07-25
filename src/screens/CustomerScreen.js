import { Image, Text, View } from "react-native";
import Images from "../assets/Images";

export default function CustomerScreen() {
    return (
        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 20 }}>
            <View style={{ borderWidth: 2, width: "100%", height: 30, marginBottom: 20, borderRadius: 15, paddingStart: 10 }}>
                <Text>Customer 1</Text>

            </View>
            <View style={{ borderWidth: 2, width: "100%", height: 30, marginBottom: 20, borderRadius: 15, paddingStart: 10 }}>
                <Text>Customer 2</Text>

            </View>
            <View style={{ borderWidth: 2, width: "100%", height: 30, marginBottom: 20, borderRadius: 15, paddingStart: 10 }}>
                <Text>Customer 3</Text>

            </View>
            <View style={{ borderWidth: 2, width: "100%", height: 30, marginBottom: 20, borderRadius: 15, paddingStart: 10 }}>
                <Text>Customer 4</Text>

            </View>
            <View style={{ borderWidth: 2, width: "100%", height: 30, marginBottom: 20, borderRadius: 15, paddingStart: 10 }}>
                <Text>Customer 5</Text>

            </View>
            <View style={{ borderWidth: 2, width: "100%", height: 30, marginBottom: 20, borderRadius: 15, paddingStart: 10 }}>
                <Text>Customer 6</Text>

            </View>
        </View>
    )
}