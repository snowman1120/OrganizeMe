class Session {
    static userObj = [];
    static appSettings = [];
    static companySettings = [];
    static companyPackages = [];
    static userObj = [];
    static imgs = ""
    static docObj = []


    static cleanImgs() {
        this.imgs = []
    }

    static conversation = {
        senderId: "",
        receiverId: "4",
        senderName: "",
        receiverName: "Dr. David Adams",
        conversationName: ""
    }
    static updateProfile = {
        userId: 1,
        userName: "sample string 2",
        phone: "sample string 3",
        password: "sample string 4",
        imageUrl: "sample string 5",
        email: "sample string 6",
        country: "sample string 7"
    }

    static tokens = {
        userId: "",
        deviceToken: ""
    }

    static signInObj = {
        email: "",
        password: ""
    }
    static signUpObj = {
        userName: "",
        email: "",
        phone: "",
        countryCode: "",
        countryName: "",
        countryPhoneCode: "",
        roleId: "2",
        authId: "1",
        password: ""
    }
    static socialSignInObj = {
        authId: "2",
        roleId: "2",
        authToken: ""
    }
    static userPackage = {
        userId: "",
        packageId: ""
    }
    static cleanUserObj() {
        this.userObj = []
    }
    static checkListData = [];
}

export default Session;