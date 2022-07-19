import React, { Component } from 'react'
import GetLocation from 'react-native-get-location'
import Session from './Session';

export default class Location extends Component {
    constructor(props) {
        super(props);
    }

    static getLocation = async () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
        })
            .then(location => {
                console.log("Location is ====>" + JSON.stringify(location));
                Session.currentLocation = location;
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }
}