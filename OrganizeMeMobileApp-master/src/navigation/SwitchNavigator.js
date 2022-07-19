import React, { Component } from "react";
import { View, Text, Alert } from "react-native";
import Role from "../utils/Role";
import Session from "../utils/Session";
import Utils from "../utils/Utils";
import Route from "./Route";


export default class SwitchNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static navigate(props, from) {
        console.log(" props =>" + JSON.stringify(props));
        if (from == Route.ROUTE_FROM_LOGIN || from == Route.Route_FROM_WELCOME) {

            props.navigation.replace("Login")
            // if (Session.userObj["roleType"] == Role.ROLE_CUSTOMER) {
            //     console.log("om");
            //     props.navigation.replace("Drawer");

            // } else if (Session.userObj["roleType"] == Role.ROLE_COMPANY_ADMIN) {
            //     console.log("BA");
            //     props.navigation.replace("AdminDrawer");
            // } else if (Session.userObj["roleType"] == Role.ROLE_COMPANY_TECHNICIAN) {


            // }
            // else if (Session.userObj["roleType"] == Role.ROLE_BRANCH_ADMIN) {


            // }
            // else if (Session.userObj["roleType"] == Role.ROLE_BRANCH_TECHNICIAN) {
            //     console.log("BT");
            //     props.navigation.replace("AgentDrawer");
            // }
            // else {
            //     console.log("Welcome");
            //     props.navigation.replace("Welcome");
            // }
        }

    }
}
