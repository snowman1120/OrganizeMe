import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, Alert } from 'react-native'
import Constants from './Constants';
const BuildConfig = require('react-native-build-config')
import VersionInfo from 'react-native-version-info';


export const ORGANIZE_ME_APPLICATION_ID = 'com.axsosntech.organizeme'
const ORGANIZE_ME_M_ID = Constants.JWT;



////react-native run-android --variant=qaDebug --appIdSuffix=qa

export default class CompanyUtils extends Component {
  constructor(props) {
    super(props);
  }


  static getCompanyId() {
    console.log("Bundle === >" + VersionInfo.bundleIdentifier);
    if (VersionInfo.bundleIdentifier == ORGANIZE_ME_APPLICATION_ID) {
      console.log(" Running  Organize Me  =>" + ORGANIZE_ME_M_ID);
      return ORGANIZE_ME_M_ID;

    }
    else {
      console.log("Default InternetCart ");
      return 1;
    }

  }




}