import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

const WebViews = ({ route }) => {

    let data = route.params

    const width = Dimensions.get('window').width / 2

    const source = {
        html: data
    };


    // return <WebView source={{ html: data }} style={{ flex: 1 , backgroundColor : 'white'}} />
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
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