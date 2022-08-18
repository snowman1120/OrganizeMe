import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, Alert } from 'react-native'
import Constants from './Constants';
import CompanyUtils from './CompanyUtils';

export default class Http extends Component {
    constructor(props) {
        super(props);
    }

    static post = async (endpoint, data) => {
        return axios.post(Constants.BASE_URL + endpoint, data,
            {
                headers: {
                    jwt: CompanyUtils.getCompanyId()
                },

            })

    }
    static postConversation = async (endpoint, data) => {
        return axios.post(endpoint, data,)

    }
    static PostImage = (endpoint, data) => {

        return fetch(Constants.BASE_URL + endpoint, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            },
            body: data,
        });

    }
    static get = async (endpoint) => {
        return axios.get(Constants.BASE_URL + endpoint,
            {
                headers: {
                    jwt: CompanyUtils.getCompanyId()
                }
            }
        )

    }
    static getOldChats = async (endpoint) => {
        console.log("Axios get old chats");
        return axios.get(Constants.END_POINT_ALL_CONVERSATION_URL + endpoint,
            {
                headers: {
                    jwt: CompanyUtils.getCompanyId()
                }
            }
        )

    }



}