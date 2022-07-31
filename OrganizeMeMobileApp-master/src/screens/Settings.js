import React from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, Image, Switch , StatusBar } from 'react-native'
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
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
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
            <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
            <View style={{ height: 60, width: "100%", backgroundColor: 'white', borderBottomWidth: 0.1, elevation: 10, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: "50%", justifyContent: 'space-between' }}>
                    <TouchableOpacity>
                        <Icon name='bars' size={25} color="black" style={{ marginLeft: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginLeft: 10 }} >
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={{ uri: Session.userObj.imgUrl == "" ? "http://194.233.69.219/documents/0730232429.png" : Session.userObj.imgUrl }} style={{ height: 40, width: 40, borderRadius: 30 }} />
                            <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                                <Text style={{ color: 'black', fontSize: 14 }}>Welcome</Text>
                                <Text style={{ color: 'black', fontSize: 12, fontWeight: 'bold' }}>{Session.userObj.userName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

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
                    }}>Logged in as</Text>


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
                        onPress={() => navigation.navigate('Profile')}
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
                        }}>Update login credentials or account</Text>


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
                height: 120,
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
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderBottomWidth: 0.5,
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}
                        onPress={() => navigation.navigate('WebViews', Session.companySettings.privacyText)}
                    >
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

                    }}
                        onPress={() => navigation.navigate('WebViews', Session.companySettings.termsText)}

                    >
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


