import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Constants from '../http/Constants'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import Loader from '../utils/loader'
import Http from '../http/Http'
import Session from '../utils/Session'
import { WebView } from 'react-native-webview'


const WebViewCheckList = ({ navigation, route }) => {
    let data = route.params;

    console.log(" Data ==== > " + JSON.stringify(data.item.checkListUrl));
    useEffect(() => {

    });
    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: data.item.checkListUrl }} />
        </View>
    )
}

export default WebViewCheckList