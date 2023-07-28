import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, StyleSheet, Linking, Image, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/FontAwesome5'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import * as ImagePicker from "react-native-image-picker";
import ImgToBase64 from "react-native-image-base64";
import TextStyle from '../theme/TextStyle'
import Loader from '../utils/loader'
import {
    GiftedChat,
    InputToolbar,
    Actions,
    Composer,
    Send,
    ActionsProps,
} from 'react-native-gifted-chat'
import { io } from "socket.io-client";
import uuid from 'react-native-uuid';
const SERVER = "http://154.53.58.235:3000";
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import { reset, addMsg } from '../redux/slices/chat/chatSlice'
import Session from '../utils/Session'
import DocumentPicker from "react-native-document-picker"
// import RNFetchBlob from "react-native-fetch-blob";
import Constants from '../http/Constants'
import Http from '../http/Http'
import Modal from 'react-native-modal'
import AsyncMemory from '../utils/AsyncMemory'
import Firebase from '../firebase/Firebase'
import Alerts from '../utils/Alerts'

//const socket = useRef(io(SERVER));



const Chat = ({ navigation }) => {

    let docObject = []
    let conversationId

    console.log("==========================Chat Screen==============================");

    const [messages, setMessages] = useState([]);
    const [exsists, setExsists] = useState(false)
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)
    const screenWidth = Math.round(Dimensions.get("window").width);
    const screenHight = Math.round(Dimensions.get("window").height);
    const [visible, setVisible] = useState(false)
    const [modalImg, setMoadlImg] = useState("")
    const [id, setId] = useState("")
    const [present, setPresent] = useState(true)

    const socket = io(SERVER);
    let m = []
    const value = useAppSelector((State) => State.chat.value)
    const dispatch = useAppDispatch()


    const [openAlert, setOpenAlert] = useState(false);
    const [msg, setMsg] = useState('');
    const [buttonTxt, setButtonTxt] = useState('Ok');
    const [alertSuccess, setAlertSuccess] = useState(false);
    const useRedux = (message) => {
        // dispatch(addMsg(message))

    }

    const getDocObject = async () => {


        docObject = await AsyncMemory.retrieveItem('docObj')
        conversationId = await AsyncMemory.retrieveItem('conversationId')
        setId(docObject.userId)

    }


    const reloadOldChats = async (id) => {
        console.log("==============Reload Old Chats API=====================");
        console.log("session conversation id from api response in reaload chats" + JSON.stringify(id));
        setLoading(true)

        await Http.getOldChats(id).then((response) => {
            setLoading(false)
            console.log("response data === > " + JSON.stringify(response.data));
            if (response.data == "" || response.data == []) {
                return
            }
            else {
                if (response.data?.length >= 2) {
                    for (let i = 0; i < response.data.length; i++) {
                        console.log("message to push in store === >" + JSON.stringify(response.data[i]));
                        if (response.data[i]?.type == "img") {
                            console.log("inside img condition of mongoDb Api");
                            setMessages(messages => [...messages,
                            {
                                _id: uuid.v4(),
                                text: '',
                                image: response.data[i]?.url,
                                createdAt: new Date(),
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: response.data[i]?.senderId,
                                    name: Session.docObj.userName,
                                    avatar: Session.docObj.imgUrl,
                                },
                            }
                                ,
                            ]);


                        }
                        else if (response.data[i]?.type == "pdf") {
                            console.log("inside pdf condition of mongoDb Api");
                            setMessages(messages => [...messages,
                            {
                                _id: uuid.v4(),
                                text: <TouchableOpacity onPress={() => Linking.openURL(response.data[i].url)}><Text>{response.data[i].text}</Text></TouchableOpacity>,
                                createdAt: new Date(),
                                url: response.data[i]?.text,
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: response.data[i]?.senderId,
                                    name: Session.docObj.userName,
                                    avatar: Session.docObj.imgUrl,
                                },
                            }
                                ,
                            ]);
                        }

                        else {
                            console.log("inside msg condition of mongoDb Api");
                            setMessages(messages => [...messages,
                            {
                                _id: uuid.v4(),
                                text: response.data[i]?.text,
                                createdAt: new Date(),
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: response.data[i]?.senderId,
                                    name: Session.docObj.userName,
                                    avatar: Session.docObj.imgUrl,
                                },
                            }
                                ,
                            ]);
                        }

                        setPresent(false)
                    }
                }
                else {
                    if (response.data[0]?.type == "img") {
                        console.log("inside img condition of mongoDb Api");
                        setMessages(messages => [...messages,
                        {
                            _id: uuid.v4(),
                            text: '',
                            image: response.data[0]?.url,
                            createdAt: new Date(),
                            user: {
                                conversationId: Session.conversationId,
                                _id: response.data[0]?.senderId,
                                name: Session.docObj.userName,
                                avatar: Session.docObj.imgUrl,
                            },
                        }
                            ,
                        ]);


                    }
                    else if (response.data[0]?.type == "pdf") {
                        console.log("inside pdf condition of mongoDb Api");
                        setMessages(messages => [...messages,
                        {
                            _id: uuid.v4(),
                            text: <TouchableOpacity onPress={() => Linking.openURL(response.data[0].url)}><Text>{response.data[0].text}</Text></TouchableOpacity>,
                            createdAt: new Date(),
                            url: response.data[0]?.url,
                            user: {
                                conversationId: Session.conversationId,
                                _id: response.data[0]?.senderId,
                                name: Session.docObj.userName,
                                avatar: Session.docObj.imgUrl,
                            },
                        }
                            ,
                        ]);
                    }

                    else {
                        console.log("inside msg condition of mongoDb Api");
                        setMessages(messages => [...messages,
                        {
                            _id: uuid.v4(),
                            text: response.data[0]?.text,
                            createdAt: new Date(),
                            user: {
                                conversationId: Session.conversationId,
                                _id: response.data[0]?.senderId,
                                name: Session.docObj.userName,
                                avatar: Session.docObj.imgUrl,
                            },
                        }
                            ,
                        ]);
                    }

                    setPresent(false)
                }
            }

        }, (error) => {
            console.log(error);
        })

        setPresent(false)

    }

    const onConversation = async () => {


        Session.conversation.senderId = Session.userObj.userId
        Session.conversation.senderName = Session.userObj.userName
        Session.conversation.receiverId = Session.docObj.userId
        Session.conversation.receiverName = Session.docObj.userName
        Session.conversation.conversationName = Session.userObj.userName
        Session.conversation.senderImgUrl = Session.userObj.imgUrl
        Session.conversation.receiverImgUrl = Session.docObj.imgUrl




        if (Session.conversationId != null || Session.conversationId != undefined || Session.conversationId == "") {
            await Http.postConversation(Constants.CONVERSATION_URL, Session.conversation).then((response) => {
                setLoading(false)

                if (response.status >= 200) {
                    if (response.data[0]?._id) {
                        Session.conversationId = response.data[0]?._id;
                        AsyncMemory.storeItem("conversationId", Session.conversationId)
                        console.log("Api REsponse ===>  ConverationID == >" + JSON.stringify(response.data[0]?._id));
                        reloadOldChats(response.data[0]?._id)

                    } else if (response.data?._id) {
                        AsyncMemory.storeItem("conversationId", Session.conversationId)
                        Session.conversationId = response.data?._id;
                        reloadOldChats(response.data?._id)
                    }
                }
                else {
                }


            }, (error) => {
                console.log(error);
            })
        }
        else {
            console.log("Session Conversation ID is already stored");
        }

    }

    const getFirstWelcomeMsg = async () => {
        console.log("get first msg");
        await Http.get(Constants.END_POINT_GET_WELCOME_MESSAGE + Session.userObj.userId).then((response) => {
            console.log(response.data)
            if (response.data.success) {
                console.log("set msg");
               let  m = [
                    {
                        _id: uuid.v4(),
                        text: response.data.data[0].message,
                        createdAt: new Date(),
                        user: {
                            conversationId: Session.conversationId,
                            _id: docObject.userId,
                            name: docObject.userName,
                            avatar: docObject.imgUrl,
                        },
                        // image:'http://194.233.69.219/general/doctor.jpg'
                    },
                ]

                // setMessages(m)
                setMessages(previousMessages => GiftedChat.append(previousMessages, m))

                socket.emit('doctorMessage', m);
     
                
            }
        }).catch(error => console.log(error))
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
                if (response.data.data[0].showChat == "Y") {
                    setOn(true)
                    onConversation()
                    getDocObject()
                    Firebase()
                    getFirstWelcomeMsg()
                    socket.on('connect', () => {
                        console.log("I'm connected with the back-end");
                    });
                    socket.emit("addUser", Session.userObj.userId);

                    socket.on('welcomeMessage', msg => {


                        console.log("Doc Objec " + docObject.userId);

                        console.log("Inside iffff");
                        m = [
                            {
                                _id: uuid.v4(),
                                text: msg,
                                createdAt: new Date(),
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: docObject.userId,
                                    name: docObject.userName,
                                    avatar: docObject.imgUrl,
                                },
                                // image:'http://194.233.69.219/general/doctor.jpg'
                            },
                        ]

                        // setMessages(m)
                        setMessages(previousMessages => GiftedChat.append(previousMessages, m))
                        // useRedux(m)
                    });
                    socket.on('chatmessage', msg => {
                        console.log("chatmessage:" + msg);
                    });
                    socket.on('clientMessage', msg => {
                        console.log("Recieving message");
                        console.log("msgg == >" + JSON.stringify(msg));
                        onReceive([
                            {
                                _id: uuid.v4(),
                                text: msg,
                                createdAt: new Date(),
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: docObject.userId,
                                    name: docObject.userName,
                                    avatar: docObject.imgUrl,
                                },
                            },
                        ])

                    });
                }
                else {
                    setSuccess(false)
                    setMsg(response.data.message)
                    setOpenAlert(true)
                }
            }
            else {
                setSuccess(false)
                setMsg(response.data.message)
                setOpenAlert(true)
            }
        }, (error) => {
            setLoading(false);
            console.log("error ==>" + error);
        })
    }

    const [success, setSuccess] = useState()
    const [on, setOn] = useState()


    const confirmPress = () => {
        if (!success) {
            navigation.navigate("Settings")
        }

    };

    const cancelPress = () => {
        navigation.navigate("Settings")
    }

    useEffect(() => {
        console.log("user limit ======== >");
        userLimit()
        console.log("After user limit ======== >");
    }, [])



    const onReceive = useCallback((messages = []) => {
        //  socket.emit('doctorMessage', messages);
        console.log("messages === >" + JSON.stringify(messages));
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        // useRedux(messages)


    })
    const onSend = useCallback((messages = []) => {
        socket.emit('doctorMessage', messages);
        console.log("Messsage sendd === >" + JSON.stringify(messages));
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    })

    const renderActions = (props) => {
        return (
            <Actions
                {...props}
                options={{
                    ["Send Image"]: handlePickImage,
                    ["Send Document"]: handlePickDocument,
                }}
                icon={() => (
                    <Icon name={"attachment"} size={28} color={Colors.colorPrimary} />
                )}
                onSend={(args) => console.log("Sending arguments " + args)}
            />
        );
    };


    const handlePickImage = async () => {
        ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            multiple: false,
            // width: 300,
            // height: 400,
            cropping: false
        }).then(image => {
            onImageUpload(image);

        })
    };

    const onImageUpload = async (image) => {
        Session.cleanImgs()
        if (image.length == undefined) {
            // setLoading(true)
            await uploadImages(image.assets[0].uri)

        }
        else {

        }
    }
    const uploadImages = async (imageObj) => {
        setLoading(true)

        var formdata = new FormData();
        formdata.append("file", {
            name: imageObj,
            type: "image/jpeg",
            uri: imageObj
        }
        )
        await Http.PostImage(Constants.END_POINT_POST_IMAGE, formdata).then(response => response.json())
            .then((json) => {
                setLoading(false)
                console.log(json);
                console.log("==================================Image Url =====================================");
                console.log(json.data.imageUrl);

                if (json.success == true) {

                    onSend(

                        m = [
                            {
                                _id: uuid.v4(),
                                text: '',
                                url: json.data.imageUrl,
                                createdAt: new Date(),
                                type: "img",
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: Session.userObj.userId,
                                    name: Session.userObj.userName,
                                    avatar: Session.userObj.imgUrl,
                                },
                                image: json.data.imageUrl,
                            },
                        ]);
                    // setImages(json.data.imageUrl)
                    // useRedux(m)

                }

            })
            .catch(error => {
                setLoading(false)
                console.log('request failed', error);
            });
    }


    const uploadTask = async (fileName, data, type) => {
        setLoading(true)

        const bodyFormData = new FormData();
        if (type == "image") {
            bodyFormData.append("filename", "file.jpeg");
            bodyFormData.append("data", data);
        } else {
            bodyFormData.append("file", {
                name: fileName,
                type: "application/pdf",
                uri: data,
            });

        }

        await Http.PostImage(Constants.END_POINT_POST_IMAGE, bodyFormData).then(response => response.json())
            .then((json) => {
                setLoading(false)
                console.log("==================================Image Url =====================================");
                console.log(json.data.imageUrl);

                if (json.success == true) {
                    console.log("================= on send Document ===================== ")
                    onSend(
                        m = [
                            {
                                _id: uuid.v4(),
                                text: json.data.imageName,
                                url: json.data.imageUrl,
                                createdAt: new Date(),
                                type: "pdf",
                                user: {
                                    conversationId: Session.conversationId,
                                    _id: Session.userObj.userId,
                                    name: Session.userObj.userName,
                                    avatar: Session.userObj.imgUrl,
                                }
                            },
                        ]);

                }

            })
            .catch(error => {
                setLoading(false)
                console.log('request failed', error);
            });


    };



    const handlePickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.doc,
                    DocumentPicker.types.docx,
                    DocumentPicker.types.xls,
                    DocumentPicker.types.xlsx,
                    DocumentPicker.types.ppt,
                    DocumentPicker.types.pptx,
                ],
                copyTo: "cachesDirectory",

            });


            if (Platform.OS == "ios") {
                uploadTask(res.name, res.fileCopyUri, "Document");
            } else {
                let m = res[0]
                uploadTask(res[0].name, res[0].fileCopyUri, "Document");


            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    };

    const renderBubble = (props) => {

        const { currentMessage } = props;
        console.log("current Msg == >" + JSON.stringify(currentMessage));

        let imgChar = "jpg"
        let pdfChar = "pdf"
        let docxChar = "docx"

        if (currentMessage.user._id == id) {
            console.log("========================Doctor messages ================");
            if (currentMessage.url?.includes(pdfChar)) {

                //setLoading(false)
                console.log("Insidde if pdf doctor");
                return (
                    <View style={{ maxHeight: 80, maxWidth: "30%", marginVertical: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f6f9fb", borderRadius: 10 }}>
                        <TouchableOpacity onPress={() => Linking.openURL(currentMessage.url)}>
                            <View>
                                <Icons name='file-pdf' size={50} />

                            </View>
                        </TouchableOpacity>
                    </View>
                )

            }
            else if (currentMessage.image?.includes(imgChar)) {
                // console.log("Insidde ELse if Img");
                //  setLoading(false)
                return (
                    <View style={{ height: 200, width: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f6f9fb", borderRadius: 10 }}>
                        <TouchableOpacity onPress={() => onImagePress(currentMessage.image)} style={{ height: 190, width: 150, justifyContent: 'center', alignItems: 'center' }} >
                            <Image source={{ uri: currentMessage.url }} style={{ height: "90%", width: "90%" }} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                )
            }
            else {
                // console.log("Insidde ELse Text");
                //  setLoading(false)
                return (
                    <View style={{ maxWidth: "80%", justifyContent: 'center', alignItems: 'flex-end', backgroundColor: "#f6f9fb", borderRadius: 10 }}>
                        <Text style={{ fontSize: 16, margin: 10, color: 'black' }}>{currentMessage.text}</Text>
                    </View>
                )
            }
        }
        else {
            console.log("========================User messages ================");

            if (currentMessage.url?.includes(pdfChar) || currentMessage.url?.includes(docxChar)) {

                console.log("Insidde if pdf");
                console.log("Insidde if pdf user");
                //   setLoading(false)
                return (
                    <View style={{ maxHeight: 80, marginVertical: 10, maxWidth: "30%", justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, backgroundColor: "white", borderRadius: 10 }}>
                        <TouchableOpacity onPress={() => Linking.openURL(currentMessage.url)}>
                            <Icons name='file-pdf' size={70} color="#435ebe" style={{ marginHorizontal: 5, alignSelf: 'flex-end' }} />
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{currentMessage.text}</Text>
                        </TouchableOpacity>
                    </View>
                )

            }
            else if (currentMessage.image?.includes(imgChar)) {
                // setLoading(false)
                //   console.log("Insidde ELse if Img");
                return (
                    <View style={{ height: 200, width: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: "#435ebe", borderRadius: 10 }}>
                        <TouchableOpacity onPress={() => onImagePress(currentMessage.image)} style={{ height: 190, width: 150, justifyContent: 'center', alignItems: 'center' }} >
                            <Image source={{ uri: currentMessage.image }} style={{ height: "90%", width: "90%" }} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                )
            }
            else {
                //  console.log("Insidde ELse Text");
                // setLoading(false)
                return (
                    <View style={{ maxWidth: "80%", justifyContent: 'center', alignItems: 'flex-end', backgroundColor: "#435ebe", borderRadius: 10 }}>
                        <Text style={{ fontSize: 16, margin: 10, color: 'white' }}>{currentMessage.text}</Text>
                    </View>
                )
            }

        }



        // return <Bubble {...props} />;
    };

    const onImagePress = (url) => {
        console.log("on iMAGE pRESS");
        console.log(url);

        setMoadlImg(url)
        setVisible(true)
    }

    const renderTime = props => {
        console.log("render time")
        return (
            <Time
                {...props}
                timeTextStyle={{
                    left: {
                        color: '#3c3c434d',
                        fontSize: 10,
                        fontFamily: 'Rubik',
                        textAlign: 'right', // or position: 'right'
                    },
                    right: { color: '#3c3c434d', fontSize: 10, fontFamily: 'Rubik' },
                }}
            />
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
            <Loader loading={loading}></Loader>
            <View style={{ marginTop: 40, width: "100%", backgroundColor: 'white', borderBottomWidth: 0.1, elevation: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: "50%", justifyContent: 'space-between', marginVertical: 10 }}>
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
            <GiftedChat
                renderBubble={renderBubble}
                messages={messages}
                onSend={messages => onSend(messages)}
                renderTime={renderTime}
                user={{
                    conversationId: Session.conversationId,
                    _id: Session.userObj.userId,
                    name: Session.userObj.userName,
                    avatar: Session.userObj.imgUrl,
                }}

                renderActions={renderActions}

            // scrollToBottomComponent={true}
            />

            <Modal isVisible={visible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ height: 400, width: 400 }} resizeMode="contain" source={{ uri: modalImg }} />
                    <Icon name='close' size={30} onPress={() => setVisible(false)} style={{ position: 'absolute', top: 20, right: 20 }} />
                </View>
            </Modal>
            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => confirmPress()}></Alerts>

        </View>

    )
}


const styleSheet = StyleSheet.create({
    roundBtnStyle: {
        width: 30,
        height: 30,
        backgroundColor: Colors.colorPrimary,
        borderRadius: 30,
        alignSelf: "flex-end",
        marginRight: 5,
        justifyContent: "center",
        alignContent: "center",
        shadowColor: "#3F47F442",
        elevation: 10,
    },
    roundImgStyle: {
        width: 30,
        height: 30,
        alignSelf: "center",
    },

    boxStyle: {
        margin: 10,
        width: 120,
        height: 120,
        elevation: 5,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        // shadowColor: '#3F47F41C'
    },
    boxStyleCustom: {
        margin: 10,
        width: 120,
        height: 120,
        elevation: 5,
        backgroundColor: "#3F47F4",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        // shadowColor: '#3F47F41C'
    },
    digitTextStyle: {
        color: Colors.textColorBlue,
        padding: 5,
        fontSize: 20,
        fontWeight: "bold",
    },
    descTextStyle: {
        textAlign: "center",
        color: Colors.colorWhite,
        fontSize: FontSize.fontSize15,
    },
    descTextStyleBlack: {
        textAlign: "center",
        color: "black",
        fontSize: FontSize.fontSize15,
    },

    listItmeStyle: {
        margin: 10,
        flexDirection: "column",
        backgroundColor: Colors.colorWhite,
        borderRadius: 5,
        elevation: 10,
        flex: 1,
    },

    filterBtnStyle: {
        margin: 10,
        height: 40,
        width: 100,
        borderRadius: 20,
        backgroundColor: Colors.colorWhite,
        elevation: 10,
        alignItems: "center",
    },
    filterBtnTextStyle: {
        flex: 1,
        textAlignVertical: "center",
        color: Colors.txtColorTouch,
    },

    subViewStyle: {
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 5,
        elevation: 10,
        justifyContent: "center",
        margin: 20,
    },

    viewStyleQuestions: {
        flex: 1,
        flexDirection: "column",
    },

    btnTextStyle: {
        marginLeft: 10,
        fontSize: FontSize.fontSizeDefault,
        justifyContent: "center",
        color: Colors.contentColor,
        alignSelf: "center",
        flex: 1,
    },
    btnTextStyle2: {
        fontSize: FontSize.fontSizeDefault,
        color: Colors.textColorsc4,
        flex: 1,
        marginLeft: 100,
        textAlign: "center",
        alignSelf: "center",
    },
    btnTouchableOpacityStyle3: {
        // width: screenWidth - 30,
        height: 80,
        elevation: 3,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: Colors.colorWhite,
    },
    imgStyle: {
        width: 15,
        height: 15,
        marginRight: 10,
        alignSelf: "center",
    },

    container: {
        flex: 1,
    },
    viewPager: {
        flex: 1,
    },
    dropDownStyle: {
        // width: screenWidth - 40,
        alignSelf: "center",
        elevation: 10,
    },
    containerTouchable: {
        height: 32,
        width: 32,
        alignItems: "center",
        marginRight: 5,
        borderRadius: 20,
        backgroundColor: "red",
    },
    sendBtnStyle: {
        borderRadius: 100,
        height: 30,
        width: 30,
        margin: 10,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: Colors.colorPrimary,
    },
});

export default Chat