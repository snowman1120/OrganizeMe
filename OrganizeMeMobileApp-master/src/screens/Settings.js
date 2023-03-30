import React, { useState } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, Image, Switch, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/Feather'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import UserAvatar from 'react-native-user-avatar'
import { color } from 'react-native-reanimated'
import AppImages from '../theme/AppImages'
import { SvgXml } from 'react-native-svg'
import AsyncMemory from '../utils/AsyncMemory'
import Session from '../utils/Session'
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import { reset } from '../redux/slices/chat/chatSlice'
import Constants from '../http/Constants'
import utils from 'react-native-axios/lib/utils'
import Alerts from '../utils/Alerts'
import Http from '../http/Http'


const ScreenWidth = Dimensions.get('window').width


const Settings = ({ navigation }) => {


    console.log("user object == >" + JSON.stringify(Session.userObj));

    const value = useAppSelector((State) => State.chat.value)
    const dispatch = useAppDispatch()
    const [openAlert, setOpenAlert] = useState(false);
    const [msg, setMsg] = useState('');
    const [buttonTxt, setButtonTxt] = useState('Ok');
    const [loading, setLoading] = useState(false);


    console.log("user object" + JSON.stringify(Session.userObj));
    const onLogoutClick = () => {
        // dispatch(reset())
        console.log("Logout pressed");
        Session.cleanConversationId()
        Session.cleanUserObj()
        console.log(JSON.stringify(Session.userObj));
        AsyncMemory.storeItem("userObj", null)
        // AsyncMemory.storeItem('isViewed', false)
        navigation.navigate('LoginV2')
    }

    const onDeleteUserClick = () => {

        setOpenAlert(true)
        setMsg("Are you sure you want to delete this account? This will permanently delete your account and all data associated with it.")
    }
    const onConfirmPress = async () => {

        setOpenAlert(false)
        var obj = {
            userId: Session.userObj.userId
        }
        await Http.post(Constants.END_POINT_DELETE_USER, obj
        ).then(response => {
            setLoading(false);
            console.log(response.data);
            if (response.data.code == "200") {
                Session.cleanConversationId()
                Session.cleanUserObj()

                AsyncMemory.storeItem("userObj", null)
                // AsyncMemory.storeItem('isViewed', false)
                navigation.navigate('LoginV2')
            }

        })
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
            <View style={{ marginTop : 40, width: "100%", backgroundColor: 'white', borderBottomWidth: 0.1, elevation: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', width: "50%", justifyContent: 'space-between' }}>
                    {/* <TouchableOpacity>
                        <Icon name='bars' size={25} color="black" style={{ marginLeft: 20 }} />
                    </TouchableOpacity> */}
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
                fontSize: 16,
                color: Colors.COLOR_BLACK,
                fontWeight: 'bold',
                marginTop: 10
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
                    <Icon name='user' size={25} style={{ marginLeft: 10 }} color={"black"} />
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
                    <Icon name='sign-out-alt' size={25} style={{ marginLeft: 10 }} color={"black"} />
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


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icons name='trash' size={25} style={{ marginLeft: 10 }} color={"black"} />
                    <TouchableOpacity
                        onPress={() => onDeleteUserClick()}
                        style={{
                            height: 60,
                            width: "88%",
                            borderColor: Colors.COLOR_BLACK,
                            justifyContent: 'center',

                        }}>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Delete Account</Text>


                    </TouchableOpacity>
                </View>

            </View>


            <Text style={{
                marginHorizontal: 20,
                marginTop: 10,
                fontSize: 16,
                color: Colors.COLOR_BLACK,
                fontWeight: 'bold'
            }}>Misc</Text>


            <View style={{
                width: ScreenWidth - 30,
                elevation: 10,
                backgroundColor: 'white',
                alignSelf: "center",
                borderRadius: 20,
                marginTop: 20,
                justifyContent: 'space-evenly',
            }}>


                <View style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} color={"black"} />
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
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} color={"black"} />
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

            <Text style={{
                marginHorizontal: 20,
                marginTop: 10,
                fontSize: 16,
                color: Colors.COLOR_BLACK,
                fontWeight: 'bold'
            }}>Subscriptions</Text>


            <View style={{
                width: ScreenWidth - 30,
                elevation: 10,
                backgroundColor: 'white',
                alignSelf: "center",
                borderRadius: 20,
                marginTop: 20,
                justifyContent: 'space-evenly',
                marginBottom: 35,
            }}>
                <View style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 5,
                    display: Session.userObj.packageId == "" ? 'flex' : 'none'

                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    <Icon name='file' size={25} style={{ marginLeft: 10 }} color={"black"} />
                    <TouchableOpacity style={{
                        height: 60,
                        width: "88%",
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'center',

                    }}
                        onPress={() => navigation.navigate('Package')}

                    >
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Buy Subscriptions</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    marginTop: 5,
                    marginBottom: 5,
                    display: Session.userObj.packageId == "" ? 'none' : 'flex'

                }}>
                    {/* <Image source={AppImages.noti} style={{ height: 20, width: 20, marginLeft: 10 }} resizeMode="contain" /> */}
                    {/* <Icon name='file' size={25} style={{ marginLeft: 10 }} /> */}
                    <TouchableOpacity disabled style={{
                        height: 60,
                        width: "88%",
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'space-between',
                        marginLeft: 20,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    >
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Subscription Name</Text>

                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK,
                            fontWeight : 'bold'
                        }}>{Session.userObj.packageName}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity disabled style={{
                        height: 60,
                        width: "88%",
                        borderColor: Colors.COLOR_BLACK,
                        justifyContent: 'space-between',
                        marginLeft: 20,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    >
                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>Activation Date</Text>

                        <Text style={{
                            fontSize: 14,
                            color: Colors.COLOR_BLACK
                        }}>{Session.userObj.subscriptionDate}</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => navigation.navigate("Package")}
                        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10, backgroundColor: Colors.COLOR_THEME, alignSelf: 'center', borderRadius: 20 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: "white",
                            marginHorizontal: 20,
                            marginVertical: 10
                        }}>Upgrade Subscription</Text>
                    </TouchableOpacity>

                </View>
            </View>





            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => onConfirmPress()}></Alerts>



        </ScrollView>
    )
}

export default Settings


