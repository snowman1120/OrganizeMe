import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Constants from '../http/Constants'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import Loader from '../utils/loader'
import Http from '../http/Http'
import Session from '../utils/Session'

const CheckList = ({ navigation }) => {

    useEffect(() => {
        getCheckList()
        onConversation()
        console.log("Doc Object === >" + JSON.stringify(Session.docObj));       
        console.log("user Object === >" + JSON.stringify(Session.userObj));       
        // console.log("FlatlIST dATA === >" + JSON.stringify(data));
    }, [getCheckList]);

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])


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
        // Session.conversation.receiverId = Session.docObj.userId
        // Session.conversation.receiverName = Session.docObj.userName
        Session.conversation.conversationName = Session.userObj.userName



        console.log("Conversation == >" + JSON.stringify(Session.conversation));

        await Http.postConversation(Constants.CONVERSATION_URL, Session.conversation).then((response) => {
            setLoading(false)
            console.log( "response === > " + JSON.stringify(response.data));

            if (response.data.success) {
            }
            else {
            }


        }, (error) => {
            console.log(error);
        })
    }


    return (
        <View style={{ flex: 1 }}>
            <Loader loading={loading} ></Loader>
            <FlatList
                nestedScrollEnabled={true}
                data={data}
                keyExtractor={item => item.checkListId}
                renderItem={({ item }) =>
                    <View style={{
                        height: 600,
                        marginTop: 10,
                        width: "90%",
                        borderRadius: 30,
                        alignSelf: 'center',
                        elevation: 10,
                        marginBottom: 35,
                        backgroundColor: Colors.COLOR_WHITE,

                    }}>
                        <View style={{
                            height: "40%",
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30
                        }}>
                            <Image style={{
                                height: 200,
                                width: 200,
                            }} source={{ uri: item.checkListImgUrl }} resizeMode="contain" />
                        </View>
                        <View style={{
                            height: "60%",
                            borderBottomLeftRadius: 30,
                            borderBottomRightRadius: 30,
                            justifyContent: 'space-evenly'
                        }}>
                            <Text style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 16,
                                color: Colors.COLOR_BLACK,
                                fontWeight: 'bold'
                            }}>Title</Text>
                            <Text style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 14,
                                color: 'grey',
                                width: 300,
                            }}>{item.checkListTitle}</Text>
                            <Text style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 16,
                                color: Colors.COLOR_BLACK,
                                fontWeight: 'bold'
                            }}>Description</Text>
                            <ScrollView fadingEdgeLength={20} style={{ height: 70, width: "90%", marginLeft: 10 }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: 'grey'
                                }}>{item.checkListDesc}</Text>
                            </ScrollView>

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
                            <Text style={{ fontWeight: '600', color: 'black' }}>Check</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    )
}

export default CheckList