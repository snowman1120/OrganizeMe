import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, Image, ScrollView, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/FontAwesome5'
import Constants from '../http/Constants'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import Loader from '../utils/loader'
import Http from '../http/Http'
import Session from '../utils/Session'
import AsyncMemory from '../utils/AsyncMemory'
import Carousel from 'react-native-snap-carousel';
import RBSheet from "react-native-raw-bottom-sheet";
import Modal from 'react-native-modal'
import Firebase from '../firebase/Firebase';
import Alerts from '../utils/Alerts'



const CheckList = ({ navigation }) => {

    // console.log("Session user obj === >" + JSON.stringify(Session.userObj));
    const refRBSheet = useRef();


    const Screenwidth = Dimensions.get('window').width

    useEffect(() => {
        console.log("user limit ======== >");
        userLimit()
        console.log("After user limit ======== >");
        console.log("inside if");
    }, [getCheckList]);

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [desc, setDesc] = useState()
    const [visible, setVisible] = useState(false)
    const [uri, setUri] = useState("")
    const [openAlert, setOpenAlert] = useState(false);
    const [msg, setMsg] = useState('');
    const [buttonTxt, setButtonTxt] = useState('Ok');
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [success, setSuccess] = useState()
    const [on, setOn] = useState()


    const confirmPress = () => {
        if (!success) {
            navigation.navigate("Settings")
        }

    };

    const getCheckList = async () => {

        setLoading(true)
        console.log("Get Check List ");
        await Http.get(Constants.END_POINT_GET_CHECKLIST).then((response) => {
            setLoading(false)
            // console.log("Get CheckList === > " + JSON.stringify(response.data.data));
            if (response.data.success) {
                setData(response.data.data)
                // console.log("company packages === >" + JSON.stringify(Session.companyPackages));
            }
            else {

                Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
            }



        }, (error) => {
            console.log(error);
            setLoading(false)

            Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
        })
    }

    const onConversation = async () => {


        Session.conversation.senderId = Session.userObj.userId
        Session.conversation.senderName = Session.userObj.userName
        Session.conversation.receiverId = Session.docObj.userId
        Session.conversation.receiverName = Session.docObj.userName
        Session.conversation.conversationName = Session.userObj.userName
        Session.conversation.senderImgUrl = Session.userObj.imgUrl
        Session.conversation.receiverImgUrl = Session.docObj.imgUrl



        console.log("Conversation == >" + JSON.stringify(Session.conversation));

        await Http.postConversation(Constants.CONVERSATION_URL, Session.conversation).then((response) => {
            setLoading(false)
            console.log("============================ conversation response === > " + JSON.stringify(response.data));

            if (response.status >= 200) {
                console.log("in")
                if (response.data[0]?._id) {
                    Session.conversationId = response.data[0]?._id;
                    AsyncMemory.storeItem("conversationId", Session.conversationId)

                } else if (response.data?._id) {
                    AsyncMemory.storeItem("conversationId", Session.conversationId)
                    Session.conversationId = response.data?._id;
                }
                console.log("Conversation id =" + Session.conversationId)
                // if(response.data.
            }
            else {
            }


        }, (error) => {
            console.log(error);
        })
    }

    const showMoreClick = (item) => {
        console.log(item);
        setDesc(item.checkListDesc)
        refRBSheet.current.open()
    }
    const onImgPress = (item) => {
        console.log(item);
        setUri(item)
        setVisible(true)

    }


    const renderItem = ({ item, index }) => {
        return (

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* <View style={{ alignSelf: 'center', backgroundColor: 'red' }}>
                    <Text>{item.checkListTitle}</Text>
                </View> */}
                <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>

                <View style={{
                    height: 400,
                    marginTop: 10,
                    width: "100%",
                    borderRadius: 30,
                    alignSelf: 'center',
                    elevation: 10,
                    marginBottom: 35,
                    backgroundColor: Colors.COLOR_WHITE,

                }}>
                    <TouchableOpacity
                        onPress={() => onImgPress(item.checkListImgUrl)}
                        style={{
                            height: "40%",
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,

                        }}>
                        <Image style={{
                            height: 150,
                            width: 150,
                        }} source={{ uri: item.checkListImgUrl }} resizeMode="contain" />
                    </TouchableOpacity>
                    <View style={{
                        height: "60%",
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                    }}>
                        {/* <Text style={{
                            marginLeft: 10,
                            marginTop: 10,
                            fontSize: 16,
                            color: Colors.COLOR_BLACK,
                            fontWeight: 'bold'
                        }}>Title</Text> */}
                        <Text style={{
                            margin: 10,
                            fontSize: 18,
                            color: Colors.COLOR_BLACK,
                            fontWeight: 'bold',
                            width: 300,
                        }}>{item.checkListTitle}</Text>
                        {/* <Text style={{
                            marginLeft: 10,
                            marginTop: 10,
                            fontSize: 16,
                            color: Colors.COLOR_BLACK,
                            fontWeight: 'bold'
                        }}>Description</Text> */}
                        <ScrollView scrollEnabled={false} fadingEdgeLength={100} showsVerticalScrollIndicator={false} style={{ maxHeight: 120 }}>
                            <View style={{ margin: 10 }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: 'grey',
                                    justifyContent: "center"
                                }}>{item.checkListDesc.trim()}</Text>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => showMoreClick(item)}
                            style={{ marginRight: 10, alignSelf: 'flex-end' }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: 'grey',
                                justifyContent: "center",

                            }}>Show more</Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity

                        onPress={() => navigation.navigate('WebViewCheckList', { item })}
                        style={{
                            height: 40,
                            width: "100%",
                            backgroundColor: Colors.COLOR_THEME,
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                            position: 'absolute',
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                        <Text style={{ fontWeight: '600', color: 'white' }}>Check</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );

    }

    const userLimit = async () => {
        console.log("inside userlimit method");
        console.log(Session.userObj.userId);
        setLoading(true)
        await Http.get(Constants.END_POINT_CHECK_USER_LIMIT + Session.userObj.userId).then((response) => {
            console.log("after get request method");
            setLoading(false)
            console.log("response limit data === > " + JSON.stringify(response.data));
            if (response.data.success) {
                console.log("true");
                setSuccess(true)
                if (response.data.data[0].showCheckList == "Y") {
                    getCheckList()
                    onConversation()
                    setOn(true)
                }
                else {
                    setOn(false)
                }
            }
            else {
                setSuccess(false)
                setMsg(response.data.message)
                setOpenAlert(true)
            }
        }, (error) => {
            console.log("error ==>" + error);
        })
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
            <Loader loading={loading} ></Loader>
            <View style={{ marginTop: 40, width: "100%", backgroundColor: 'white', borderBottomWidth: 0.1, elevation: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', width: "50%", justifyContent: 'space-between' }}>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Icons name='bars' size={25} color="black" style={{ marginLeft: 20 }} />
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

            {/* <Carousel
                // ref={(c) => { this._carousel = c; }}
                layout='default'
                data={data}
                // style={{  backgroundColor : 'red' }}
                renderItem={(item) => renderItem(item)}
                sliderWidth={Screenwidth}
                itemWidth={Screenwidth / 1.3}
            />

            <Modal isVisible={visible} >

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setVisible(false)} style={{ height: 50, justifyContent: 'center', alignItems: 'center', width: 50, position: 'absolute', right: 20, top: 20 }}>
                        <Icon name='cancel' size={30} />
                    </TouchableOpacity>
                    <Image source={{ uri: uri }} style={{ height: 300, width: 200 }} resizeMode="contain" />
                </View>
            </Modal>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                animationType="slide"
                openDuration={10}
                customStyles={{
                    container: {
                        height: 400,
                        borderTopRightRadius: 50,
                        borderTopLeftRadius: 50,
                        elevation: 10
                    },
                    wrapper: {
                        backgroundColor: 'transparent',

                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <TouchableOpacity style={{ height: 40, marginRight: 20, justifyContent: 'center', alignItems: 'center', width: 40, alignSelf: 'flex-end' }} onPress={() => refRBSheet.current.close()}>
                    <Icon name='close' size={20} color="black" />
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{ marginVertical: 30, marginLeft: 20, marginRight: 20, fontSize: 14, color: 'black' }}>{desc}</Text>
                </ScrollView>
            </RBSheet> */}
            <FlatList
                nestedScrollEnabled={true}
                data={data}
                extraData={data}
                numColumns={2}
                key={data.checkListId}
                style={{ marginTop: 20 }}
                keyExtractor={item => item.checkListId}
                renderItem={({ item }) =>
                    <View style={{ flex: 1 }}>
                        {/* <View style={{ alignSelf: 'center', backgroundColor: 'red' }}>
                    <Text>{item.checkListTitle}</Text>
                </View> */}
                        <View style={{
                            // height: 300,
                            marginTop: 10,
                            width: 150,
                            borderRadius: 20,
                            alignSelf: 'center',
                            elevation: 10,
                            marginBottom: 35,
                            backgroundColor: Colors.COLOR_WHITE,

                        }}>
                            <TouchableOpacity
                                onPress={() => onImgPress(item.checkListImgUrl)}
                                style={{
                                    // height: "40%",
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderTopLeftRadius: 30,
                                    borderTopRightRadius: 30,

                                }}>
                                <Image style={{
                                    height: 120,
                                    width: 120,
                                    marginTop: 20,
                                    marginBottom: 20
                                }} source={{ uri: item.checkListImgUrl }} resizeMode="contain" />
                            </TouchableOpacity>
                            <View style={{
                                // height: "60%",
                                borderBottomLeftRadius: 30,
                                borderBottomRightRadius: 30,
                                marginBottom: 20
                            }}>
                                {/* <Text style={{
                            marginLeft: 10,
                            marginTop: 10,
                            fontSize: 16,
                            color: Colors.COLOR_BLACK,
                            fontWeight: 'bold'
                        }}>Title</Text> */}
                                <Text style={{
                                    marginBottom: 20,
                                    marginLeft: 20,
                                    fontSize: 14,
                                    color: Colors.COLOR_BLACK,
                                    fontWeight: 'bold',
                                    width: 100,
                                }}>{item.checkListTitle}</Text>
                                {/* <Text style={{
                            marginLeft: 10,
                            marginTop: 10,
                            fontSize: 16,
                            color: Colors.COLOR_BLACK,
                            fontWeight: 'bold'
                        }}>Description</Text> */}
                                {/* <ScrollView scrollEnabled={false} fadingEdgeLength={100} showsVerticalScrollIndicator={false} style={{ maxHeight: 120 }}>
                                    <View style={{ margin: 10 }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '500',
                                            color: 'grey',
                                            justifyContent: "center"
                                        }}>{item.checkListDesc.trim()}</Text>
                                    </View>
                                </ScrollView>
                                <TouchableOpacity
                                    onPress={() => showMoreClick(item)}
                                    style={{ marginRight: 10, alignSelf: 'flex-end' }}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        color: 'grey',
                                        justifyContent: "center",

                                    }}>Show more</Text>
                                </TouchableOpacity> */}

                            </View>
                            <TouchableOpacity

                                onPress={() => navigation.navigate('WebViewCheckList', { item })}
                                style={{
                                    height: 30,
                                    width: "100%",
                                    backgroundColor: Colors.COLOR_THEME,
                                    borderBottomLeftRadius: 20,
                                    borderBottomRightRadius: 20,
                                    position: 'absolute',
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                <Text style={{ fontWeight: '600', color: 'white' }}>Check</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />

            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => confirmPress()}></Alerts>
        </View>
    )
}

export default CheckList