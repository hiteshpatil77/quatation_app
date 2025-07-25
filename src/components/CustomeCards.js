import { Image, Text, View } from "react-native";
import Images from "../assets/Images";

export default function CustomeCard(props) {
    const { title, bgColor = "gray" } = props;
    return (
        <View style={{ borderWidth: 1, backgroundColor: bgColor, borderRadius: 10, height: 150, width: 150, justifyContent: "center", alignItems: "center" }}>
            {/* <Image source={Images.tabHomeIcon} style={{}}></Image> */}
            <Text>{title}</Text>
        </View>
    )
}