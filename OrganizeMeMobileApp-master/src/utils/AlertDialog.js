import React, { Component } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native'
import Colors from '../AppTheme/Colors'
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator,
    Image,
    Text
} from 'react-native';



const AlertDialog = props => {
    const {
        showDialog,
        btnOkListener,
        title,
        message,
        ...attributes
    } = props;

    
    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={showDialog}
            onRequestClose={() => { console.log('close modal') }}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <View>
                        <Text style={{ fontSize: 16, color: 'green', marginTop: 10, justifyContent: 'space-around' }}>{title}</Text>
                    </View>
                    <Text style={{ fontSize: 16, color: 'green', marginTop: 50, textAlign: 'center' }}>{message}</Text>
                    <TouchableOpacity onPress={btnOkListener} style={{
                        borderRadius: 20, justifyContent: 'center', marginTop: 30, width: 50, height: 30, backgroundColor: Colors.colorPrimary
                    }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Ok</Text>

                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        height: 200,
        width: width - 60,
        borderRadius: 10,
        display: 'flex',

        alignItems: 'center',
        flexDirection: 'column',
    }
});

export default AlertDialog;