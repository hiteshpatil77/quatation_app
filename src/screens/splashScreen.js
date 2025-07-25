import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SlpashScreen({ navigation }) {
    useEffect(() => {
        setTimeout(() => {
            navigation.replace("MainStack")
        }, 2000)
    }, [])


    const image = require("../assets/BrandLogo.png")
    return (
        <View style={{ flex: 1 }}>
            <Image source={image} resizeMode="center" style={{ flex: 1, width: '100%', }} />
        </View>
    )
} 