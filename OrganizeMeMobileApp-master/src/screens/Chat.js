import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/FontAwesome5'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import * as ImagePicker from "react-native-image-picker";
import ImgToBase64 from "react-native-image-base64";
import TextStyle from '../theme/TextStyle'
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
const SERVER = "http://194.233.69.219:3000";
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import { incremented, addMsg } from '../redux/slices/chat/chatSlice'
import Session from '../utils/Session'
import DocumentPicker from "react-native-document-picker"
import RNFetchBlob from "react-native-fetch-blob";
import Constants from '../http/Constants'
import Http from '../http/Http'
//const socket = useRef(io(SERVER));



const Chat = () => {

    // console.log("user object === >" + JSON.stringify(Session.userObj));
    // console.log("Doctor user object === >" + JSON.stringify(Session.docUserObj));
    console.log("==========================Chat Screen==============================");

    const [messages, setMessages] = useState([]);
    const [exsists, setExsists] = useState(false)
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)
    const screenWidth = Math.round(Dimensions.get("window").width);
    const screenHight = Math.round(Dimensions.get("window").height);

    const socket = io(SERVER);
    let m = []
    const value = useAppSelector((State) => State.chat.value)
    const dispatch = useAppDispatch()
    // console.log("=======================REDUX CALLED===========================================");
    // console.log("data in redux  on load== >" + JSON.stringify(value));



    console.log("==================================================================");
    const useRedux = (message) => {

        dispatch(addMsg(message))
        //getReduxChat()

    }

    const restoreMessage = () => {


        console.log("===========================================");
        console.log("Restoring messages");

        // console.log("restore messages length == > " + value.length);
        console.log("===========================================");

        for (let x = value?.length - 1; x >= 0; x--) {

            let obj = value[x];
            // console.log("obj ===>" + JSON.stringify(obj));
            let msg = obj[0];
            // console.log("Msg === >" + JSON.stringify(msg));
            if (msg?.type == "img") {
                console.log("Inside If === > type == > img");
                setMessages(messages => [...messages,
                {
                    _id: uuid.v4(),
                    text: '',
                    image: msg?.url,
                    createdAt: new Date(),
                    user: {
                        _id: msg?.user._id,
                        name: msg?.user.name,
                        avatar: msg?.user.avatar,
                    },
                }
                    ,
                ]);


            } else {
                console.log("Inside Else === > Type == > text ");
                setMessages(messages => [...messages,
                {
                    _id: uuid.v4(),
                    text: msg?.text,
                    createdAt: new Date(),
                    user: {
                        _id: msg?.user._id,
                        name: msg?.user.name,
                        avatar: msg?.user.avatar,
                    },
                }
                    ,
                ]);
            }
        }
        //console.log("=================================================");
        // console.log("Message State ==== >" + JSON.stringify(messages));
        //  console.log("=================================================");
    }

    const getReduxChat = () => {
        // console.log("Chats === >" + JSON.stringify(value));
    }
    // console.log(socket);
    useEffect(() => {
        // console.log("value  length == >" + value.length);
        console.log("Before useeffect socket.on");
        socket.on('connect', () => {
            console.log("I'm connected with the back-end");
        });
        socket.on('welcomeMessage', msg => {
            console.log("Inside useeffect socket.on");
            // console.log("welcomeMessage:" + msg);
            console.log("value  length  of redux store== >" + value.length);


            if (value.length == 0) {
                console.log("Inside iffff");
                m = [
                    {
                        _id: uuid.v4(),
                        text: msg,
                        createdAt: new Date(),
                        user: {
                            _id: 2,
                            name: "Dr. David Adams",
                            avatar: "http://194.233.69.219/general/doctor.jpg",
                        },
                        // image:'http://194.233.69.219/general/doctor.jpg'
                    },
                ];
                setMessages(m)
                useRedux(m)

            }
            else {
                console.log("Inside Else restoring msg");
                restoreMessage()
            }

            console.log("Outside if else");

        });
        socket.on('chatmessage', msg => {
            console.log("chatmessage:" + msg);
        });
        socket.on('clientMessage', msg => {
            console.log("Recieving message");

            onReceive([
                {
                    _id: uuid.v4(),
                    text: msg,

                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'http://194.233.69.219/general/doctor.jpg',
                    },
                },
            ])
            // useRedux([
            //     {
            //         _id: uuid.v4(),
            //         text: msg,
            //         createdAt: new Date(),
            //         user: {
            //             _id: 2,
            //             name: 'React Native',
            //             avatar: 'http://194.233.69.219/general/doctor.jpg',
            //         },
            //     },
            // ])
        });
        socket.on('message', msg => {
            // console.log("message:" + msg);
        });

        // console.log("Messages == >" + JSON.stringify(messages));

    }, [])

    const onReceive = useCallback((messages = []) => {
        //  socket.emit('doctorMessage', messages);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        useRedux(messages)

    })
    const onSend = useCallback((messages = []) => {
        console.log("Messages == >" + JSON.stringify(messages));
        socket.emit('doctorMessage', messages);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        // console.log("send msg = >" + JSON.stringify(messages));
        useRedux(messages)
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
        // const options = {
        //     noData: true,
        //     title: "Pick an image",
        //     cancelButtonTitle: "Cancel",
        //     takePhotoButtonTitle: "Use camera",
        //     chooseFromLibraryButtonTitle: "Choose from library",
        //     allowsEditing: true,
        //     quality: 0.25,
        //     includeBase64: true,
        // };

        // ImagePicker.launchImageLibrary(options, getImg);
        ImagePicker.launchImageLibrary({
            mediaType: 'any',
            multiple: true,
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            onImageUpload(image);
        })
    };

    const onImageUpload = async (image) => {

        console.log("Image Uploaded");
        console.log(" onUpload Image ===== > " + JSON.stringify(image.assets[0].uri));
        Session.cleanImgs()
        console.log(image.length);
        if (image.length == undefined) {
            setLoading(true)
            console.log("iffffff")
            console.log("ImageUri === >" + JSON.stringify(image.assets[0].uri));
            await uploadImages(image.assets[0].uri)

        }
        else {
            setLoading(true)

            var imageObj = [];

            for (let i = 0; i < image.length; i++) {

                await uploadImages(image.assets[0].uri)

            }
        }
        setLoading(false)
    }
    const uploadImages = async (imageObj) => {

        console.log("================================== imgs object===================================");
        console.log("Image Obj === >" + JSON.stringify(imageObj));
        var formdata = new FormData();
        formdata.append("file", {
            name: imageObj,
            type: "image/jpeg",
            uri: imageObj
        }
            // .split("/").pop()
        )
        console.log("Form Data == >" + JSON.stringify(formdata));
        await Http.PostImage(Constants.END_POINT_POST_IMAGE, formdata).then(response => response.json())
            .then((json) => {
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
            .catch(error => { console.log('request failed', error); });
    }


    const uploadTask = async (fileName, data, type) => {

        console.log("fileName = " + fileName + " , data= base64 , type = " + type + "data === >" + data);
        // setProgressUpload(0);
        // setProgressShow(true);

        const bodyFormData = new FormData();
        if (type == "image") {
            bodyFormData.append("filename", "file.jpeg");
            bodyFormData.append("data", data);
        } else {
            bodyFormData.append("file", {
                name: fileName,
                type: "image/jpeg",
                uri: data,
            });

        }
        // const config = {
        //     headers: {
        //         // Accept: "application/json",
        //         "Content-Type": "multipart/form-data",
        //         Authorization: "Bearer " + props.apiToken,
        //     },
        //     onUploadProgress: function (progressEvent) {
        //         var percentCompleted = Math.round(
        //             (progressEvent.loaded * 100) / progressEvent.total
        //         );
        //         setProgressUpload(percentCompleted / 100);
        //         console.log("Upload Progress" + percentCompleted);
        //     },
        //     onDownloadProgress: function (progressEvent) {
        //         var percentCompleted = Math.round(
        //             (progressEvent.loaded * 100) / progressEvent.total
        //         );
        //         console.log("Download Progress " + percentCompleted);
        //     },
        // };

        console.log(" Form Data Document ==== >" + JSON.stringify(bodyFormData));
    

        await Http.PostImage(Constants.END_POINT_POST_IMAGE, bodyFormData).then(response => response.json())
            .then((json) => {
                console.log(json);
                // console.log("==================================Image Url =====================================");
                // console.log(json.data.imageUrl);

                return
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
            .catch(error => { console.log('request failed', error); });

        // console.log("FormData " + JSON.stringify(bodyFormData));

        // axios
        //   .post(
        //     HttpConstants.BASE_URL_MYDOC_API + HttpConstants.UPLOAD_MEDIA,
        //     bodyFormData,
        //     config
        //   )
        //   .then((response) => {
        //     setProgressShow(false);

        //     // var dataObj = response.data;
        //     // var dataObj = JSON.parse(response.data);
        //     console.log("-----------------------------------------------");
        //     console.log(response.data);

        //     console.log(response.data.data.filename);
        //     console.log("-----------------------------------------------");

        //     if (type == "image") {
        //       // setDataUri(response.uri)
        //       // sendImageMsg("https://homepages.cae.wisc.edu/~ece533/images/airplane.png");
        //       sendImageMsg(response.data.data.filename);
        //     } else if (type == "video") {
        //       onSend([
        //         {
        //           _id: uuid.v4(),
        //           text:
        //             response.data.data.image_url?.replace(
        //               "api.my-doc.com",
        //               "static.my-doc.com"
        //             ) +
        //             "?type=referral-letter&access_token=" +
        //             props.apiToken,
        //           createdAt: new Date(),
        //           user: {
        //             _id: 1,
        //             name: chatDetails.DoctorName,
        //             avatar: chatDetails.DoctorImg,
        //           },
        //           // image: response.data.data.image_url,
        //         },
        //       ]);

        //       sendImageMsg(response.data.data.filename);
        //     } else {
        //       onSend([
        //         {
        //           _id: uuid.v4(),
        //           text:
        //             response.data.data.image_url.replace(
        //               "api.my-doc.com",
        //               "static.my-doc.com"
        //             ) +
        //             "?type=referral-letter&access_token=" +
        //             props.apiToken,
        //           createdAt: new Date(),
        //           user: {
        //             _id: 1,
        //             name: chatDetails.DoctorName,
        //             avatar: chatDetails.DoctorImg,
        //           },
        //           // video: response.data.data.image_url,
        //         },
        //       ]);
        //       sendDocumentMsg(response.data.data.filename);
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     setProgressShow(false);
        //     // sendImageMsg("")
        //   });
    };


    // const getImg = (response) => {
    //     console.log("Response======>" + JSON.stringify(response));

    //     if (response.didCancel != true) {
    //         ImgToBase64.getBase64String(response.uri).then((base64String) => {
    //             uploadTask(response.fileName, base64String, "image");
    //         });
    //         onSend([
    //             {
    //                 _id: uuid.v4(),
    //                 // text: response.uri,
    //                 createdAt: new Date(),
    //                 user: {
    //                     _id: 1,
    //                     name: Session.userObj.userName,
    //                     avatar: Session.userObj.imgUrl,
    //                 },
    //                 image: response.uri,
    //             },
    //         ]);
    //     }
    // };

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
            });

            // uploadTask(res.name,  res.uri, "Document");
            console.log("res : " + JSON.stringify(res));

            console.log("res ui == >" + res[0].uri);
            if (Platform.OS == "ios") {
                uploadTask(res.name, res.uri, "Document");
            } else {
                console.log("In Else == > Android Platform");
                let m = res[0]
                console.log("M == >" + JSON.stringify(m));
                RNFetchBlob.fs
                    .stat(m.uri)
                    .then(() => {

                        uploadTask(m.name, "file://" + m.uri, "Document");
                    })
                    .catch((err) => {
                        console.log("Error ==== > " + err);
                    });
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    };



    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: Session.userObj.userId,
                name: Session.userObj.userName,
                avatar: Session.userObj.imgUrl,
            }}

            // renderSend={(props) => {
            //     const { text, messageIdGenerator, user, onSend } = props;
            //     return (
            //         <TouchableOpacity
            //             // onPressIn={onPressIn}
            //             // onPressOut={onPressOut}
            //             // onLongPress={onPressIn}
            //             onPress={() => {
            //                 if (text && onSend) {
            //                     // onSend(
            //                     //     {
            //                     //         text: text.trim(),
            //                     //         user: user,
            //                     //         _id: messageIdGenerator(),
            //                     //     },
            //                     //     true
            //                     // );
            //                     onSend(text);
            //                 }
            //             }}
            //             style={styleSheet.sendBtnStyle}
            //         >
            //             <Send />
            //             <Icons
            //                 color={"black"}
            //                 style={{ alignSelf: "center" }}
            //                 size={20}
            //                 name={"paper-plane" /*isTyping == true ? "send" : "mic"*/}
            //             ></Icons>
            //         </TouchableOpacity>
            //     );
            // }}
            renderActions={renderActions}
        // scrollToBottomComponent={true}
        />

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