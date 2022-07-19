import React, { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import Constants from '../http/Constants';
import Session from '../utils/Session'
import Http from '../http/Http'

const Firebase = async () => {

    Session.tokens.deviceToken = await messaging().getToken()
    Session.tokens.userId = Session.userObj.userId
    console.log("user ID ==== >" +JSON.stringify(Session.userObj));
    console.log("Device Token === >" + JSON.stringify(Session.tokens));

    Http.post(Constants.END_POINT_UPDATE_DEVICE_TOKEM, Session.tokens).then((response) => {
        // setLoading(false)
        console.log("response token data == >  " + JSON.stringify(response.data));
        if (response.data.success) {

            console.log( "Success" +response.data.message);

            
        } else {

        }
    }, (error) => {
        // setLoading(false)
        console.log( "error === >" + error);
    });


    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
        else { console.log('Authorization status:', authStatus) }

    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        //  Utils.Alert('A new FCM message arrived!'   , JSON.stringify(remoteMessage));
        displayNotification(remoteMessage.notification.title, remoteMessage.notification.body)
    });

    async function displayNotification(title, body) {
        // Create a channel
        console.log("Title: " + title + " Body: " + body)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: title,
            body: body,
            android: {
                channelId,
                // optional, defaults to 'ic_launcher'.
            },
        });

    }
}
export default Firebase