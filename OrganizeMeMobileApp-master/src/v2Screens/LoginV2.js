import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../theme/Colors';
import FontSize from '../theme/FontSize';
import TextStyle from '../theme/TextStyle';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk-next';
import Loader from '../utils/loader';
import Constants from '../http/Constants';
import Session from '../utils/Session';
import Http from '../http/Http';
import Utils from '../utils/Utils';
import Alerts from '../utils/Alerts';
import AsyncMemory from '../utils/AsyncMemory';
import { useAppDispatch, useAppSelector } from '../redux/app/hooks';
import { incremented, addMsg } from '../redux/slices/chat/chatSlice';
import Video from 'react-native-video';
import logoVedio from '../assets/logo.mp4';
import { ScrollView } from 'react-native-gesture-handler';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import Modal from 'react-native-modal'
import RenderHtml from 'react-native-render-html';


const Login = ({ navigation }) => {
  //Auth 2 for google
  //Auth 3 for facebook

  const value = useAppSelector(State => State.chat.value);
  const dispatch = useAppDispatch();
  const width = Dimensions.get('window').width / 2;

  // dispatch(incremented)
  // dispatch(addMsg("h"))

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [msg, setMsg] = useState('');
  const [buttonTxt, setButtonTxt] = useState('Ok');
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false)
  const [modalSuccess, setModalSuccess] = useState()
  const [passwordVisible, setPasswordVisible] = useState(true)
  const [secureText, setSecureText] = useState(true)




  const pasRef = useRef();
  const videoRef = useRef();
  const scrollViewRef = useRef()
  const onLoginClick = async () => {
    console.log('LoginPresed');

    if (email == '' || pass == '') {
      setOpenAlert(true);
      setMsg('Enter Credentials');
    } else {
      setLoading(true);

      Session.signInObj.email = email;
      Session.signInObj.password = pass;

      await Http.post(Constants.END_POINT_SIGNIN, Session.signInObj).then(
        response => {
          setLoading(false);
          console.log(response.data);
          if (response.data.data.user[0]?.userId) {
            setSuccess(true);
            Session.userObj = response.data.data.user[0];
            Session.docObj = response.data.data.doctor[0];
            AsyncMemory.storeItem('userObj', Session.userObj);
            AsyncMemory.storeItem('docObj', Session.docObj);
            if (response.data?.data?.user[0]?.userPackageId != '') {
              onConversation();
              navigation.replace('BottomTab');
            }
            else {
              onConversation();
              navigation.replace('BottomTab');
            }
            // console.log("company packages === >" + JSON.stringify(Session.companyPackages));
          } else {
            setLoading(false);
            setSuccess(false);
            setButtonTxt('Cancel');
            setMsg('Invalid Credentials');
            setOpenAlert(true);
          }
        },
        error => {
          console.log(error);
          setButtonTxt('Cancel');
          setMsg('An Error Occured');
          setLoading(false);
          setOpenAlert(true);
        },
      );
    }
  };

  const onConversation = async () => {
    console.log(
      ' ========================= On Conversation API ============================',
    );

    Session.conversation.senderId = Session.userObj.userId;
    Session.conversation.senderName = Session.userObj.userName;
    Session.conversation.receiverId = Session.docObj.userId;
    Session.conversation.receiverName = Session.docObj.userName;
    Session.conversation.conversationName = Session.userObj.userName;
    Session.conversation.senderImgUrl = Session.userObj.imgUrl;
    Session.conversation.receiverImgUrl = Session.docObj.imgUrl;

    if (
      Session.conversationId == null ||
      Session.conversationId == undefined ||
      Session.conversationId == ''
    ) {
      await Http.postConversation(
        Constants.CONVERSATION_URL,
        Session.conversation,
      ).then(
        response => {
          // setLoading(false)

          if (response.status >= 200) {
            if (response.data[0]?._id) {
              Session.conversationId = response.data[0]?._id;
              console.log(
                'session conversation id at login Screenn iffff == >' +
                JSON.stringify(Session.conversationId),
              );
              AsyncMemory.storeItem('conversationId', Session.conversationId);
            } else if (response.data?._id) {
              console.log(
                'session conversation id at login Screenn else ifff == >' +
                JSON.stringify(Session.conversationId),
              );
              Session.conversationId = response.data?._id;
              AsyncMemory.storeItem('conversationId', Session.conversationId);
            }
          } else {
          }
        },
        error => {
          console.log(error);
        },
      );
    } else {
      console.log('Session Conversation ID is already stored');
    }
  };

  const onSocialLoginClick = async (idToken, Id) => {
    console.log(
      ' Id TOKEN === >' +
      JSON.stringify(idToken) +
      ' < ======= id ====== >' +
      Id,
    );
    setLoading(true);

    Session.socialSignInObj.faceBookUserId = idToken.userID;
    if (Id == 2) {
      Session.socialSignInObj.authId = '2'; // for google
      Session.socialSignInObj.authToken = idToken;
    } else if (Id == 3) {
      Session.socialSignInObj.authId = '3'; // for facebook
      Session.socialSignInObj.authToken = idToken.accessToken;
    }
    else {
      Session.socialSignInObj.authId = '4'; // for apple
      Session.socialSignInObj.authToken = idToken;
    }

    console.log(
      'session social signin object ==== >' +
      JSON.stringify(Session.socialSignInObj),
    );

    await Http.post(
      Constants.END_POINT_SIGNIN_SOCIAL,
      Session.socialSignInObj,
    ).then(
      response => {
        setLoading(false);
        console.log("login user objec === >" + JSON.stringify(response.data.data.user[0]));
        if (response.data.success) {
          Session.userObj = response.data.data.user[0];
          Session.docObj = response.data.data.doctor[0];
          

console.log("==================================================")

             console.log(Session.userObj);
          if(Session.userObj.isAgreementChecked=='Y'){
             console.log("agreement trye")
             console.log(navigation)
             AsyncMemory.storeItem('userObj', Session.userObj);
             AsyncMemory.storeItem('docObj', Session.docObj);
           
             navigation.replace('BottomTab');
          }
          else{
            setVisible(true)
          }
        } else {
          setSuccess(false);
          setButtonTxt('Cancel');
          setMsg(response.data.message);
          setOpenAlert(true);
        }
      },
      error => {
        console.log(error);
        setButtonTxt('Cancel');
        setMsg('An error occured ');
        setLoading(false);
        setOpenAlert(true);
      },
    );
  };

  useEffect(() => {
    // InAppPurchase()
    console.log(JSON.stringify(Session.userObj));
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '398685992086-d82686o0hs914d2hr00831j5296pvuev.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      androidClientId:
        '398685992086-6diqmqvgcjfq630m39ctmp051nk9jnno.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      iosClientId:
        '398685992086-1lajf9tj01uii7eorhep53fon56ioqb9.apps.googleusercontent.com',
    });
  }, []);

  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);
  const [id, setId] = useState()
  const [user, setUser] = useState();

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    // setLoading(true)
    console.log('Login Attempt');
    console.log('==============Login Manager before ========================');
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    console.log('==============Login Manager after ========================');

    // if (result.isCancelled) {
    //   throw 'User cancelled the login process';
    // }

    // Once signed in, get the users AccesToken
    console.log('Before Auth Token ');
    console.log('Befforee data======================================');
    const data = await AccessToken.getCurrentAccessToken();
    console.log('after data======================================');

    console.log('Before Data');
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    console.log('data' + JSON.stringify(data));
    // console.log('Result === >' + JSON.stringify(result));
    // Create a Firebase credential with the AccessToken
    console.log('Before Facebook Credentials');
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    onSocialLoginClick(data, 3);
    return auth().signInWithCredential(facebookCredential);
  }

  // Somewhere in your code

  const onSocialSignInPress = (Id) => {
    console.log("id == >" + Id); //1 for fb , 2 for google , 3 for apple 
    setId(Id)
    if (Id == 1) {
      onFacebookButtonPress()
    }
    else if (Id == 2) {
      _signIn()
    }
    else {
      onAppleButtonPress()
    }
  }
  const onConfirm = () => {
    console.log('Confirm Button Pressed');
    setVisible(false);

    updateCheckMark('Y')

  };

  const _signIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      console.log('Try singin');
      const { accessToken, idToken } = await GoogleSignin.signIn();
      console.log('access token === >' + accessToken);
      console.log('id token ==== >' + idToken);
      onSocialLoginClick(idToken, 2);
      setloggedIn(true);
      setloggedIn(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
        alert(error);
        // some other error happened
      }
    }
  };


  const updateCheckMark= async (checkMark)=>{

    console.log("userId = "+Session.userObj.userId);
   let obj = {
    "userId" : Session.userObj.userId,
    "checkMark":checkMark
   }

    await Http.post(Constants.END_POINT_UPDATE_CHECK, obj).then(
      response => {
        setLoading(false);
        console.log(response.data);
          
          navigation.replace('BottomTab');
          

          // console.log("company packages === >" + JSON.stringify(Session.companyPackages));
       
      },
      error => {
      },
    );
  }

  const FbSignIn = async () => {
    console.log('Fb Singin Pressed');
    setLoading(false);
    if (error) {
      console.log('login has error: ' + result.error);
    } else if (result.isCancelled) {
      console.log('login is cancelled.');
    } else {
      console.log('Else Login');
      await AccessToken.getCurrentAccessToken().then(data => {
        console.log(data.accessToken.toString());
      });
    }
  };

  const confirmPress = () => {
    console.log('Confirm Button Pressed');
    if (success) {
      console.log('InsideIf');
      navigation.replace('Package');
      setOpenAlert(false);
    } else {
      console.log('Inside Else');
      setOpenAlert(false);
    }
  };

  const onAppleButtonPress = async () => {
    // performs login request
    console.log("apple button pressed");
    const appleAuthRequestResponse = await appleAuth.performRequest({

      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    console.log("appleAuthRequestResponse" + JSON.stringify(appleAuthRequestResponse));

    onSocialLoginClick(appleAuthRequestResponse.identityToken, 4);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.

    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    console.log("credentialState" + JSON.stringify(credentialState));
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log("inside ifff");
    }
  }
  const onPressEyeButton=()=>{
    setPasswordVisible(!passwordVisible);
     setSecureText(!secureText);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: 'flex-end',
      }}>
      <StatusBar backgroundColor={Colors.COLOR_THEME}></StatusBar>
      <Loader loading={loading}></Loader>
      <Image
        source={require('../assets/logoTransparent.png')}
        style={{
          height: '30%',
          width: '40%',
          position: 'absolute',
          top: 0,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <View
        style={{
          flex: 0.7,
          backgroundColor: 'white',
          borderTopRightRadius: 50,
          elevation: 10,
          borderTopLeftRadius: 50,
          justifyContent: 'space-evenly',
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#6cbaeb',
            marginLeft: 30,
            marginTop: 20,
          }}>
          Sign In
        </Text>
        <ScrollView>
          <View style={{ flex: 1 }}>
            <View style={{ marginLeft: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#6cbaeb',
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
                }}>
                Email
              </Text>
              {/* <View style={{ width: "80%" , backgroundColor : "white", elevation : 10  , height : 50 , borderRadius : 20 , marginTop : 10 }}></View> */}
              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: '#eef7ff',
                  elevation: 10,
                  marginTop: 20,
                  borderRadius: 20,
                }}>
                <Icon name="user" size={20} style={{ marginLeft: 15 }} color={"black"} />
                <TextInput
                  onChangeText={Value => setEmail(Value)}
                  onSubmitEditing={() => {
                    pasRef.current.focus();
                  }}
                  placeholder="Email"
                  style={{ width: '100%', marginLeft: 10, color: "black" }}
                  placeholderTextColor={'gray'}
                />
              </View>
            </View>
            <View style={{ marginLeft: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#6cbaeb',
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
                }}>
                Password
              </Text>
              {/* <View style={{ width: "80%" , backgroundColor : "white", elevation : 10  , height : 50 , borderRadius : 20 , marginTop : 10 }}></View> */}
              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: '#eef7ff',
                  elevation: 10,
                  marginTop: 20,
                  borderRadius: 20,
                }}>
                <Icon name="lock" size={20} style={{ marginLeft: 15 }} color={"black"} />
                
                <TextInput
                  secureTextEntry={secureText}
                  onChangeText={Value => setPass(Value)}
                  ref={pasRef}
                  placeholder="Password"
                  style={{ width: '75%', marginLeft: 10, color: "black" }}
                  placeholderTextColor={'gray'}
                
                  // right={
                  //   <TextInput.Icon color={Colors.COLOR_BLACK} name={passwordVisible ? "eye" : "eye-off"} onPress={onPressEyeButton} />
                    
                  // }
                />
                  <Icon name={passwordVisible?"eye-slash": "eye"} size={20} style={{ marginRight: 5 }} color={"black"} onPress={onPressEyeButton} />
              
               </View>
              
            </View>

            <TouchableOpacity
              onPress={() => onLoginClick()}
              style={{
                height: 50,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                width: '80%',
                backgroundColor: '#6cbaeb',
                elevation: 10,
                marginTop: 20,
                borderRadius: 20,
              }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                SIGN IN
              </Text>
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'black',
                  fontSize: 14,
                  marginTop: 20,
                }}>
                - OR -
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: 70,
                  width: '90%',
                  alignSelf: 'center',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => onSocialSignInPress(1)}
                  style={{
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    borderRadius: 15,
                    alignSelf: 'center',
                    marginTop: 20,
                    backgroundColor: '#3b5998',
                    borderWidth: 1,
                    borderColor: Colors.COLOR_THEME,
                  }}>
                  <Icon
                    name="facebook"
                    size={20}
                    style={{ marginHorizontal: 5 }}
                    color="white"
                  />
                  <Text
                    style={{
                      color: 'white',
                      marginTop: 10,
                      fontWeight: 'bold',
                    }}>
                    Facebook
                  </Text>
                </TouchableOpacity>




                <TouchableOpacity
                  onPress={() => onSocialSignInPress(2)}
                  style={{
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    borderRadius: 15,
                    alignSelf: 'center',
                    marginTop: 20,
                    backgroundColor: '#DB4437',
                    borderWidth: 1,
                    borderColor: Colors.COLOR_THEME,
                  }}>
                  <Icon
                    name="google"
                    size={20}
                    style={{ marginHorizontal: 5 }}
                    color="white"
                  />
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Google
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => onSocialSignInPress(3)}
                style={{
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: "60%",
                  borderRadius: 5,
                  alignSelf: 'center',
                  marginTop: 20,
                  backgroundColor: Colors.COLOR_BLACK,
                  borderWidth: 1,
                  borderColor: Colors.COLOR_THEME,
                  flexDirection: 'row',
                  display: Platform.OS == "ios" ? "flex" : "none"
                }}>
                <Icon
                  name="apple"
                  size={20}
                  style={{ marginHorizontal: 15 }}
                  color="white"
                />
                <Text
                  style={{
                    color: 'white',
                    // marginTop: 10,
                    fontWeight: 'bold',
                  }}>
                  Sign up with Apple
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignupV2')}
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                <Text style={{ alignSelf: 'center', marginTop: 10, color: "black" }}>
                  Don't have an account?
                </Text>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 10,
                    fontWeight: 'bold',
                    color: '#6a6eb5',
                  }}>
                  {' '}
                  Sign Up here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Alerts
        showAlert={openAlert}
        buttonTxt={buttonTxt}
        msg={msg}
        onConfirmPressed={() => confirmPress()}></Alerts>
      <Modal
        isVisible={visible}
        style={{
          maxHeight: '90%',
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          //   backgroundColor: 'red',
        }}>
        <View
          style={{
            width: '90%',
            height: '100%',
            borderRadius: 30,
            alignSelf: 'center',
            backgroundColor: 'white',
          }}>
          <TouchableOpacity onPress={() => setVisible(false)} style={{ marginTop: 20, alignSelf: 'flex-end', marginRight: 20 }}>
            <Icon name='xing' size={20} color={"black"} />
          </TouchableOpacity>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              maxWidth: '80%',
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: 20,
              margin: 10,
            }}>
            <RenderHtml
              contentWidth={width}
              // style={{ alignSelf: "center" , marginLeft :10}}
              source={{ html: Session.companySettings.termsText }}
            />

            <TouchableOpacity
              onPress={() => onConfirm()}
              style={{
                height: 40,
                marginBottom: 20,
                marginTop: 20,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                width: '80%',
                backgroundColor: '#6cbaeb',
                elevation: 10,
                borderRadius: 20,
              }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View >
  );
};

export default Login;
