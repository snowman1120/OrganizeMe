import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from '../theme/Colors'
import FontSize from '../theme/FontSize'
import TextStyle from '../theme/TextStyle'
import Swiper from 'react-native-swiper'
import Session from '../utils/Session'
import Http from '../http/Http'
import Constants from '../http/Constants'
import useForceUpdate from 'use-force-update'
import AsyncMemory from '../utils/AsyncMemory'

const Package = ({ navigation }) => {
    const forceUpdate = useForceUpdate()
    const [loading, setLoading] = useState(false)

    let arr = Session.companyPackages;


    useEffect(() => {
        loadPackages()
    }, []);

    const onBuyNowClick = async (data) => {
        Session.userPackage.userId = Session.userObj[0].userId
        Session.userPackage.packageId = data.PackageId;

        await Http.post(Constants.END_POINT_UPDATE_USER_PACKAGE, Session.userPackage).then((response) => {
            console.log(response.data);
            if (response.data.success) {
                if (Session.userObj != null) {
                    AsyncMemory.storeItem("userObj", Session.userObj)
                    navigation.replace("BottomTab")
                } else {
                    console.log("user object is null");

                }
            }
            else {

            }


        }, (error) => {
            console.log(error);
        })

    }

    const loadPackages = () => {
        // console.log("arr ==== >" + JSON.stringify(arr));
        return arr.map(function (data, i) {
            return (
                <View key={i}>

                    <Text style={TextStyle.Styles.PACKAGE_STYLE}>{data.PackageName}</Text>
                    <View style={{
                        height: 150,
                        width: "80%",
                        backgroundColor: Colors.COLOR_THEME,
                        borderTopRightRadius: 50,
                        borderBottomRightRadius: 50,
                        elevation: 5,
                        justifyContent: 'center'
                    }}>
                        <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>{data.PackagePrice}  $</Text>
                        <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>{data.PackageDuration}</Text>
                    </View>

                    <View style={{

                        margin: 40
                    }}>

                        {loadDescription(data, i)}

                        <View style={{
                            width: "90%",
                            marginTop: 20,
                            backgroundColor: 'red',
                            borderWidth: 1
                        }}></View>

                        <TouchableOpacity
                            onPress={() => onBuyNowClick(data)}
                            style={{
                                height: 50,
                                width: 150,
                                borderColor: Colors.COLOR_THEME,
                                borderWidth: 1,
                                alignSelf: 'center',
                                marginVertical: 40,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                fontSize: FontSize.FONT_SIZE_16,
                                fontWeight: 'bold',
                                color: Colors.COLOR_BLACK
                            }}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        })

    }

    const loadDescription = (data, i) => {
        // console.log("Desc=" + data.PackageFeatures)
        var desc = data.PackageFeatures.split(";");
        // console.log(desc[0])
        var descArray = [];
        // for (let index = 0; index < desc.length; index++) {
        //    // console.log(desc[index]);
        //     descArray.push(desc[index])

        // }
        //      console.log(descArray)
        return desc.map(function (data, i) {

            return (<View key={i}>
                <View style={{
                    flexDirection: 'row',
                }}>

                    <Icon name='check' size={20} color={Colors.COLOR_BLACK} />
                    <Text style={{
                        marginLeft: 10,
                        fontSize: FontSize.FONT_SIZE_18
                    }}>{data}</Text>

                </View>
            </View>
            );

        })
    }

    // const loadPackages =  () => {
    //     //packageList= [];
    //     setpackageList([])
    //     console.log(Session.companyPackages.length);
    //     arr1 = Session.companyPackages[0].PackageFeatures.split(';')
    //     for (let i = 0; i < arr1.length; i++) {
    //         console.log(arr1[i]);
    //     }




    //     for (let i = 0; i < Session.companyPackages.length; i++) {
    //         packageList.push(

    //             <View key={i} >
    //                 <View>

    //                     <Text style={TextStyle.Styles.PACKAGE_STYLE}>{Session.companyPackages[i].PackageName}</Text>
    //                     <View style={{
    //                         height: 150,
    //                         width: "80%",
    //                         backgroundColor: Colors.COLOR_THEME,
    //                         borderTopRightRadius: 50,
    //                         borderBottomRightRadius: 50,
    //                         elevation: 5,
    //                         justifyContent: 'center'
    //                     }}>
    //                         <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>{Session.companyPackages[i].PackagePrice}  $</Text>
    //                         <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>{Session.companyPackages[i].PackageDuration}</Text>
    //                     </View>
    //                 </View>
    //                 <View style={{ margin: 30 }}>
    //                     <FlatList
    //                         data={arr1}
    //                         renderItem={({ item, index }) =>
    //                             <View style={{
    //                                 flexDirection: 'row',
    //                             }}>

    //                                 <Icon name='check' size={20} color={Colors.COLOR_BLACK} />
    //                                 <Text style={{
    //                                     marginLeft: 10,
    //                                     fontSize: FontSize.FONT_SIZE_18
    //                                 }}>{arr1[index]}</Text>

    //                             </View>
    //                         }
    //                     />

    //                 </View>

    //             </View>
    //         )
    //     }
    //     setpackageList(packageList)
    //     forceUpdate()
    // }


    return (
        <View style={{
            flex: 1, backgroundColor: Colors.COLOR_WHITE
        }}>
            <View style={{ alignSelf: 'center' }}>
                <Text style={TextStyle.Styles.PACKAGE_STYLE}> Price Plans</Text>
            </View>


            <Swiper

                onIndexChanged={(index) => console.log(index)}
                // showsPagination={false}
                loop={false}
                style={{
                    height: "90%",
                    alignSelf: 'center',
                }}
                activeDotColor={Colors.COLOR_BLACK}>

                {loadPackages()}

                {/* <View>
                    
                    <Text style={TextStyle.Styles.PACKAGE_STYLE}>BASIC</Text>
                    <View style={{
                        height: 150,
                        width: "80%",
                        backgroundColor: Colors.COLOR_THEME,
                        borderTopRightRadius: 50,
                        borderBottomRightRadius: 50,
                        elevation: 5,
                        justifyContent: 'center'
                    }}>
                        <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>14.99  $</Text>
                        <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>/Month</Text>
                    </View>

                    <View style={{

                        margin: 40
                    }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>

                            <Icon name='check' size={20} color={Colors.COLOR_BLACK} />
                            <Text style={{
                                marginLeft: 10,
                                fontSize: FontSize.FONT_SIZE_18
                            }}>5 chat responses per week</Text>

                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                        }}>

                            <Icon name='check' size={20} color={Colors.COLOR_BLACK} />
                            <Text style={{
                                marginLeft: 10,
                                fontSize: FontSize.FONT_SIZE_18
                            }}>unlimited photo uploads</Text>

                        </View>



                        <View style={{
                            width: "90%",
                            marginTop: 20,
                            backgroundColor: 'red',
                            borderWidth: 1
                        }}></View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("BottomTab", 1)}
                            style={{
                                height: 50,
                                width: 150,
                                borderColor: Colors.COLOR_THEME,
                                borderWidth: 1,
                                alignSelf: 'center',
                                marginVertical: 40,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                fontSize: FontSize.FONT_SIZE_16,
                                fontWeight: 'bold',
                                color: Colors.COLOR_BLACK
                            }}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View>
                    <Text style={TextStyle.Styles.PACKAGE_STYLE}>VIP</Text>
                    <View style={{
                        height: 150,
                        width: "80%",
                        backgroundColor: "#b3b154",
                        borderTopRightRadius: 50,
                        borderBottomRightRadius: 50,
                        elevation: 5,
                        justifyContent: 'center'
                    }}>
                        <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>19.99  $</Text>
                        <Text style={TextStyle.Styles.PACKAGE_TEXT_STYLE}>/Month</Text>
                    </View>

                    <View style={{

                        margin: 40
                    }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>

                            <Icon name='check' size={20} color={Colors.COLOR_BLACK} />
                            <Text style={{
                                marginLeft: 10,
                                fontSize: FontSize.FONT_SIZE_18
                            }}>unlimited chat responses</Text>

                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                        }}>

                            <Icon name='check' size={20} color={Colors.COLOR_BLACK} />
                            <Text style={{
                                marginLeft: 10,
                                fontSize: FontSize.FONT_SIZE_18
                            }}>unlimited photo uploads</Text>

                        </View>

                        <View style={{
                            width: "90%",
                            marginTop: 20,
                            backgroundColor: 'red',
                            borderWidth: 1
                        }}></View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate("BottomTab", 3)}
                            style={{
                                height: 50,
                                width: 150,
                                borderColor: Colors.COLOR_THEME,
                                borderWidth: 1,
                                alignSelf: 'center',
                                marginVertical: 40,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                fontSize: FontSize.FONT_SIZE_16,
                                fontWeight: 'bold',
                                color: Colors.COLOR_BLACK
                            }}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
            </Swiper>

        </View>
    )
}

export default Package