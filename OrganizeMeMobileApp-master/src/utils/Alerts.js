import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../theme/Colors';

export default class Alerts extends React.Component {

    constructor(props) {
        super(props);

    };

    //  showAlert = () => {
    //     this.setState({
    //         showAlert: true
    //     });
    // };

    //  hideAlert = () => {
    //     this.setState({
    //         showAlert: false
    //     });
    // };

    render() {
        // const { showAlert } = this.state;

        return (
            <View style={styles.container}>


                <AwesomeAlert
                    contentContainerStyle={{ width: "80%" }}
                    confirmButtonStyle={{ width: 100, justifyContent: 'center', alignItems: 'center' }}
                    show={this.props.showAlert}
                    showProgress={false}
                    title={this.props.title ? this.props.title : "Info"}
                    message={this.props.msg}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    showCancelButton={this.props.showCancelButton}
                    confirmText={this.props.buttonTxt}
                    cancelText={this.props.cancelTxt}
                    confirmButtonColor={Colors.COLOR_THEME}
                    onCancelPressed={this.props.onCancelPressed}
                    onConfirmPressed={this.props.onConfirmPressed}
                />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        width: "70%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    button: {
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 5,
        backgroundColor: "#AEDEF4",

    },
    text: {
        color: '#fff',
        fontSize: 15
    }
});