import React from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/MaterialIcons'
import Chat from '../screens/Chat'
import CheckList from '../screens/CheckList'
import Settings from '../screens/Settings'
import Colors from '../theme/Colors';
import Icon2 from 'react-native-vector-icons/Ionicons'
import AppImages from '../theme/AppImages';
import Profile from '../screens/Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WebViews from '../screens/WebViews';



const Tab = createBottomTabNavigator();




const SettingStack = () => {
    const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name="Setting" component={Settings} />
            <stack.Screen name="Profile" component={Profile} />
            <stack.Screen name="WebViews" component={WebViews} />

        </stack.Navigator>
    );
};

const ChatStack = () => {
    const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name="Chat" component={Chat} />
            <stack.Screen name="Profile" component={Profile} />
        </stack.Navigator>
    );
};

const CheckStack = () => {
    const stack = createNativeStackNavigator();
    return (
        <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name="CheckList" component={CheckList} />
            <stack.Screen name="Profile" component={Profile} />
        </stack.Navigator>
    );
};


const BottomTab = () => {



    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                // unmountOnBlur: true,
                tabBarActiveTintColor: Colors.COLOR_THEME,
                tabBarStyle: {
                    elevation: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold'
                }

            }}

            initialRouteName={'Chat'}>



            <Tab.Screen
                name="CheckList"
                component={CheckStack}
                options={{

                    tabBarStyle: {
                       
                    },
                    tabBarLabelStyle: {
                        color: 'black',
                        fontSize: 12,
                        fontWeight: '600',
                        
                    },
                    tabBarIcon: ({ tintColor, focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? Colors.COLOR_THEME : null,
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: focused ? 2 : 0,
                                borderRadius: 5,
                                shadowColor: 'black',
                                shadowOpacity: 0.3,
                                shadowOffset: { x: 2, y: 2 },
                                shadowRadius: 3,
                            }}>
                            <Icon
                                name='list'
                                size={20}
                                style={{
                                    // tintColor: focused ? Colors.THEME_WHITE : "#000000",
                                }}
                            />
                        </View>
                    ),
                }}
            />



            <Tab.Screen
                name="Chat"
                component={ChatStack}
                options={{
                    tabBarLabelStyle: {
                        color: 'black',
                        fontSize: 12,
                        fontWeight: '600'
                    },
                    tabBarIcon: ({ tintColor, focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? Colors.COLOR_THEME : null,
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: focused ? 2 : 0,
                                borderRadius: 25,
                                shadowColor: 'black',
                                shadowOpacity: 0.3,
                                shadowOffset: { x: 2, y: 2 },
                                shadowRadius: 3,
                                position: 'absolute',
                                // bottom:10,
                            }}>
                            <Image
                                size={20}
                                source={AppImages.messenger}
                                style={{

                                    height: 30,
                                    width: 30,
                                    // tintColor: focused ? Colors.COLOR_THEME : "#000000",
                                }}
                            />
                            {/* <Icons
                                name='messenger'
                                size={20}
                                style={{
                                    // tintColor: focused ? Colors.THEME_WHITE : "#000000",
                                }}
                            /> */}
                        </View>
                    ),
                }}
            />



            <Tab.Screen
                name="Settings"
                component={SettingStack}
                options={{
                    tabBarLabelStyle: {
                        color: 'black',
                        fontSize: 12,
                        fontWeight: '600'
                    },
                    tabBarIcon: ({ tintColor, focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? Colors.COLOR_THEME : null,
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: focused ? 2 : 0,
                                borderRadius: 5,
                                shadowColor: 'black',
                                shadowOpacity: 0.3,
                                shadowOffset: { x: 2, y: 2 },
                                shadowRadius: 3,
                            }}>
                            <Icon2
                                name='settings-outline'
                                size={20}
                                style={{
                                    // tintColor: focused ? Colors.THEME_WHITE : "#000000",
                                }}
                            />
                        </View>
                    ),
                }}
            />



        </Tab.Navigator>
    );
}

export default BottomTab