import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions ,TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome5'

const WebViews = ({ route , navigation }) => {

    let data = route.params

    const width = Dimensions.get('window').width / 2

    const source = {
        html: data
    };


    // return <WebView source={{ html: data }} style={{ flex: 1 , backgroundColor : 'white'}} />
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', marginTop: 25, marginLeft: 10 }}>
                <Icon name='arrow-left' size={20} />
            </TouchableOpacity>
            <ScrollView style={{ maxWidth: "90%", alignSelf: 'center', backgroundColor: "white" }}>
                <RenderHtml
                    contentWidth={width}
                    style={{ alignSelf: "center" }}
                    source={source}
                />
            </ScrollView>
        </View>
    )

}


export default WebViews 