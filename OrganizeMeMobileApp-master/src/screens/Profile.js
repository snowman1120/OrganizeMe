import React, { useState, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from "../theme/Colors";
import Session from "../utils/Session";
import * as ImagePicker from "react-native-image-picker";
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


const Profile = ({ navigation }) => {




    const nameRef = useRef()
    const emailRef = useRef()
    const phoneRef = useRef()
    const passRef = useRef()

    const [id, setId] = useState(Session.userObj.userId)
    const [name, setName] = useState(Session.userObj.userName)
    const [phone, setPhone] = useState(Session.userObj.phone)
    const [email, setEmail] = useState(Session.userObj.email)
    const [pass, setPass] = useState(Session.userObj.password)
    const [country, setCountry] = useState(Session.userObj.country)
    const [image, setImage] = useState(Session.userObj.imgUrl)
    const [loading, setLoading] = useState(false);

    const [images, setImages] = useState([])



    console.log(Session.userObj);

    const onSubmit = async () => {

        if (name == "" || email == "" || phone == "" || pass == "" || image == "") {
            alert("please insert data in all field")
        }
        else {


            Session.updateProfile.userId = id
            Session.updateProfile.userName = name
            Session.updateProfile.email = email
            Session.updateProfile.phone = phone
            Session.updateProfile.password = pass
            Session.updateProfile.country = Session.userObj.country
            Session.updateProfile.imageUrl = Image


            console.log("Update Profile Object" + JSON.stringify(Session.updateProfile));
            setLoading(true)
            await Http.post(Constants.END_POINT_UPDATE_PROFILE, Session.updateProfile).then((response) => {
                setLoading(false)
                // console.log("post request ==================");
                console.log(response.data);
                if (response.data.success) {
                    console.log("json === >" + JSON.stringify(response.data.data.user[0]));
                    Session.userObj = response.data.data.user[0]
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

    const onImgUpload = (text) => {
        // return text.replace(/[^+\d]/g, '');
        ImagePicker.launchImageLibrary({
            mediaType: 'any',
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            onImageUpload(image);
        })
    };

    const onImageUpload = async (image) => {
        setLoading(true)
        // console.log("Image Uploaded");
        console.log(" onUpload Image ===== > " + JSON.stringify(image.assets[0].uri));
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
                    setImage(json.data.imageUrl)
                    Session.userObj.imgUrl = json.data.imageUrl

                }
            })
            .catch(error => {
                console.log('request failed', error);
                return
            });


    }

    // const [loading, setLoading] = useState(false)

    return (
        <View style={{ height: "100%" }}>
            <Loader loading={loading}></Loader>
            <View style={{ height: 200, width: "100%", backgroundColor: Colors.COLOR_THEME, borderBottomLeftRadius: 100, borderBottomRightRadius: 100, position: "absolute" }}>
                <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 10 }}>
                    <TouchableOpacity onPress={() => navigation.replace('Setting')}>
                        <Icon name="arrow-left" size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: 'black', marginLeft: 20 }}>User Profile</Text>
                </View>
            </View>
            <View style={{ height: 600, width: "80%", backgroundColor: 'white', elevation: 10, position: "absolute", top: 130, alignSelf: "center", borderRadius: 30 }}>
                <View style={{ height: "20%", borderRadius: 30, justifyContent: "flex-end", alignItems: "center" }}>
                    <View style={{ height: 80, width: 80, backgroundColor: 'white', borderRadius: 50, position: "absolute", alignSelf: "center", top: -30, elevation: 10 }}>
                        <Image source={{ uri: Session.userObj.imgUrl }} resizeMode='contain' style={{ height: 80, width: 80, borderRadius: 50 }} />
                        <TouchableOpacity onPress={() => onImgUpload()} style={{ position: "absolute", bottom: -15, alignSelf: "center" }} >
                            <Icon name="camera" size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomWidth: 1, width: "90%" }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: 'black', textAlign: "center" }}>{Session.userObj.userName}</Text>
                        <Text style={{ fontSize: 12, color: 'black', marginBottom: 10, textAlign: "center" }}>{Session.userObj.email}</Text>
                    </View>
                </View>
                <View style={{ borderRadius: 30, height: "60%", backgroundColor: 'white', marginTop: 10 }}>
                    <View style={{ height: 50, marginTop: 20, width: "100%", justifyContent: "space-around" }}>
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
                            marginTop: 20
                        }}>
                        <Text style={{ color: Colors.COLOR_BLACK, fontWeight: 'bold' }}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View >

    )

}
export default Profile