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
const SERVER = "http://194.233.69.219:3000";
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import { incremented, addMsg } from '../redux/slices/chat/chatSlice'
import Session from '../utils/Session'
import DocumentPicker from "react-native-document-picker"
import RNFetchBlob from "react-native-fetch-blob";
import Constants from '../http/Constants'
import Http from '../http/Http'
import Modal from 'react-native-modal'
import AsyncMemory from '../utils/AsyncMemory'

//const socket = useRef(io(SERVER));



const Chat = ({ navigation }) => {

    let docObject = []

    // console.log("user object === >" + JSON.stringify(Session.userObj));
    // console.log("Doctor user object === >" + JSON.stringify(Session.docUserObj));
    console.log("==========================Chat Screen==============================");
    // console.log("session doc object" + JSON.stringify(Session.docObj));
    // console.log("session user object" + JSON.stringify(Session.userObj));

    const [messages, setMessages] = useState([]);
    const [exsists, setExsists] = useState(false)
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)
    const screenWidth = Math.round(Dimensions.get("window").width);
    const screenHight = Math.round(Dimensions.get("window").height);
    const [visible, setVisible] = useState(false)
    const [modalImg, setMoadlImg] = useState("")
    const [id, setId] = useState("")


    const socket = io(SERVER);
    let m = []
    const value = useAppSelector((State) => State.chat.value)
    const dispatch = useAppDispatch()
    // console.log("=======================REDUX CALLED===========================================");
    // console.log("data in redux  on load== >" + JSON.stringify(value));



    console.log("==================================================================");
    const useRedux = (message) => {
        console.log("Redux" + JSON.stringify(message));
        dispatch(addMsg(message))
        //getReduxChat()

    }

    const restoreMessage = () => {


        console.log("===========================================");
        console.log("Restoring messages");

        console.log("restore messages length == > " + value.length);
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


            }


            else if (msg?.type == "pdf") {
                console.log("Inside Else if === > Type == > pdf ");
                console.log("msg === >" + JSON.stringify(msg));
                setMessages(messages => [...messages,
                {
                    _id: uuid.v4(),
                    text: <TouchableOpacity onPress={() => Linking.openURL(msg.url)}><Text>{msg.text}</Text></TouchableOpacity>,
                    createdAt: new Date(),
                    url: msg?.url,
                    user: {
                        _id: msg?.user._id,
                        name: msg?.user.name,
                        avatar: msg?.user.avatar,
                    },
                }
                    ,
                ]);
            }

            else {
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

    const getDocObject = async () => {


        docObject = await AsyncMemory.retrieveItem('docObj')
        console.log("=====================================================================");
        console.log(" const Session doctor object array === >" + JSON.stringify(docObject.userId));
        setId(docObject.userId)
        console.log("=====================================================================");

    }
    // console.log(socket);

    useEffect(() => {

        if(loading){
            console.log("loader true")
            return;
        }else{
            console.log("loader false")
           // return;
        }
        getDocObject()
        // console.log("value  length == >" + value.length);

        // if (value.length != 0) {
        //     restoreMessage()
        // }
        console.log("Before useeffect socket.on");
        socket.on('connect', () => {
            console.log("I'm connected with the back-end");
        });
        socket.on('welcomeMessage', msg => {
            console.log("Inside useeffect socket.on");
            // console.log("welcomeMessage:" + msg);
            console.log("value  length  of redux store== >" + value.length);


            console.log("Doc Objec " + docObject.userId);

            if (value.length == 0) {
                console.log("Inside iffff");
                m = [
                    {
                        _id: uuid.v4(),
                        text: msg,
                        createdAt: new Date(),
                        user: {
                            _id: docObject.userId,
                            name: docObject.userName,
                            avatar: docObject.imgUrl,
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
                        _id:docObject.userId,
                        name: docObject.userName,
                        avatar: docObject.imgUrl,
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
        // console.log("Messages == >" + JSON.stringify(messages));
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
       // setLoading(true)

        // ImagePicker.launchImageLibrary(options, getImg);
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
        console.log("Image Uploaded");
        // console.log(" onUpload Image ===== > " + JSON.stringify(image.assets[0].uri));
        Session.cleanImgs()
        console.log(image.length);
        if (image.length == undefined) {
            // setLoading(true)
            console.log("iffffff")
            console.log("ImageUri === >" + JSON.stringify(image.assets[0].uri));
            await uploadImages(image.assets[0].uri)

        }
        else {
            // setLoading(true)

            // var imageObj = [];

            // for (let i = 0; i < image.length; i++) {

            //     await uploadImages(image.assets[0].uri)

            // }
        }
        // setLoading(false)
    }
    const uploadImages = async (imageObj) => {
        setLoading(true)

        console.log("================================== imgs object===================================");
        // console.log("Image Obj === >" + JSON.stringify(imageObj));
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
        console.log("===========================Upload Task=================================");
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
                type: "application/pdf",
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
                setLoading(false)
                console.log(json);
                // console.log("==================================Image Url =====================================");
                // console.log(json.data.imageUrl);

                if (json.success == true) {

                    onSend(

                        m = [
                            {
                                _id: uuid.v4(),
                                text: json.data.imageName,
                                url: json.data.imageUrl,
                                createdAt: new Date(),
                                type: "pdf",
                                user: {
                                    _id: Session.userObj.userId,
                                    name: Session.userObj.userName,
                                    avatar: Session.userObj.imgUrl,
                                }
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
                copyTo: "cachesDirectory",

            });

            // uploadTask(res.name,  res.uri, "Document");
            console.log("res : " + JSON.stringify(res));

            console.log("res ui == >" + res[0].uri);
            if (Platform.OS == "ios") {
                uploadTask(res.name, res.fileCopyUri, "Document");
            } else {
                console.log("In Else == > Android Platform");
                let m = res[0]
                console.log("M == >" + JSON.stringify(m));
                // RNFetchBlob
                //     .fs
                //     .stat(m.uri)
                //     .then((stats) => {
                //         console.log("Stats path === >" + stats.path);
                //         uploadTask(m.name, "file://" + m.uri, "Document");
                //     })
                //     .catch((err) => {
                //         console.log("Error ==== > " + err);
                //     })

                uploadTask(res[0].name, res[0].fileCopyUri, "Document");

                return

                RNFetchBlob.fs
                    .stat(res[0].uri)
                    .then((stats) => {
                        console.log(stats.path);

                        uploadTask(res[0].name, "file://" + stats.path, "Document");
                    })
                    .catch((err) => {
                        console.log(err);
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

    const renderBubble = (props) => {

       // setLoading(true)
      //  console.log("Custom  Bubble  View");

        const { currentMessage } = props;
       console.log("current Msg == >" + JSON.stringify(currentMessage));
        // console.log("Props == >" + JSON.stringify(props));
        // return

       // console.log("set Id ===> === >" + id);

        let imgChar = "jpg"
        let pdfChar = "pdf"

        console.log("id === >" +currentMessage.user._id );
        if (currentMessage.user._id == id) {

            if (currentMessage.url?.includes(pdfChar)) {

                //setLoading(false)
               // console.log("Insidde if pdf");
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

            if (currentMessage.url?.includes(pdfChar)) {

             //   console.log("Insidde if pdf");
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

    // const renderMessageText = (props) => {

    //     console.log("Custom  Message");

    //     const { currentMessage } = props;
    //     console.log("current Msg == >" + JSON.stringify(currentMessage));
    //     // console.log("Props == >" + JSON.stringify(props));
    //     // return
    //     if (currentMessage.type == "pdf") {


    //         return (
    //             <View style={{ height: 40, width: "90%", justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.COLOR_THEME, borderRadius: 10 }}>
    //                 <TouchableOpacity onPress={() => Linking.openURL(currentMessage.url)}>
    //                     <Text style={{ fontSize: 16, margin: 10 }}>{currentMessage.url}</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         )

    //     }
    //     else if (currentMessage.type == "img") {
    //         return (
    //             <View style={{ height: 200, width: 150 , backgroundColor : 'red' }}>
    //                 <TouchableOpacity  onPress={() => onImagePress(currentMessage.url)} style = {{ height : 150 , width : 150 , justifyContent: 'center' , alignItems : 'center' }} >
    //                     <Image source={{ uri: currentMessage.url }} style={{ height : "90%" , width : "90%" }} resizeMode="contain"  />
    //                 </TouchableOpacity>
    //             </View>
    //         )
    //     }
    //     else {
    //         console.log("Insidde ELse");
    //         return (
    //             <View style={{ maxWidth: "90%", justifyContent: 'center', alignItems: 'flex-end', backgroundColor: Colors.COLOR_THEME, borderRadius: 10 }}>
    //                 <Text style={{ fontSize: 16, margin: 10 }}>{currentMessage.text}</Text>
    //             </View>
    //         )
    //     }

    //     // return <Bubble {...props} />;
    // };

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
            <View style={{ height: 60, width: "100%", backgroundColor: 'white', borderBottomWidth: 0.1, elevation: 10, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: "50%", justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Icons name='bars' size={25} color="black" style={{ marginLeft: 20 }} />
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
            <GiftedChat
                renderBubble={renderBubble}
                messages={messages}
                onSend={messages => onSend(messages)}
                renderTime={renderTime}
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

            <Modal isVisible={visible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ height: 400, width: 400 }} resizeMode="contain" source={{ uri: modalImg }} />
                    <Icon name='close' size={30} onPress={() => setVisible(false)} style={{ position: 'absolute', top: 20, right: 20 }} />
                </View>
            </Modal>


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