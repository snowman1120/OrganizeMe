import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Loader from '../utils/loader';
import Colors from '../theme/Colors';
import FontSize from '../theme/FontSize';
import TextStyle from '../theme/TextStyle';
import Swiper from 'react-native-swiper';
import Session from '../utils/Session';
import Http from '../http/Http';
import Constants from '../http/Constants';
import AsyncMemory from '../utils/AsyncMemory';
import {
  requestSubscription,
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
  getSubscriptions,
  initConnection,
  validateReceiptIos,
  getReceiptIOS,
  withIAPContext,
  completePurchase,
  getAvailablePurchases,
  getPurchaseHistory,
  endConnection
} from "react-native-iap";
import Alerts from '../utils/Alerts';
const IAPSKU = Platform.select({
  android: ["com.organizeme.iap.oneyear", "com.organizeme.iap.onemonth", "com.organizeme.iap.oneyearvip"],
  ios: ["com.letsgetorganized.iap.onemonth", "com.letsgetorganized.iap.oneyear","com.letsgetorganized.iap.oneyearvip"]
})

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

let initialRender = true;

const Package = ({ navigation }) => {
  const [productList, setProductList] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Info');
  const [alertShowCancelButton, setAlertShowCancelButton] = useState(false);
  const [cancelButtonTxt, setCancelButtonTxt] = useState('Cancel');
  const [buttonTxt, setButtonTxt] = useState('Ok');
  const [msg, setMsg] = useState('');
  const [selectSubscriptionId, setSelectSubscriptionId] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const packages = Session.companyPackages;

  useEffect(() => {
    onConversation();
    initConnection();
    getProductList();

    purchaseErrorSubscription = purchaseErrorListener(error => {
      if (!(error['responseCode'] === '2')) {
        console.log('************* purchaseErrorSubscription ****************', error);
      }
    });

    purchaseUpdateSubscription = purchaseUpdatedListener(async purchase => {
      console.log('************* Purchase update *************', purchase);
      console.log("purchased", JSON.stringify(purchase));
      console.log("productId", purchase.productId);
      let receipt = purchase.transactionReceipt;
      if (receipt) {
        console.log("inside reciept if");
        await finishTransaction(purchase, false);
        console.log("after finish transaction");
        console.log("before receipt");
        console.log("receipt->", receipt);
        Session.userPackage.userId = Session.userObj.userId;
        Session.userPackage.transactionId = purchase.transactionId;
        onBuyNowClick();
      }
    });

    return () => {
      try {
        purchaseErrorSubscription.remove();
      } catch(error) { }
      try {
        purchaseUpdateSubscription.remove();
      } catch(error) { }
      endConnection();
    }
  }, []);

  useEffect(() => {
    if (initialRender) {
      initialRender = false;
    } else {
      refreshSubscription();
    }
  }, [productList]);

  const refreshSubscription = async () => {
    console.log('********************* Refresh Subscription **************************');
    Session.userPackage.userId = Session.userObj.userId;
    if (!productList || productList.length > 0) return;
    if (!Session.userObj.packageId) return;
    setLoading(true);
    Session.userPackage.transactionId = 'None';
    Session.userPackage.packageId = 'None';
    await Http.post(
      Constants.END_POINT_UPDATE_USER_PACKAGE,
      Session.userPackage,
    ).then(
      response => {
        setLoading(false);
        console.log(response.data);
        if (response.data.success) {
          if (Session.userObj != null) {
            Session.userObj = response.data.data[0];
            AsyncMemory.storeItem('userObj', Session.userObj);
            navigation.replace('BottomTab');
            console.log(
              'session user object after refresh === >' +
              JSON.stringify(Session.userObj),
            );
          } else {
            console.log('user object is null');
          }
        } else {
        }
      },
      error => {
        setLoading(false);
        console.log(error);
        alert(error)
      },
    );
  }

  const confirmPress = () => {
    // onSubscribe(selectSubscriptionId);
    setOpenAlert(false);
  };

  const cancelPress = () => {
    setOpenAlert(false);
  }

  const cancelSubscription = (plan) => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL(`https://play.google.com/store/account/subscriptions?package=com.axsosntech.organizeme&sku=${plan.AndroidSubscriptionId}`);
    }
  }

  const handleSubscription = async (plan) => {
    const subscriptionId = Platform.select({
      android: plan.AndroidSubscriptionId,
      ios: plan.IosSubscriptionId,
    });
    // Check if any of the purchases match the subscription product ID
    const hasActiveSubscription = productList.some(
      (purchase) => purchase.productId === subscriptionId
    );

    if (hasActiveSubscription) {
      console.log('You have an active subscription.');
      // You can now handle the case where the user has an active subscription
      setMsg('You have an active subscription.');
      setOpenAlert(true);
    } else if (productList.length > 0) {
      const subscription = packages.find(p => Platform.OS === 'android' ? p.AndroidSubscriptionId === productList[0].productId : p.IosSubscriptionId === productList[0].productId);
      if (!subscription) {
          Alert.alert(
          'Error',
          'Updated subscription database records',
        );
        return;
      }
      // setAlertShowCancelButton(true);
      setAlertShowCancelButton(false);
      // setAlertTitle('Confirm');
      setAlertTitle('Info');
      // setMsg('You are already subscribed to ' + subscription.PackageName + '\n Continue?');
      setMsg('You are already subscribed to ' + subscription.PackageName);
      setSelectSubscriptionId(subscriptionId);
      setOpenAlert(true);
    } else {
      console.log('You does not have an active subscription.');
      onSubscribe(subscriptionId);
    }
  };

  const onSubscribe = async (subscriptionId = selectSubscriptionId) => {
    setLoading(true)
    console.log("session user pacakge obj before === >" + JSON.stringify(Session.userPackage));
    Session.cleanUserPackage()
    console.log("session user pacakge obj after === >" + JSON.stringify(Session.userPackage));
    console.log("inside android");
    try {
      console.log("inside try");
      console.warn(subscriptionId);
      console.log("request subscription");
      await requestSubscription(subscriptionId, false);
      Session.userPackage.packageId = subscriptionId
      console.log("session user pacakge obj after plan  === >" + JSON.stringify(Session.userPackage));
    } catch (err) {
      console.error("err-->", err);
      navigation.navigate('Package')
    }
    setLoading(false)
  }

  const onChangePlan = (index) => {
    setSelectSubscriptionId(
      Platform.select({
        android: packages[index].AndroidSubscriptionId,
        ios: packages[index].IosSubscriptionId,
      })
    );
  }

  const getProductList = async () => {
    console.log('**************** getProductList ****************');
    setLoading(true);
    try {
      console.log("insdie try");
      console.log("Before Get Subscriptions");
      const subscriptions = await getSubscriptions(IAPSKU);
      const list = await getAvailablePurchases();
      setProductList(list);
      console.log("After Get Subscriptions");
      console.log("list of purchases-->" + JSON.stringify(list));
      
      setLoading(false);
    } catch (error) {
      alert(error);
      console.log("error product list", error);
      setLoading(false);
    }
  };

  const onConversation = async () => {
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
      await Http.postConversation(
        Constants.CONVERSATION_URL,
        Session.conversation,
      ).then(
        response => {
          setLoading(false);

          if (response.status >= 200) {
            if (response.data[0]?._id) {
              Session.conversationId = response.data[0]?._id;
              AsyncMemory.storeItem('conversationId', Session.conversationId);
            } else if (response.data?._id) {
              AsyncMemory.storeItem('conversationId', Session.conversationId);
              Session.conversationId = response.data?._id;
            }
          } else {
          }
        },
        error => {
          console.log(error);
        },
      );
    } else {
      console.log('Session Conversation ID is already stored');
    }
  };

  const onBuyNowClick = async () => {
    console.log(Session.userPackage);
    setLoading(true);
    await Http.post(
      Constants.END_POINT_UPDATE_USER_PACKAGE,
      Session.userPackage,
    ).then(
      response => {
        setLoading(false);
        console.log(response.data);
        if (response.data.success) {
          if (Session.userObj != null) {
            Session.userObj = response.data.data[0];
            AsyncMemory.storeItem('userObj', Session.userObj);
            navigation.replace('BottomTab');
            console.log(
              'session user object after refresh === >' +
              JSON.stringify(Session.userObj),
            );
          } else {
            console.log('user object is null');
          }
        } else {
        }
      },
      error => {
        setLoading(false);
        console.log(error);
        alert(error)
      },
    );
  };

  const loadPackages = () => {
    // console.log("packages ==== >" + JSON.stringify(packages));
    return packages.map(function (data, i) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }} key={i}>
          <View>
            <Text style={TextStyle.Styles.PACKAGE_STYLE}>{data.PackageName}</Text>
            <View
              style={{
                height: 150,
                width: '80%',
                backgroundColor: Colors.COLOR_THEME,
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
                elevation: 5,
                justifyContent: 'center',
              }}>
              <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>
                {data.PackagePrice} $
              </Text>
              <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>
                {data.PackageDuration}
              </Text>
            </View>

            <View
              style={{
                margin: 40,
              }}>
              {loadDescription(data, i)}

              <View
                style={{
                  width: '90%',
                  marginTop: 20,
                  backgroundColor: 'red',
                  borderWidth: 1,
                }}></View>
              <TouchableOpacity
                onPress={() => productList && productList.some(purchase => purchase.productId === Platform.select({android: data.AndroidSubscriptionId,ios: data.IosSubscriptionId})) ? cancelSubscription(data) : handleSubscription(data)}
                // disabled={productList.some(purchase => purchase.productId === Platform.select({android: data.AndroidSubscriptionId,ios: data.IosSubscriptionId})) ? true : false}
                style={{
                  height: 50,
                  width: 150,
                  borderColor: Colors.COLOR_THEME,
                  borderWidth: 1,
                  alignSelf: 'center',
                  marginTop: 40,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: FontSize.FONT_SIZE_16,
                    fontWeight: 'bold',
                    color: Colors.COLOR_BLACK,
                  }}>
                  {productList && productList.some(purchase => purchase.productId === Platform.select({android: data.AndroidSubscriptionId,ios: data.IosSubscriptionId})) ? 'Cancel' : 'Update'}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: FontSize.FONT_SIZE_16,
                  fontWeight: 'bold',
                  color: Colors.COLOR_BLACK,
                  alignSelf: 'center',
                  marginBottom: 30,
                  marginTop: 30
                }}>
                {
                  productList && productList.some(purchase => purchase.productId === Platform.select({android: data.AndroidSubscriptionId,ios: data.IosSubscriptionId})) && 
                    Session.userObj.packageId === '' ? 'Perhaps other user is subscribed to this. \nPlease cancel this subscription and try again' : 
                    productList && productList.some(purchase => purchase.productId === Platform.select({android: data.AndroidSubscriptionId,ios: data.IosSubscriptionId})) ? 'You are already subscribed to this' : ''}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    });
  };

  const loadDescription = (data, i) => {
    // console.log("Desc=" + data.PackageFeatures)
    var desc = data.PackageFeatures.split(';');
    // console.log(desc[0])
    var descArray = [];
    // for (let index = 0; index < desc.length; index++) {
    //    // console.log(desc[index]);
    //     descArray.push(desc[index])

    // }
    //      console.log(descArray)
    return desc.map(function (data, i) {
      if (data != '') {
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon name="check" size={20} color={Colors.COLOR_BLACK} />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: FontSize.FONT_SIZE_18,
                  color: "black"
                }}>
                {data}
              </Text>
            </View>
          </View>
        );
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
      }}>
      <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
      <Loader loading={loading}></Loader>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 50, marginLeft: 20 }}>
        <Icon name='arrow-left' size={20} color={"black"} />
      </TouchableOpacity>
      <View style={{ alignSelf: 'center' }}>
        <Text style={TextStyle.Styles.PACKAGE_STYLE}> Price Plans</Text>
      </View>

      <Swiper
        onIndexChanged={index => onChangePlan(index)}
        // showsPagination={false}
        loop={false}
        style={{
          height: '90%',
          alignSelf: 'center',
        }}
        activeDotColor={Colors.COLOR_BLACK}>
        {loadPackages()}
      </Swiper>

      <Alerts
        title={alertTitle}
        showAlert={openAlert}
        buttonTxt={buttonTxt}
        cancelTxt={cancelButtonTxt}
        showCancelButton={alertShowCancelButton}
        msg={msg}
        onConfirmPressed={() => confirmPress()}
        onCancelPressed={() => cancelPress()}></Alerts>
    </View>
  );
};

export default Package;


