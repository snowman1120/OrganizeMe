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

const Stack = createNativeStackNavigator();

const StackNavigator = () => {


    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Package" component={Package} />
                <Stack.Screen name="WebViewCheckList" component={WebViewCheckList} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="BottomTab" component={BottomTab} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigator;