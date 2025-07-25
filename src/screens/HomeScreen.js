import {Image,View } from "react-native";
import CsButton from "../components/CustomeButton";

export default function HomeScreen({navigation}) {
    return (
        <View style={{ flex: 2, backgroundColor: "#fff" }}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingTop: 30 }}>
                    {/* <CsButton name={"skip"} textColor="#999" color="#fff" onClick={()=>navigation.replace('MainStack')}/> */}
                </View>

                <Image source={require("../assets/userLoginImage.jpg")} style={{ width: '100%', height: '100%' }} />
            </View>
            <View style={{flex: 1, alignItems:'center', paddingTop: 40, rowGap: 20 }}>
                    <View><CsButton name={"Create Quotation"} color="#d268cc" width={150} onClick={()=>navigation.navigate('Quotation')} /></View>
                    <View><CsButton name={"Create Bill"} color="#d268cc" width={150} onClick={()=>navigation.navigate('Bill')} /></View>

                </View>
        </View>
    )
}