import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  BackHandler,
  DeviceEventEmitter,
} from 'react-native';
import Colors from '../theme/Colors';
import Loader from '../utils/loader';
import Http from '../http/Http';
import Constants from '../http/Constants';
import Utils from '../utils/Utils';
import Session from '../utils/Session';
const BuildConfig = require('react-native-build-config');
import VersionInfo from 'react-native-version-info';
import SwitchNavigator from '../navigation/SwitchNavigator';
import Route from '../navigation/Route';
import Package from './Package';
import AsyncMemory from '../utils/AsyncMemory';
import Firebase from '../firebase/Firebase';
// import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-player'
import Video from 'react-native-video';
import logoVedio from '../assets/logo.mp4';
import GifImage from '@lowkey/react-native-gif'

import {
  initConnection,
  getAvailablePurchases,
  endConnection
} from "react-native-iap";
//Fb APP ID
//App ID:540937094082492
export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      productList: null,
    };
  }
  
  componentDidMount() {
    this.getCompanySettings();
    this.getPackages();
    this.performTimeConsumingTask();
    this.getProductList();
    // Firebase()
    // LocationServicesDialogBox.stopListener();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if 'count' state has changed
    if (this.state.productList !== prevState.productList) {
      this.refreshSubscription();
    }
  }

  getProductList = async () => {
    console.log('**************** getProductList ****************');
    initConnection();
    this.setState({ loading: true });
    try {
      console.log("insdie try");
      console.log("Before Get Subscriptions");
      const list = await getAvailablePurchases();
      this.setState({ productList: list });
      console.log("After Get Subscriptions");
      console.log("list of purchases-->" + JSON.stringify(list));
      
      this.setState({ loading: false });
    } catch (error) {
      alert(error);
      console.log("error product list", error);
      this.setState({ loading: false });
    }
    endConnection();
  };

  refreshSubscription = async () => {
    console.log('********************* Refresh Subscription **************************');
    console.log(this.state.productList)
    if (!this.state.productList || this.state.productList.length > 0) return;
    if (!Session.userObj.packageId) return;
    Session.userPackage.userId = Session.userObj.userId;
    this.setState({ loading: true });
    Session.userPackage.transactionId = 'None';
    Session.userPackage.packageId = 'None';
    await Http.post(
      Constants.END_POINT_UPDATE_USER_PACKAGE,
      Session.userPackage,
    ).then(
      response => {
        this.setState({ loading: false });
        console.log(response.data);
        if (response.data.success) {
          if (Session.userObj != null) {
            Session.userObj = response.data.data[0];
            AsyncMemory.storeItem('userObj', Session.userObj);
          } else {
            console.log('user object is null');
          }
        } else {
        }
      },
      error => {
        this.setState({ loading: false });
        console.log(error);
        alert(error)
      },
    );
  }

  getCompanySettings = redirectTo => {
    Http.get(Constants.END_POINT_GET_COMPANY_SETTINGS).then(
      response => {
        // this.this.setState({ loading: false })

        if (response.data.success) {
          Session.companySettings = response.data.data.companySetting[0];
          Session.appSettings = response.data.data.appSetting[0];

          if (Session.appSettings.enableApp == 'Y') {
            Session.showSignupButton =
              response.data.data.companySetting[0].showSignup;
            if (VersionInfo.appVersion == Session.appSettings.versionName) {
              if (Session.appSettings.showMsgAlert == 'Y') {
                Utils.Alert('Info', Session.appSettings.message);
              }
              if (redirectTo == 'Welcome') {
                this.props.navigation.replace('Welcome');
              } else {
              }
            } else {
              // Utils.AlertAndOpenLink("Info", Session.appSettings.versionDesc, "market://details?id=" + VersionInfo.bundleIdentifier)
            }
          } else {
            // Utils.AlertAndShutDown("Info", Session.appSettings.message)
          }
        } else {
          // Utils.Alert("Info", "Oops! Something went wrong. Please try again later.")
        }
      },
      error => {
        console.warn(error);
        // Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
      },
    );
  };

  getPackages = async () => {
    // this.setState({ loading: true })
    await Http.get(Constants.END_POINT_GETPACKAGES).then(
      response => {
        if (response.data.success) {
          Session.companyPackages = response.data.data;
        } else {
          // Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
        }
      },
      error => {
        console.log(error);
        // Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
      },
    );
    // console.log("company packages all=== >" + JSON.stringify(Session.companyPackages));
  };

  onConversation = async () => {
    console.log(
      ' ========================= On Conversation API ============================',
    );

    Session.conversation.senderId = Session.userObj.userId;
    Session.conversation.senderName = Session.userObj.userName;
    Session.conversation.receiverId = Session.docObj.userId;
    Session.conversation.receiverName = Session.docObj.userName;
    Session.conversation.conversationName = Session.userObj.userName;
    Session.conversation.senderImgUrl = Session.userObj.imgUrl;
    Session.conversation.receiverImgUrl = Session.docObj.imgUrl;

    if (
      Session.conversationId == null ||
      Session.conversationId == undefined ||
      Session.conversationId == ''
    ) {
      console.log('inside main ifff');
      await Http.postConversation(
        Constants.CONVERSATION_URL,
        Session.conversation,
      ).then(
        response => {
          // this.setState({ loading: false })
          console.log(' before inside  if');
          console.log('response == >' + JSON.stringify(response.data));
          if (response.status >= 200) {
            if (response.data[0]?._id) {
              console.log('inside if if');
              Session.conversationId = response.data[0]?._id;
              AsyncMemory.storeItem('conversationId', Session.conversationId);
              this.props.navigation.replace('BottomTab');
            } else if (response.data?._id) {
              console.log('inside else if');

              AsyncMemory.storeItem('conversationId', Session.conversationId);
              Session.conversationId = response.data?._id;
            }
          } else {
          }
        },
        error => {
          console.log('api error' + error);
        },
      );
    } else {
      console.log('inside else');
      this.props.navigation.replace('BottomTab');
      console.log('Session Conversation ID is already stored');
    }
  };

  performTimeConsumingTask = async () => {
    console.log(
      'Before Async==========================================================',
    );
    AsyncMemory.retrieveItem('userObj')
      .then(userObj => {
        if (userObj != null || userObj != undefined) {
          AsyncMemory.retrieveItem('conversationId').then(
            conversationId => (Session.conversationId = conversationId),
          );
          AsyncMemory.retrieveItem('docObj').then(
            docObj => (Session.docObj = docObj),
          );
          // console.log("async user object ==== >" + JSON.stringify(userObj));
          Session.userObj = userObj;

          if (Session.userObj.userPackageId != '') {
            setTimeout(() => {
              this.onConversation();
            this.props.navigation.replace('BottomTab');
            }, 3000);
          }
          else {
            this.props.navigation.replace('BottomTab');
          }
        } else {
          setTimeout(() => {
            this.props.navigation.replace('LoginV2');
          }, 3000);
        }
      })
      .catch(error => {
        console.log('error occurs: ' + error);
        navigation.replace('LoginV2');
      });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'white',
          alignItems: 'center',
        }}>
        {/* <Loader loading={this.state.loading}></Loader> */}
        <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
        {/* <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.COLOR_BLACK }}>Organize Me</Text> */}
        {/* <GifImage
          source={require('../assets/logoNew.gif')}
          style={{
            height: 350,
            width: 350,
          }}
          resizeMode="contain"
        /> */}
        {/* <VideoPlayer
                    video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                    videoWidth={1600}
                    videoHeight={900}
                    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                    onVideoEnd={() =>  console.log("vedio end")}
                /> */}

        <Video source={require('../assets/logo.mp4')}
          style={{ height: 200, width: 200, backgroundColor: 'white' }}
          ref={(ref) => {
            this.player = ref
          }} resizeMode="contain" />
        {/* <Image source={require('../assets/splash.gif')} style={{
                        height: 400,
                        width: 350
                    }}
                    resizeMode="contain" /> */}
      </View>
    );
  }
}
