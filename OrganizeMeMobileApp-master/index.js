/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/redux/app/store';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Message handled in the background!', remoteMessage);
  displayNotification(
    remoteMessage.notification.title,
    remoteMessage.notification.body,
  );
});

async function displayNotification(title, body) {
  // Create a channel
  console.log('Title: ' + title + ' Body: ' + body);
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
  console.log(
    'Title: ' + title + ' Body: ' + body + ' Notification created successfully',
  );
}

console.disableYellowBox = true;

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
