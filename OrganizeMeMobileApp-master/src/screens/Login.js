import React, { useState, useEffect, useRef } from 'react'
import { View, StatusBar, Text, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk-next';
import Loader from '../utils/loader'
import Constants from '../http/Constants'
import Session from '../utils/Session'
import Http from '../http/Http'
import Utils from '../utils/Utils'
import Alerts from '../utils/Alerts'
import AsyncMemory from '../utils/AsyncMemory'
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import { incremented, addMsg } from '../redux/slices/chat/chatSlice'

const Login = ({ navigation }) => {

    //Auth 2 for google
    //Auth 3 for facebook

    const value = useAppSelector((State) => State.chat.value)
    const dispatch = useAppDispatch()


    // dispatch(incremented)
    // dispatch(addMsg("h"))


    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [openAlert, setOpenAlert] = useState(false)
    const [msg, setMsg] = useState("")
    const [buttonTxt, setButtonTxt] = useState("")
    const [success, setSuccess] = useState(false);


    const pasRef = useRef();

    const onLoginClick = async () => {
        console.log("LoginPresed");
        setLoading(true)

        Session.signInObj.email = email;
        Session.signInObj.password = pass;

        await Http.post(Constants.END_POINT_SIGNIN, Session.signInObj).then((response) => {
            setLoading(false)
            console.log(response.data);
            if (response.data.success) {
                setSuccess(true)
                Session.userObj = response.data.data.user[0]
                Session.docObj = response.data.data.doctor[0]
                AsyncMemory.storeItem("userObj", Session.userObj)
                AsyncMemory.storeItem("docObj", Session.docObj)
                if (response.data?.data?.user[0]?.userPackageId != "") {
                    navigation.replace("BottomTab")
                }
                else {
                    navigation.replace("Package")
                }
                // console.log("company packages === >" + JSON.stringify(Session.companyPackages));
            }
            else {
                setLoading(false)
                setSuccess(false)
                setButtonTxt("Cancel")
                setMsg(response.data.message)
                setOpenAlert(true)
            }


        }, (error) => {
            console.log(error);
            setButtonTxt("Cancel")
            setMsg(response.data.message)
            setLoading(false)
            setOpenAlert(true)

        })
    }


    const onSocialLoginClick = async (idToken, Id) => {
        console.log(" Id TOKEN === >" + JSON.stringify(idToken) + " < ======= id ====== >" + Id);
        setLoading(true)

        Session.socialSignInObj.faceBookUserId = idToken.userID;
        if (Id == 2) {
            Session.socialSignInObj.authId = "2" // for google    
            Session.socialSignInObj.authToken = idToken
        }
        else {
            Session.socialSignInObj.authId = "3" // for facebook          
            Session.socialSignInObj.authToken = idToken.accessToken;
        }

        console.log("session social signin object ==== >" + JSON.stringify(Session.socialSignInObj));

        await Http.post(Constants.END_POINT_SIGNIN_SOCIAL, Session.socialSignInObj).then((response) => {
            setLoading(false)
            console.log(response.data);
            if (response.data.success) {
                Session.userObj = response.data.data.user[0]
                Session.docObj = response.data.data.doctor[0]
                AsyncMemory.storeItem("userObj", Session.userObj)
                AsyncMemory.storeItem("docObj", Session.docObj)
                if (response.data?.data?.user[0]?.userPackageId != "") {
                    navigation.replace("BottomTab")
                }
                else {
                    navigation.replace("Package")
                }
            }
            else {
                setSuccess(false)
                setButtonTxt("Cancel")
                setMsg(response.data.message)
                setOpenAlert(true)
            }


        }, (error) => {
            console.log(error);
            setButtonTxt("Cancel")
            setMsg(response.data.message)
            setLoading(false)
            setOpenAlert(true)

        })
    }



    useEffect(() => {
        console.log(JSON.stringify(Session.userObj));
        GoogleSignin.configure({
            scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: '398685992086-d82686o0hs914d2hr00831j5296pvuev.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            androidClientId: '398685992086-6diqmqvgcjfq630m39ctmp051nk9jnno.apps.googleusercontent.com',
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });
    }, []);

    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);

    const [user, setUser] = useState()

    async function onFacebookButtonPress() {
        // Attempt login with permissions
        // setLoading(true)
        console.log("Login Attempt");
        console.log("==============Login Manager before ========================");
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        console.log("==============Login Manager after ========================");

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        console.log("Before Auth Token ");
        console.log("Befforee data======================================");
        const data = await AccessToken.getCurrentAccessToken();
        console.log("after data======================================");

        console.log("Before Data");
        if (!data) {
            throw 'Something went wrong obtaining access token';
        }
        console.log("data" + JSON.stringify(data));
        console.log("Result === >" + JSON.stringify(result));
        // Create a Firebase credential with the AccessToken
        console.log("Before Facebook Credentials");
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        onSocialLoginClick(data, 3)
        return auth().signInWithCredential(facebookCredential);



    }

    // Somewhere in your code
    const _signIn = async () => {
        try {
            setLoading(true)
            await GoogleSignin.hasPlayServices();
            console.log("Try singin");
            const { accessToken, idToken } = await GoogleSignin.signIn();
            console.log("access token === >" + accessToken);
            console.log("id token ==== >" + idToken);
            onSocialLoginClick(idToken, 2)
            setloggedIn(true);
            setloggedIn(false)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                alert('Cancel');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('PLAY_SERVICES_NOT_AVAILABLE');
                // play services not available or outdated
            } else {
                alert(error)

                // some other error happened
            }
        }
    };

    const FbSignIn = async () => {
        console.log("Fb Singin Pressed");
        setLoading(false)
        if (error) {
            console.log("login has error: " + result.error);
        } else if (result.isCancelled) {
            console.log("login is cancelled.");
        } else {
            console.log("Else Login");
            await AccessToken.getCurrentAccessToken().then(
                (data) => {
                    console.log(data.accessToken.toString())
                }
            )
        }
    }

    const confirmPress = () => {
        console.log("Confirm Button Pressed");
        if (success) {
            console.log("InsideIf");
            navigation.replace("Package")
            setOpenAlert(false)
        }
        else {
            console.log("Inside Else");
            setOpenAlert(false)
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.COLOR_WHITE }}>
            <StatusBar backgroundColor="white"></StatusBar>
            <Loader loading={loading}></Loader>
            <View style={{ flex: 0.4, justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ marginTop: 20 }}>
                    <Text style={TextStyle.Styles.TEXT_STYLE_DEFAULT_BOLD}>Get Organized</Text>
                </View>
                <View style={{
                    alignItems: 'center'
                }}>
                    <Text style={TextStyle.Styles.TEXT_STYLE_DEFAULT_BOLD}>WELCOME BACK</Text>
                    <Text style={TextStyle.Styles.TEXT_STYLE_DEFAULT}>Login to your account</Text>
                </View>
            </View>

            <View style={{ flex: 0.6, justifyContent: 'space-evenly' }}>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "80%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
                    <Icon name='user' size={20} style={{ marginLeft: 15 }} />
                    <TextInput onChangeText={(Value) => setEmail(Value)} onSubmitEditing={() => { pasRef.current.focus() }} placeholder='Jhone Williams' style={{ width: 230, marginLeft: 10 }} />
                </View>

                <View style={{ width: "80%", alignSelf: 'center' }}>
                    <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', width: "100%", backgroundColor: Colors.COLOR_WHITE, elevation: 2, alignSelf: 'center', borderRadius: 20 }}>
                        <Icon name='lock' size={20} style={{ marginLeft: 15 }} />
                        <TextInput secureTextEntry onChangeText={(Value) => setPass(Value)} ref={pasRef} placeholder='Password' style={{ width: 230, marginLeft: 10 }} />
                    </View>
                    <Text style={TextStyle.Styles.TEXT_STYLE_DEFAULT, { alignSelf: 'flex-end', marginRight: 20, marginTop: 10 }}>Forgot Password?</Text>
                </View>
                <TouchableOpacity
                    onPress={() => onLoginClick()}
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
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>LOG IN</Text>
                </TouchableOpacity>


                <View>
                    <Text style={TextStyle.Styles.TEXT_STYLE_DEFAULT, { alignSelf: 'center' }}>Or connect using</Text>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

                        {/* <LoginButton
                            style={{ height: 50, width: 180, marginTop: 20 }}
                            onLoginFinished={
                                (error, result) => {
                                    if (error) {
                                        console.log("login has error: " + error);
                                    } else if (result.isCancelled) {
                                        console.log("login is cancelled.");
                                    } else {
                                        AccessToken.getCurrentAccessToken().then(
                                            (data) => {
                                                console.log(data.accessToken.toString())
                                            }
                                        )
                                    }
                                }
                            }
                            onLogoutFinished={() => console.log("logout.")} /> */}


                        <TouchableOpacity
                            onPress={() => onFacebookButtonPress()}
                            style={{
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 150,
                                borderRadius: 15,
                                alignSelf: 'center',
                                marginTop: 20,
                                backgroundColor: Colors.COLOR_WHITE,
                                borderWidth: 1,
                                borderColor: Colors.COLOR_THEME
                            }}>
                            <Icon name='facebook' size={20} style={{ marginHorizontal: 5 }} color="blue" />
                            <Text style={{ color: Colors.COLOR_BLACK, fontWeight: 'bold' }}>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => _signIn()}
                            style={{
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 150,
                                borderRadius: 15,
                                alignSelf: 'center',
                                marginTop: 20,
                                borderWidth: 1,
                                borderColor: Colors.COLOR_THEME
                            }}>
                            <Icon name='google' size={20} style={{ marginHorizontal: 5 }} color="red" />
                            <Text style={{ color: Colors.COLOR_BLACK, fontWeight: 'bold' }}>Google</Text>
                        </TouchableOpacity>
                        {/* <GoogleSigninButton
                            style={{ width: 180, height: 50, marginTop: 20 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={() => _signIn()}
                        /> */}
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignSelf: 'center'
                    }}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={{ alignSelf: 'center', marginTop: 10 }}>Don't have an account?</Text>
                    <Text style={{ alignSelf: 'center', marginTop: 10, fontWeight: 'bold', color: 'black' }}> Sign Up here</Text>
                </TouchableOpacity>
            </View>
            <Alerts
                showAlert={openAlert}
                buttonTxt={buttonTxt}
                msg={msg}
                onConfirmPressed={() => confirmPress()}></Alerts>

        </View >
    )
}

export default Login