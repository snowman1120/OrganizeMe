import React, { useState, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/MaterialIcons'
import Colors from "../theme/Colors";
import Session from "../utils/Session";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Alerts from '../utils/Alerts'
import TextStyle from "../theme/TextStyle";
import {
    TextField,
    FilledTextField,
    OutlinedTextField,
} from 'react-native-material-textfield';
import AppImages from "../theme/AppImages";
import Http from '../http/Http'
import Constants from "../http/Constants";
const Screenheight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width
import Loader from '../utils/loader'
import Modal from 'react-native-modal'
import AsyncMemory from "../utils/AsyncMemory";


const Profile = ({ navigation }) => {




    const nameRef = useRef()
    const emailRef = useRef()
    const phoneRef = useRef()
    const passRef = useRef()

    const [buttonTxt, setButtonTxt] = useState("Ok")
    const [openAlert, setOpenAlert] = useState(false)
    const [msg, setMsg] = useState("")
    const [id, setId] = useState(Session.userObj.userId)
    const [name, setName] = useState(Session.userObj.userName)
    const [phone, setPhone] = useState(Session.userObj.phone)
    const [email, setEmail] = useState(Session.userObj.email)
    const [pass, setPass] = useState(Session.userObj.password)
    const [country, setCountry] = useState(Session.userObj.country)
    const [image, setImage] = useState(Session.userObj.imgUrl)
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false)
    const [images, setImages] = useState([])



    console.log(Session.userObj);

    const onSubmit = async () => {

        if (name == "" || email == "" || phone == "" || pass == "" || image == "") {
            // alert("please insert data in all field")
            setOpenAlert(true)

        }
        else {

            console.log(image);

            Session.updateProfile.userId = id
            Session.updateProfile.userName = name
            Session.updateProfile.email = email
            Session.updateProfile.phone = phone
            Session.updateProfile.password = pass
            Session.updateProfile.country = Session.userObj.country
            Session.updateProfile.imageUrl = image


            console.log("Update Profile Object" + JSON.stringify(Session.updateProfile));
            setLoading(true)
            await Http.post(Constants.END_POINT_UPDATE_PROFILE, Session.updateProfile).then((response) => {
                setLoading(false)
                // console.log("post request ==================");
                console.log(response.data);
                if (response.data.success) {
                    console.log("json === >" + JSON.stringify(response.data.data.user[0]));
                    Session.userObj = response.data.data.user[0]
                    AsyncMemory.storeItem("userObj", Session.userObj)
                    alert("Update Succesfull")
                }
                else {
                    alert("Update Failed")
                }


            }, (error) => {
                console.log(error);
                setMsg(error)
                setOpenAlert(true)
                // Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
            })

        }

    };

    // const onImgUpload = (text) => {
    //     // return text.replace(/[^+\d]/g, '');
    //     ImagePicker.launchImageLibrary({
    //         mediaType: 'any',
    //         width: 300,
    //         height: 400,
    //         cropping: true
    //     }).then(image => {
    //         onImageUpload(image);
    //     })
    // };

    const onImageUpload = async (image) => {
        setVisible(false)
        // setLoading(true)
        // console.log("Image Uploaded");
        // console.log(" onUpload Image ===== > " + JSON.stringify(image.assets[0].uri));
        // Session.cleanImgs()
        console.log(image.length);
        if (image.length == undefined) {

            console.log("iffffff")
            console.log("ImageUri === >" + JSON.stringify(image.assets[0].uri));
            await uploadImages(image.assets[0].uri)
        }


    }

    const checkImg = () => {
        console.log("Image set -===== >" + Session.imgs);
        console.log("Image sTATE -===== >" + images);
    }
    const uploadImages = async (imageObj) => {
        setLoading(true)
        console.log("================================== imgs object===================================");
        console.log("Image Obj === >" + JSON.stringify(imageObj));
        var formdata = new FormData();
        formdata.append("file", {
            name: imageObj,
            type: "image/jpg",
            uri: imageObj
        }
            // .split("/").pop()
        )
        console.log("Form Data == >" + JSON.stringify(formdata));

        await Http.PostImage(Constants.END_POINT_POST_IMAGE, formdata).then(response => response.json())
            .then((json) => {
                console.log(json);
                setLoading(false)
                if (json.success == true) {
                    console.log("==================================Image Url =====================================");
                    console.log("Dp Uploadedd" + json.data.imageUrl);
                    setOpenAlert(true)
                    setMsg(json.message)
                    Session.userObj.imgUrl = json.data.imageUrl
                    setImage(json.data.imageUrl)
                    AsyncMemory.storeItem("userObj", Session.userObj)
                    // onSubmit()
                }
            })
            .catch(error => {
                console.log('request failed', error);
                return
            });


    }

    
    return (
        <View style={{ height: "100%" }}>
            <Loader loading={loading}></Loader>
            <View style={{ height: 200, width: "100%", backgroundColor: Colors.COLOR_THEME, borderBottomLeftRadius: 100, borderBottomRightRadius: 100, position: "absolute" }}>
                <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 10 }}>
                    <TouchableOpacity style={{ flexDirection: "row", marginTop: 20 }} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={20} color="white" />
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: 'white', marginLeft: 20 }}>User Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: "80%", backgroundColor: 'white', elevation: 10, position: "absolute", top: 70, alignSelf: "center", borderRadius: 30 }}>
                <View style={{ height: "30%", borderRadius: 30, justifyContent: "flex-end", alignItems: "center" }}>

                    <TouchableOpacity onPress={() => setVisible(true)} style={{ height: 80, width: 80, backgroundColor: 'white', borderRadius: 50, elevation: 10 }}>
                        <Image source={{ uri: Session.userObj.imgUrl == "" ? "http://194.233.69.219/documents/0730232429.png" : Session.userObj.imgUrl }} style={{ height: "100%", width: "100%", borderRadius: 40 }} />
                        {/* <TouchableOpacity onPress={() => setVisible(true)} style={{ position: "absolute", bottom: -20, alignSelf: "center" }} >
                            <Icon name="camera" size={20} />
                        </TouchableOpacity> */}
                    </TouchableOpacity>
                    <View style={{ borderBottomWidth: 1, width: "90%" }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: 'black', textAlign: "center" }}>{Session.userObj.userName}</Text>
                        <Text style={{ fontSize: 12, color: 'black', marginBottom: 10, textAlign: "center" }}>{Session.userObj.email}</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ borderRadius: 30, height: "60%", backgroundColor: 'white', marginTop: 10 }}>
                    <View style={{ height: 50, marginTop: 10, width: "100%", justifyContent: "space-around" }}>
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black' }}>Name</Text> */}
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black', fontWeight: "bold" }}>123</Text> */}
                        <TextField
                            ref={nameRef}
                            onSubmitEditing={() => { emailRef.current.focus() }}
                            containerStyle={{ marginLeft: 10 }}
                            value={name}
                            label="Name"
                            labelTextStyle={{ color: 'black' }}
                            textColor="black"
                            baseColor="black"
                            disabledLineWidth={1}
                            lineType="solid"
                            keyboardType='email-address'
                            onChangeText={(text) => setName(text)}
                        />
                    </View>

                    <View style={{ height: 50, marginTop: 20, width: "100%", justifyContent: "space-around" }}>
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black' }}>Email</Text> */}
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black', fontWeight: "bold" }}>123</Text> */}
                        <TextField
                            ref={emailRef}
                            onChangeText={(text) => setEmail(text)}
                            // prefix={Session.userObj.email}
                            containerStyle={{ marginLeft: 10 }}
                            value={email}
                            onSubmitEditing={() => { phoneRef.current.focus() }}
                            // style={{ width: "100%" }}
                            label="Email"
                            labelTextStyle={{ color: 'black' }}
                            // affixTextStyle={{ marginLeft: 10 }}
                            textColor="black"
                            baseColor="black"
                            disabledLineWidth={1}
                            keyboardType='email-address'
                        />
                    </View>
                    <View style={{ height: 50, marginTop: 20, width: "100%", justifyContent: "space-around" }}>
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black' }}>Phone</Text> */}
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black', fontWeight: "bold" }}>123</Text> */}
                        <TextField
                            onChangeText={(text) => setPhone(text)}
                            ref={phoneRef}
                            containerStyle={{ marginLeft: 10 }}
                            value={phone}
                            onSubmitEditing={() => { passRef.current.focus() }}
                            // style={{ width: "100%" }}
                            label="Phone"
                            labelTextStyle={{ color: 'black' }}
                            // affixTextStyle={{ marginLeft: 10 }}
                            textColor="black"
                            baseColor="black"
                            disabledLineWidth={1}
                            keyboardType='number-pad'
                        />
                    </View>
                    <View style={{ height: 50, marginTop: 20, width: "100%", justifyContent: "space-around" }}>
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black' }}>Password</Text> */}
                        {/* <Text style={{ marginTop: 10, marginLeft: 10, color: 'black', fontWeight: "bold" }}>123</Text> */}
                        <TextField
                            ref={passRef}
                            onChangeText={(text) => setPass(text)}
                            containerStyle={{ marginLeft: 10 }}
                            value={pass}
                            // style={{ width: "100%" }}
                            label="password"
                            labelTextStyle={{ color: 'black' }}
                            // affixTextStyle={{ marginLeft: 10 }}
                            textColor="black"
                            baseColor="black"
                            keyboardType='email-address'
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => onSubmit()}
                        style={{
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 150,
                            backgroundColor: Colors.COLOR_THEME,
                            borderRadius: 25,
                            alignSelf: 'center',
                            marginTop: 20,
                            marginBottom: 40
                        }}>
                        <Text style={{ color: "white", fontWeight: 'bold' }}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <Modal isVisible={visible} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: "100%", backgroundColor: 'white', height: 150, justifyContent: "center", alignItems: "center", borderRadius: 20, elevation: 10 }}>
                        <TouchableOpacity style={{ height: 40, width: 40, position: 'absolute', right: 10, top: 10 }} onPress={() => setVisible(false)}>
                            <Icons name='close' size={20} color="black" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly", elevation: 10 }}>
                            <TouchableOpacity
                                onPress={() =>
                                    launchImageLibrary({
                                        mediaType: 'any',
                                        multiple: true,
                                        width: 300,
                                        height: 400,
                                        cropping: true
                                    }).then(image => {
                                        onImageUpload(image);
                                    })
                                }
                                style={{
                                    marginTop: 10,
                                    alignSelf: "center",
                                    backgroundColor: 'white',
                                    height: 60,
                                    borderBottomLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    paddingVertical: 10,
                                    width: 150,
                                    elevation: 10
                                }}>
                                <View>
                                    <Icon name="file-image" size={20} style={{ alignSelf: "center" }} color="black" />
                                    <Text style={{ textAlign: "center" }}>Open Gallery</Text>
                                </View>

                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() =>
                                    launchCamera({
                                        width: 300,
                                        height: 400,
                                        cropping: false,
                                    }).then(image => {
                                        // console.log("camera lauch" + JSON.stringify(image));
                                        onImageUpload(image)
                                    })}
                                style={{
                                    marginTop: 10,
                                    alignSelf: "center",
                                    backgroundColor: 'white',
                                    height: 60,
                                    borderBottomLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    paddingVertical: 10,
                                    width: 150,
                                    elevation: 10
                                }}>
                                <View>
                                    <Icon name="camera" size={20} style={{ alignSelf: "center" }} color="black" />
                                    <Text style={{ textAlign: "center" }}>Open Camera</Text>
                                </View>

                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            </Modal>

            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => setOpenAlert(false)}></Alerts>
        </View >

    )

}
export default Profile