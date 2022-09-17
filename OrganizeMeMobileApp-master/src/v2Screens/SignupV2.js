import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from '../theme/Colors'
import CountryPicker, { Option } from 'react-native-country-picker-modal'
import { CountryCode, Country } from '../types'
import Constants from '../http/Constants'
import Http from '../http/Http'
import Session from '../utils/Session'
import utils from '../utils/Utils'
import Alerts from '../utils/Alerts'
import Loader from '../utils/loader'
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler'
import RenderHtml from 'react-native-render-html';
import Modal from 'react-native-modal'
import CheckBox from 'react-native-check-box'

const SignupV2 = ({ navigation }) => {

    const [countryCode, setCountryCode] = useState('FR')
    const [country, setCountry] = useState(null)
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withModal, setWithModal] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(false)
    const [withCallingCode, setWithCallingCode] = useState(false)
    const [withCountryNameButton, setWithCountryNameButton] = useState(false)
    const [cText, setCText] = useState('');
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [openAlert, setOpenAlert] = useState(false)
    const [msg, setMsg] = useState("")
    const [buttonTxt, setButtonTxt] = useState("Ok")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false);
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();
    const [items, setItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ]);
    const [checked, setChecked] = useState(false)
    const [showConfirm, setShowConfirm] = useState("none")
    const width = Dimensions.get('window').width / 2
    const [showCheckbox, setShowCheckbox] = useState("flex")
    const [showSignup, setShowSignup] = useState("none")
    const [showPrivacyText, setShowPrivacyText] = useState("flex")
    const emailRef = useRef()
    const phoneRef = useRef()
    const passRef = useRef()
    const rePassRef = useRef()
    const scrollViewRef = useRef()

    useEffect(() => {
        setCText('')
        Session.cleanSignUpObj
    }, [setCText]);

    const onSelect = (country) => {
        setCText(country.name)
        console.log(country.cca2);
        console.log(country.callingCode);
        console.log(country.name);
        setCountryCode(country.cca2)
        setCountry(country)

    }

    const onCheckBoxClick = () => {
        setChecked(true)

    }

    const showPrivacyModal = () => {
        setVisible(true)
    }

    const onSignUpClick = async () => {
        if (checked) {


            if (userName == "" || phone == "" || email == "" || countryCode == "" || country.name == "" || value == "") {
                setLoading(false)
                setMsg("Enter correct details")
                setOpenAlert(true)
                return
            }
            else {
                Session.signUpObj.userName = userName;
                Session.signUpObj.phone = phone;
                Session.signUpObj.email = email;
                Session.signUpObj.countryCode = countryCode;
                Session.signUpObj.countryName = country.name;
                Session.signUpObj.countryPhoneCode = country.callingCode[0];
                Session.signUpObj.gender = value


                if (password == rePassword) {
                    Session.signUpObj.password = password
                }
                else {
                    setLoading(false)
                    setOpenAlert(true)
                    setMsg("Enter same passwords")
                    return
                }
                console.log(JSON.stringify(Session.signUpObj));

                await Http.post(Constants.END_POINT_SIGNUP, Session.signUpObj).then((response) => {
                    setLoading(false)
                    console.log("post request ==================");
                    console.log(response.data);
                    if (response.data.success) {
                        setSuccess(true)
                        setButtonTxt("Ok")
                        setMsg(response.data.message)
                        console.log("response.data.data.msg" + JSON.stringify(response.data.message));
                        setOpenAlert(true)
                    }
                    else {
                        setSuccess(false)
                        setButtonTxt("Cancel")
                        setMsg(response.data.message)
                        setOpenAlert(true)

                    }


                }, (error) => {
                    setLoading(false)
                    console.log(error);
                    setMsg(error)
                    setOpenAlert(true)
                    // Utils.Alert("Info", "Oops! Something went wrong. Please try again .")
                })
            }
        }
        else {
            setMsg("Please accept all terms and condition")
            setOpenAlert(true)
        }
    }

    const confirmPress = () => {
        console.log("Confirm Button Pressed");
        if (success) {
            console.log("InsideIf");
            navigation.replace("LoginV2")
            setOpenAlert(false)
        }
        else {
            console.log("Inside Else");
            setOpenAlert(false)
        }

    }
    const onConfirm = () => {
        console.log("Confirm Button Pressed");
        setChecked(true)
        setVisible(false)
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.COLOR_WHITE, justifyContent: 'flex-end' }}>
            <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
            <Loader loading={loading}></Loader>
            {/* <Image source={require('../assets/cover2.jpg')} style={{ height: "50%", width: "100%", position: 'absolute', top: 0 }} /> */}
            <Image source={require('../assets/logoTransparent.png')} style={{ height: "30%", width: "40%", position: 'absolute', top: 0, alignSelf: 'center' }} resizeMode ="contain" />
            <View style={{ flex: 0.7, backgroundColor: 'white', borderTopRightRadius: 50, elevation: 10, borderTopLeftRadius: 50, justifyContent: 'space-evenly' }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: "#6cbaeb", marginLeft: 30, marginTop: 20 }}>Sign Up</Text>

                <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        {/* <Text style={{ fontSize: 16, color: "#6cbaeb", marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>Email</Text> */}
                        {/* <View style={{ width: "80%" , backgroundColor : "white", elevation : 10  , height : 50 , borderRadius : 20 , marginTop : 10 }}></View> */}
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                            <Icon name='user' size={20} style={{ marginLeft: 15 }} />
                            <TextInput
                                autoCapitalize='none'
                                onSubmitEditing={() => { emailRef.current.focus() }}
                                placeholder='Jhone '
                                onChangeText={(value) => setUserName(value)}
                                style={{ width: 230, marginLeft: 10 }}
                            />
                        </View>
                    </View>

                    <View style={{ zIndex: 1000 }}>
                        <DropDownPicker

                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={(item) => setValue(item)}
                            setItems={setItems}
                            placeholder="Select Gender"
                            dropDownContainerStyle={{ width: "70%", alignSelf: 'center' }}
                            style={{ height: 50, alignItems: 'center', marginRight: 20, width: "85%", alignSelf: 'center', backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20, borderWidth: 0 }}
                        // containerStyle={{ height: 40, justifyContent: 'center', alignItems: 'center', width: "85%" , alignSelf: 'center', borderRadius: 30 }}

                        />
                    </View>
                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                            <Icon name='envelope' size={20} style={{ marginLeft: 15 }} />
                            <TextInput
                                autoCapitalize='none'
                                ref={emailRef}
                                onSubmitEditing={() => { phoneRef.current.focus() }}
                                placeholder='E-mail'
                                onChangeText={(value) => setEmail(value)}
                                style={{ width: 230, marginLeft: 10 }} />
                        </View>
                    </View>

                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                            <Icon name='phone' size={20} style={{ marginLeft: 15 }} />
                            <TextInput
                                ref={phoneRef}
                                keyboardType="numeric"
                                onSubmitEditing={() => { passRef.current.focus() }}
                                placeholder='Phone'
                                onChangeText={(value) => setPhone(value)}
                                style={{ width: 230, marginLeft: 10 }} />
                        </View>
                    </View>


                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                            <Text style={{
                                marginLeft: 20
                            }}>{cText}</Text>

                            <CountryPicker
                                {...{
                                    countryCode,
                                    withFilter,
                                    withFlag,
                                    withCountryNameButton,
                                    withAlphaFilter,
                                    withCallingCode,
                                    withEmoji,
                                    onSelect,
                                    withModal,

                                }}
                            />
                        </View>
                    </View>


                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                            <Icon name='lock' size={20} style={{ marginLeft: 15 }} />
                            <TextInput
                                secureTextEntry
                                ref={passRef}
                                onSubmitEditing={() => { rePassRef.current.focus() }}
                                placeholder='Password'
                                onChangeText={(value) => setPassword(value)}
                                style={{ width: 230, marginLeft: 10 }} />
                        </View>
                    </View>


                    <View style={{ marginLeft: 20, marginTop: 10 }}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                            <Icon name='lock' size={20} style={{ marginLeft: 15 }} />
                            <TextInput
                                secureTextEntry
                                ref={rePassRef}
                                placeholder='Confirm Password'
                                onChangeText={(value) => setRePassword(value)}
                                style={{ width: 230, marginLeft: 10 }} />
                        </View>
                    </View>
                    {/* <TouchableOpacity onPress={() => showPrivacyModal()} style={{ marginVertical: 10, marginLeft: 20 }}>
                        <Text style={{ display: showPrivacyText, fontSize: 12, fontWeight: 'bold', color: "blue", margin: 10 }} >Accept all Terms and conditions</Text>
                    </TouchableOpacity> */}

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20 }}>
                        <CheckBox
                            style={{ flex: 1, maxWidth: 30 }}
                            onClick={() => onCheckBoxClick()}
                            isChecked={checked}
                            checkBoxColor="#6cbaeb"
                        />
                        <Text style={{ marginVertical: 10, marginLeft: 5, fontSize: 12, fontWeight: 'bold', color: "grey"}} >I accept all</Text>
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <Text style={{ marginVertical: 10, marginLeft: 5, fontSize: 12, fontWeight: 'bold', color: "blue"}} >terms and conditions</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => onSignUpClick()}
                        style={{ height: 50, marginTop: 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', width: "80%", backgroundColor: "#6cbaeb", elevation: 10, borderRadius: 20 }}>
                        <Text style={{ color: "white", fontWeight: 'bold' }}>SIGN UP</Text>
                    </TouchableOpacity>
                    <View>

                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                marginTop: 20
                            }}
                            onPress={() => navigation.navigate('LoginV2')}
                        >
                            <Text style={{ alignSelf: 'center', marginTop: 10 }}>Already have an account?</Text>
                            <Text style={{ alignSelf: 'center', marginTop: 10, fontWeight: 'bold', color: "#6a6eb5" }}> Sign In here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => confirmPress()}></Alerts>

            <Modal isVisible={visible} style={{ maxHeight: "90%", width: "100%", alignSelf: 'center', justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: "90%", borderRadius: 30, alignSelf: 'center', backgroundColor: "white" }}>
                    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{ maxWidth: "80%", backgroundColor: "white", alignSelf: 'center', borderRadius: 20, margin: 10 }}>
                        <RenderHtml
                            contentWidth={width}
                            // style={{ alignSelf: "center" , marginLeft :10}}
                            source={{ html: Session.companySettings.termsText }}
                        />



                        <TouchableOpacity
                            onPress={() => onConfirm()}
                            style={{ height: 40, marginBottom: 20, marginTop: 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', width: "80%", backgroundColor: "#6cbaeb", elevation: 10, borderRadius: 20 }}>
                            <Text style={{ color: "white", fontWeight: 'bold' }}>CONFIRM</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View >
    )
}

export default SignupV2





// <View style={{ flex: 1, backgroundColor: 'white' }}>
//     <Loader loading={loading}></Loader>




{/* <View style={{ margin: 20 }}>
                <TouchableOpacity>
                    <Icon name='arrow-left' size={25} />
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                <Text style={{ alignSelf: 'center' }}>Let's Get Started</Text>
                <Text>Create an account to get all features</Text>
            </View>
            <View style={{ flex: 0.9, width: "100%", marginTop: 20, justifyContent: 'space-around' }}>
                 <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 10, borderRadius: 20 }}>
                    <Icon name='user' size={20} style={{ marginLeft: 15 }} />
                    <TextInput
                        autoCapitalize='none'
                        onSubmitEditing={() => { emailRef.current.focus() }}
                        placeholder='Jhone Williams'
                        onChangeText={(value) => setUserName(value)}
                        style={{ width: 230, marginLeft: 10 }}
                    />
                </View>
                <View style={{ zIndex: 1000 }}>
                    <DropDownPicker

                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={(item) => setValue(item)}
                        setItems={setItems}
                        placeholder="Select Gender"
                        style={{ borderRadius: 20, borderWidth: 0, elevation: 5 }}
                        containerStyle={{ height: 40, justifyContent: 'center', alignItems: 'center', width: "80%", alignSelf: 'center', borderRadius: 30 }}

                    />
                </View>
                 <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "90%", backgroundColor: "#eef7ff", elevation: 10, marginTop: 20, borderRadius: 20 }}>
                    <Icon name='envelope' size={20} style={{ marginLeft: 15 }} />
                    <TextInput
                        autoCapitalize='none'
                        ref={emailRef}
                        onSubmitEditing={() => { phoneRef.current.focus() }}
                        placeholder='E-mail'
                        onChangeText={(value) => setEmail(value)}
                        style={{ width: 230, marginLeft: 10 }} />
                </View>

                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
                    <Icon name='phone' size={20} style={{ marginLeft: 15 }} />
                    <TextInput
                        ref={phoneRef}
                        keyboardType="numeric"
                        onSubmitEditing={() => { passRef.current.focus() }}
                        placeholder='Phone'
                        onChangeText={(value) => setPhone(value)}
                        style={{ width: 230, marginLeft: 10 }} />
                </View>

                <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
                    <Text style={{
                        marginLeft: 20
                    }}>{cText}</Text>

                    <CountryPicker
                        {...{
                            countryCode,
                            withFilter,
                            withFlag,
                            withCountryNameButton,
                            withAlphaFilter,
                            withCallingCode,
                            withEmoji,
                            onSelect,
                            withModal,

                        }}
                    />

                </View>


                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
                    <Icon name='lock' size={20} style={{ marginLeft: 15 }} />
                    <TextInput
                        secureTextEntry
                        ref={passRef}
                        onSubmitEditing={() => { rePassRef.current.focus() }}
                        placeholder='Password'
                        onChangeText={(value) => setPassword(value)}
                        style={{ width: 230, marginLeft: 10 }} />
                </View>

                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
                    <Icon name='lock' size={20} style={{ marginLeft: 15 }} />
                    <TextInput
                        secureTextEntry
                        ref={rePassRef}
                        placeholder='Confirm Password'
                        onChangeText={(value) => setRePassword(value)}
                        style={{ width: 230, marginLeft: 10 }} />
                </View>

            </View>


            <TouchableOpacity onPress={() => onSignUpClick()} style={{ height: 50, justifyContent: 'center', alignItems: 'center', width: 150, backgroundColor: Colors.COLOR_THEME, borderRadius: 25, alignSelf: 'center', marginTop: 20 }}>
                <Text style={{ color: Colors.COLOR_WHITE, fontWeight: 'bold' }}>CREATE</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignSelf: 'center'
                }}
                onPress={() => navigation.replace('Login')}
            >
                <Text style={{ alignSelf: 'center', marginTop: 10 }}>Already have an account?</Text>
                <Text style={{ alignSelf: 'center', marginTop: 10, fontWeight: 'bold', color: 'black' }}> Login here</Text>
            </TouchableOpacity> */}

        //     <Alerts
        //         showAlert={openAlert}
        //         buttonTxt={buttonTxt}
        //         msg={msg}
        //         onConfirmPressed={() => confirmPress()}></Alerts>

        // </View>