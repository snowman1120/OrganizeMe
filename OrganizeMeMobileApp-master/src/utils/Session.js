class Session {
  static userObj = [];
  static appSettings = [];
  static companySettings = [];
  static companyPackages = [];
  static userObj = [];
  static imgs = '';
  static docObj = [];
  static conversationId = '';

  static cleanConversationId() {
    this.conversationId = '';
  }

  static cleanImgs() {
    this.imgs = [];
  }
  static cleanUserPackage() {
    this.userPackage = {
      userId: "",
      packageId: "",
      purchasedObject: ""
    }
  }

  static conversation = {
    senderId: '',
    receiverId: '',
    senderName: '',
    receiverName: '',
    conversationName: '',
    senderImgUrl: '',
    receiverImgUrl: '',
  };
  static updateProfile = {
    userId: 1,
    userName: 'sample string 2',
    phone: 'sample string 3',
    password: 'sample string 4',
    imageUrl: 'sample string 5',
    email: 'sample string 6',
    country: 'sample string 7',
  };

  static tokens = {
    userId: '',
    deviceToken: '',
  };

  static signInObj = {
    email: '',
    password: '',
  };
  static signUpObj = {
    userName: '',
    email: '',
    phone: '',
    countryCode: 'USA',
    countryName: 'America',
    countryPhoneCode: '+1',
    roleId: '2',
    authId: '1',
    password: '',
    gender: 'male',
  };
  static socialSignInObj = {
    authId: '2',
    roleId: '2',
    authToken: '',
    faceBookUserId: '',
  };
  static userPackage = {
    userId: '',
    packageId: '',
    purchasedObject: ''
  };
  static cleanUserObj() {
    this.userObj = [];
  }
  static checkListData = [];
}

export default Session;
