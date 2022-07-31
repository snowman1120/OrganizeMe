import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity } from 'react-native'
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


const SignUp = ({ navigation }) => {

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

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();
    const [items, setItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ]);


    const emailRef = useRef()
    const phoneRef = useRef()
    const passRef = useRef()
    const rePassRef = useRef()

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

    const onSignUpClick = async () => {
        setLoading(true)
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

    const confirmPress = () => {
        console.log("Confirm Button Pressed");
        if (success) {
            console.log("InsideIf");
            navigation.replace("Login")
            setOpenAlert(false)
        }
        else {
            console.log("Inside Else");
            setOpenAlert(false)
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Loader loading={loading}></Loader>
            <View style={{ margin: 20 }}>
                <TouchableOpacity>
                    <Icon name='arrow-left' size={25} />
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                <Text style={{ alignSelf: 'center' }}>Let's Get Started</Text>
                <Text>Create an account to get all features</Text>
            </View>
            <View style={{ flex: 0.9, width: "100%", marginTop: 20, justifyContent: 'space-around' }}>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
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
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
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
            </TouchableOpacity>
            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => confirmPress()}></Alerts>

        </View>
    )
}

export default SignUp