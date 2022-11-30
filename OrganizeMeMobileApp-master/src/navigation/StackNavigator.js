import React from 'react';
import { View, Text } from 'react-native';
import Splash from '../screens/Splash';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';
import BottomTab from './BottomTab';
import Package from '../screens/Package';
import WebViewCheckList from '../screens/WebViewCheckList';
import Profile from '../screens/Profile';
import LoginV2 from '../v2Screens/LoginV2';
import SignupV2 from '../v2Screens/SignupV2';
import InAppPurchase from '../InAppPurhcase/InAppPurchase'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash">
        <Stack.Screen name="InAppPurhcase" component={InAppPurchase} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="SignupV2" component={SignupV2} />
        <Stack.Screen name="LoginV2" component={LoginV2} />
        <Stack.Screen name="Package" component={Package} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
