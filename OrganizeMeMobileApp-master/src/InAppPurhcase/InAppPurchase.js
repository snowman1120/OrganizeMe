import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, FlatList } from "react-native";
import {
    requestSubscription,
    finishTransaction,
    purchaseErrorListener,
    purchaseUpdatedListener,
    getSubscriptions,
    initConnection,
    validateReceiptIos,
    getReceiptIOS,
    withIAPContext
} from "react-native-iap";

const IAPSKU = Platform.select({
    android: ["com.organizeme.iap.onemonth", "com.organizeme.iap.oneyear","com.organizeme.iap.oneyearvip"],
    ios: []
})

const InAppPurchase = ({ navigation }) => {

    const [isFullAppPurchased, setIsFullAppPurchased] = useState(false)
    const [connectionErrorMsg, setConnectionErrorMsg] = useState("")
    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState([]);





    // const loadIAPListeners = async () => {
    //     if (purchaseUpdateSubscription) {
    //         purchaseUpdateSubscription.remove();
    //     }
    //     if (purchaseErrorSubscription) {
    //         purchaseErrorSubscription.remove();
    //     }
    //     await initConnection(); // important, or else it won't trigger before a random state change
    //     purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
    //         console.log("purchased", JSON.stringify(purchase));
    //         console.log("productId", purchase.productId);
    //         let receipt = purchase.transactionReceipt;
    //         if (receipt) {
    //             await finishTransaction(purchase, false);
    //             completePurchase(purchase, () => {
    //                 toggleProcessing(false);
    //                 const tm = setTimeout(() => {
    //                     console.log("go back->");
    //                     navigation.goBack();
    //                     clearTimeout(tm);
    //                 }, 500);
    //             });
    //             console.log("receipt->", receipt);
    //         }
    //     });
    //     purchaseErrorSubscription = purchaseErrorListener((error) => {
    //         console.log("purchaseErrorListener", error);
    //     });
    // };

    useEffect(() => {
        // loadIAPListeners()
        getProductList();
    }, []);

    const getProductList = async () => {
        console.log("init connection ");
        const con = await initConnection();
        console.log("after connection and connection status is ==== >" + con);
        try {
            console.log("insdie try");
            console.log("Before Get Subscriptions");
            const list = await getSubscriptions(IAPSKU);
            setProductList(list)
            console.log("After Get Subscriptions");
            console.log("list of Subscriptions-->" + JSON.stringify(list));
            setLoading(false);
            setProductList(list);
            renderItem()
        } catch (error) {
            alert(error);
            console.log("error product list", error);
            setLoading(false);
        }
    };

    const renderItem = () => {
        console.log(productList[0].description);
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>In App Puchase</Text>
            <TouchableOpacity onPress={() => getProductList()} style={{ justifyContent: "center", alignItems: "center", borderRadius: 20, backgroundColor: "blue", marginTop: 20 }}>
                <Text style={{ fontSize: 16, color: "white", fontWeight: "bold", margin: 20 }}>In App Purhcase</Text>
            </TouchableOpacity>
        </View>
    )

}


export default InAppPurchase