import React, { Component } from 'react'
import { View, Text, Image, StatusBar, BackHandler, DeviceEventEmitter } from 'react-native'
import Colors from '../theme/Colors';
import Loader from '../utils/loader';
import Http from '../http/Http';
import Constants from '../http/Constants';
import Utils from '../utils/Utils'
import Session from '../utils/Session';
const BuildConfig = require('react-native-build-config')
import VersionInfo from 'react-native-version-info';
import SwitchNavigator from '../navigation/SwitchNavigator';
import Route from '../navigation/Route';
import Package from './Package';
import GifImage from '@lowkey/react-native-gif';
import AsyncMemory from '../utils/AsyncMemory';
import Firebase from '../firebase/Firebase';

export default class Splash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }


    componentDidMount() {

        this.getCompanySettings()
        this.getPackages()
        this.performTimeConsumingTask()
        Firebase()
        // LocationServicesDialogBox.stopListener();
    }


    getCompanySettings = (redirectTo) => {
        console.log("Get Company Settings");
        Http.get(Constants.END_POINT_GET_COMPANY_SETTINGS).then((response) => {
            this.setState({ loading: false })
            // console.log(response.data);

            if (response.data.success) {

                console.log("trueeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                console.log("=============================Success==================================");
                Session.companySettings = response.data.data.companySetting[0]
                // console.log(Session.companySettings);
                Session.appSettings = response.data.data.appSetting[0]
                // console.log(Session.appSettings);


                if (Session.appSettings.enableApp == "Y") {
                    // console.log(" company Settings Signup ==== >  " + JSON.stringify(response.data.data.companySetting[0].showSignup));
                    Session.showSignupButton = response.data.data.companySetting[0].showSignup;
                    // console.log("Show Signup Button ===== >" + Session.showSignupButton);
                    if (VersionInfo.appVersion == Session.appSettings.versionName) {



                        if (Session.appSettings.showMsgAlert == "Y") {
                            Utils.Alert("Info", Session.appSettings.message)
                        }
                        if (redirectTo == "Welcome") {
                            this.props.navigation.replace('Welcome')
                        } else {

                            // SwitchNavigator.navigate(this.props, Route.Route_FROM_WELCOME);
                        }
                    }
                    else {
                        Utils.AlertAndOpenLink("Info", Session.appSettings.versionDesc, "market://details?id=" + VersionInfo.bundleIdentifier)
                    }

                } else {
                    //app is not enable show dialog and close the application
                    Utils.AlertAndShutDown("Info", Session.appSettings.message)
                }
            } else {
                Utils.Alert("Info", "Oops! Something went wrong. Please try again later.")
            }


        }, (error) => {
            Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
        })



    }

    getPackages = async () => {
        // setLoading(true)
        console.log("Get Company Packages");
        await Http.get(Constants.END_POINT_GETPACKAGES).then((response) => {
            // setLoading(false)
            // console.log("Get Packages === > " + response.data);
            if (response.data.success) {
                Session.companyPackages = response.data.data


                // console.log("company packages === >" + JSON.stringify(Session.companyPackages));
            }
            else {

                Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
            }


        }, (error) => {
            console.log(error);
            Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
        })
        // console.log("company packages all=== >" + JSON.stringify(Session.companyPackages));
    }



    performTimeConsumingTask = async () => {
        // console.log("Location Service check ========================")
        // LocationServicesDialogBox.checkLocationServicesIsEnabled({

        //     message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        //     ok: "YES",
        //     cancel: "NO",
        //     enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        //     showDialog: true, // false => Opens the Location access page directly
        //     openLocationServices: true, // false => Directly catch method is called if location services are turned off
        //     preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
        //     preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
        //     providerListener: false // true ==> Trigger locationProviderStatusChange listener when the location state changes
        // }).then(function (success) {
        //     console.log("Success ==== >" + JSON.stringify(success)); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        // }).catch((error) => {
        //     console.log("Error ==== > " + error.message); // error.message => "disabled"
        // });

        // BackHandler.addEventListener('hardwareBackPress', () => { //(optional) you can use it if you need it
        //     //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
        //     LocationServicesDialogBox.forceCloseDialog();
        // });

        // DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
        //     console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        // });

        console.log("Before Async==========================================================");
        AsyncMemory.retrieveItem('userObj').then((userObj) => {
            if (userObj != null || userObj != undefined) {
                // console.log("async user object ==== >" + JSON.stringify(userObj));
                console.log("inside if");
                Session.userObj = userObj;
                // console.log("session User Object " + JSON.stringify(Session.userObj));

                setTimeout(() => {
                    this.props.navigation.replace('BottomTab')

                },
                    3000
                );

            }
            else {

                // console.log(userObj);
                console.log("inside else");
                // this.props.navigation.replace('Login')
                setTimeout(() => {
                    this.props.navigation.replace('Login')

                },
                    2000
                );

            }


        }).catch((error) => {

            console.log('error occurs: ' + error);
            navigation.replace('Login')
        });
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: "#ffffff", justifyContent: 'center', alignItems: 'center' }}>
                {/* <Loader loading={this.state.loading}></Loader> */}
                <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
                {/* <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.COLOR_BLACK }}>Organize Me</Text> */}
                <GifImage
                    source={require('../assets/splash.gif')}
                    style={{
                        height: 400,
                        width: 350
                    }}
                    resizeMode="contain" />
                {/* <Image source={require('../assets/splash.gif')} style={{
                        height: 400,
                        width: 350
                    }}
                    resizeMode="contain" /> */}
            </View>
        )
    }
}
