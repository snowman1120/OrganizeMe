import React from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, Image, Switch } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import UserAvatar from 'react-native-user-avatar'
import { color } from 'react-native-reanimated'
import AppImages from '../theme/AppImages'
import { SvgXml } from 'react-native-svg'
import AsyncMemory from '../utils/AsyncMemory'
import Session from '../utils/Session'


const ScreenWidth = Dimensions.get('window').width


const Settings = ({ navigation }) => {


    console.log("user object" + JSON.stringify(Session.userObj.userName));

    const onLogoutClick = () => {
        console.log("Logout pressed");
        Session.cleanUserObj()
        console.log(JSON.stringify(Session.userObj));
        AsyncMemory.storeItem("userObj", null)
        navigation.replace('Login')
    }


    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            {/* <View style={{ height: 140, width: ScreenWidth, backgroundColor: Colors.COLOR_THEME }}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginTop: 20, marginLeft: 20 }}>
                        {/* <Icon name='user' color={Colors.COLOR_WHITE} size={30} style={{ marginHorizontal: 10 }} /> */}
            {/* <UserAvatar size={100} name="HA" style={{ height: 90, width: 90 }} /> */}
            {/* </TouchableOpacity> */}
            {/* <View style={{ alignSelf: "center" , marginLeft : 10 }}> */}
            {/* <Text style={{ fontFamily: 'Aftika-Bold', color: Colors.COLOR_WHITE, fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>Weclome !</Text> */}
            {/* <Text style={{ fontFamily: 'Aftika-Bold', color: Colors.COLOR_WHITE, fontSize: 20, fontWeight: 'bold' }}>Hamza Shafique</Text> */}
            {/* </View> */}


            {/* </View> */}
            {/* </View>  */}


            <Text style={{
                marginHorizontal: 20,
                marginTop: 40,
                fontSize: 16,
                color: Colors.COLOR_BLACK,
                fontWeight: 'bold'
            }}>Accounts</Text>


            <View style={{
                height: 220,
                width: ScreenWidth - 30,
                elevation: 10,
                backgroundColor: 'white',
                alignSelf: "center",
                borderRadius: 20,
                marginTop: 20,
                justifyContent: 'space-evenly',

            }}>

                <View style={{
                    borderBottomWidth: 0.5,
                    width: "95%",
                    alignSelf: 'flex-end'
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: Colors.COLOR_BLACK,
                        marginTop: 10
                    }}>logged in as</Text>


                    <Text style={{
                        fontSize: 14,
                        color: Colors.COLOR_BLACK,
                        fontWeight: '600'
                    }}>{Session.userObj.userName}</Text>



                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='user' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile') }
                        style={{
                            height: 60,
                            width: "88%",
                            borderBottomWidth: 0.5,
                            borderColor: Colors.COLOR_BLACK,
                            justifyContent: 'center',

                        }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Account Settings</Text>
                        <Text style={{
                            fontSize: 12,
                            color: Colors.COLOR_BLACK
                        }}>update login credentials or account</Text>


                    </TouchableOpacity>
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='building' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderBottomWidth: 0.5,
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Manage Connections</Text>


                    </TouchableOpacity>
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='sign-out-alt' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity
                        onPress={() => onLogoutClick()}
                        style={{
                            height: 60,
                            width: "88%",
                            borderColor: Colors.COLOR_BLACK,
                            justifyContent: 'center',

                        }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Log Out</Text>


                    </TouchableOpacity>
                </View>

            </View>


            <Text style={{
                marginHorizontal: 20,
                marginTop: 20,
                fontSize: 16,
                color: Colors.COLOR_BLACK,
                fontWeight: 'bold'
            }}>Misc</Text>


            <View style={{
                height: 270,
                width: ScreenWidth - 30,
                elevation: 10,
                backgroundColor: 'white',
                alignSelf: "center",
                borderRadius: 20,
                marginTop: 20,
                justifyContent: 'space-evenly',
                marginBottom: 35
            }}>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='heart' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderBottomWidth: 0.5,
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Write a Review</Text>
                    </TouchableOpacity>
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='paper-plane' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderBottomWidth: 0.5,
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Send in Diagnostics</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderBottomWidth: 0.5,
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Legal</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderBottomWidth: 0.5,
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Privacy Policies</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Term of Conditions</Text>
                    </TouchableOpacity>
                </View>



            </View>









        </ScrollView>
    )
}

export default Settings


