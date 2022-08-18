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
// import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-player'
import Video from 'react-native-video'
import logoVedio from '../assets/logo.mp4'




//Fb APP ID 
//App ID:540937094082492

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
        // Firebase()
        // LocationServicesDialogBox.stopListener();
    }


    getCompanySettings = (redirectTo) => {
        Http.get(Constants.END_POINT_GET_COMPANY_SETTINGS).then((response) => {
            this.setState({ loading: false })

            if (response.data.success) {

                Session.companySettings = response.data.data.companySetting[0]
                Session.appSettings = response.data.data.appSetting[0]


                if (Session.appSettings.enableApp == "Y") {
                    Session.showSignupButton = response.data.data.companySetting[0].showSignup;
                    if (VersionInfo.appVersion == Session.appSettings.versionName) {



                        if (Session.appSettings.showMsgAlert == "Y") {
                            Utils.Alert("Info", Session.appSettings.message)
                        }
                        if (redirectTo == "Welcome") {
                            this.props.navigation.replace('Welcome')
                        } else {

                        }
                    }
                    else {
                        Utils.AlertAndOpenLink("Info", Session.appSettings.versionDesc, "market://details?id=" + VersionInfo.bundleIdentifier)
                    }

                } else {
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
        await Http.get(Constants.END_POINT_GETPACKAGES).then((response) => {
            if (response.data.success) {
                Session.companyPackages = response.data.data


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

    onConversation = async () => {

        console.log(" ========================= On Conversation API ============================");

        Session.conversation.senderId = Session.userObj.userId
        Session.conversation.senderName = Session.userObj.userName
        Session.conversation.receiverId = Session.docObj.userId
        Session.conversation.receiverName = Session.docObj.userName
        Session.conversation.conversationName = Session.userObj.userName
        Session.conversation.senderImgUrl = Session.userObj.imgUrl
        Session.conversation.receiverImgUrl = Session.docObj.imgUrl




        if (Session.conversationId == null || Session.conversationId == undefined || Session.conversationId == "") {
            await Http.postConversation(Constants.CONVERSATION_URL, Session.conversation).then((response) => {
                // setLoading(false)

                if (response.status >= 200) {
                    if (response.data[0]?._id) {
                        Session.conversationId = response.data[0]?._id;
                        AsyncMemory.storeItem("conversationId", Session.conversationId)
                        this.props.navigation.replace('BottomTab')

                    } else if (response.data?._id) {
                        AsyncMemory.storeItem("conversationId", Session.conversationId)
                        Session.conversationId = response.data?._id;
                    }
                }
                else {
                }


            }, (error) => {
                console.log(error);
            })
        }
        else {
            this.props.navigation.replace('BottomTab')
            console.log("Session Conversation ID is already stored");
        }

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
                AsyncMemory.retrieveItem('conversationId').then((conversationId) => Session.conversationId = conversationId)
                AsyncMemory.retrieveItem('docObj').then((docObj) => Session.docObj = docObj)
                // console.log("async user object ==== >" + JSON.stringify(userObj));
                Session.userObj = userObj;

                if (Session.userObj.userPackageId != "") {
                    setTimeout(() => {
                        this.onConversation()
                    },
                        3000
                    );
                }
                else {
                    this.props.navigation.replace('Package')

                }


            }
            else {

                setTimeout(() => {
                    this.props.navigation.replace('LoginV2')

                },
                    3000
                );

            }


        }).catch((error) => {

            console.log('error occurs: ' + error);
            navigation.replace('LoginV2')
        });
    }

    render() {

        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', alignItems: 'center' }}>
                {/* <Loader loading={this.state.loading}></Loader> */}
                <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
                {/* <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.COLOR_BLACK }}>Organize Me</Text> */}
                {/* <GifImage
                    source={require('../assets/splash.gif')}
                    style={{
                        height: 400,
                        width: 350
                    }}
                    resizeMode="contain" /> */}
                {/* <VideoPlayer
                    video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                    videoWidth={1600}
                    videoHeight={900}
                    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                    onVideoEnd={() =>  console.log("vedio end")}
                /> */}

                <Video source={logoVedio}
                    style={{ height: 200, width: 200, backgroundColor: 'white' }}
                    ref={(ref) => {
                        this.player = ref
                    }} />
                {/* <Image source={require('../assets/splash.gif')} style={{
                        height: 400,
                        width: 350
                    }}
                    resizeMode="contain" /> */}
            </View>
        )
    }
}
