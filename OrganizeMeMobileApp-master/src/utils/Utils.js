import React, { Component } from "react";
import { View, Text, Alert, Linking } from "react-native";
import RNExitApp from 'react-native-exit-app';


export default class Utils extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static Alert = (title, message) =>
    Alert.alert(
      title,
      message,
      [
        // {
        //   text: "Cancel",
        //   onPress: () => console.log("Cancel Pressed"),
        //   style: "cancel"
        // },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: true }
    );


  static AlertNavigate = (title, message, redirect, navigation) =>
    Alert.alert(
      title,
      message,
      [
        // {
        //   text: "Cancel",
        //   onPress: () => console.log("Cancel Pressed"),
        //   style: "cancel"
        // },
        { text: "OK", onPress: () => navigation.replace(redirect) },
      ],
      { cancelable: true }
    );
  static AlertAndOpenLink = (title, message, link) =>
    Alert.alert(
      title,
      message,
      [
        // {
        //   text: "Cancel",
        //   onPress: () => console.log("Cancel Pressed"),
        //   style: "cancel"
        // },
        {
          text: "OK", onPress: () => Linking.openURL(link)
        },
      ],
      { cancelable: true }
    );
  static AlertAndShutDown = (title, message) =>
    Alert.alert(
      title,
      message,
      [
        // {
        //   text: "Cancel",
        //   onPress: () => console.log("Cancel Pressed"),
        //   style: "cancel"
        // },
        { text: "OK", onPress: () => RNExitApp.exitApp() },
      ],
      { cancelable: true }
    );
  // static currencyFormat = (value) => {
  //   return new Intl.NumberFormat("en-IN", {
  //     maximumSignificantDigits: 2,
  //   }).format(value);
  // };

  // static GetAsyncStorage = (value) => {
  //   AsyncStorage.getItem(value)
  //     .then((value) => {
  //       return value;
  //     })
  //     .then((res) => {
  //       //do something else
  //     });
  // };

}
