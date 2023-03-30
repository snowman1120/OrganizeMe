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
            <View style={{ width: "100%", backgroundColor: 'white', elevation: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('CheckList')} style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', marginTop: 25, marginLeft: 10 }}>
                    <Icon name='arrow-left' size={20} />
                </TouchableOpacity>
            </View>
            <WebView source={{ uri: data.item.checkListUrl }} />
        </View>
    )
}

export default WebViewCheckList