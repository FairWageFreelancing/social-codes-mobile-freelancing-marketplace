
import React from "react";
import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const screenHeight = Dimensions.get("screen").height;

export default StyleSheet.create({
    container:{
        flex:1, 
        backgroundColor: 'white',
    },
    headerProfilePic: {
        maxWidth: 50, 
        borderRadius: 120,
        maxHeight: 50,
        marginRight: 10
    },
    title: {
        fontSize: 30,
        width: 100,
        marginLeft: 0,
        color: "#ffffff"
    },
    goldText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    greyButton: {
        backgroundColor: "#303030"
    },
    columnLeft: {
        width: width * 0.20
    },
    topHeader: {
        borderBottomColor: "transparent",
        backgroundColor: "#303030",
        height: 60
    },
    topTextSmaller: {

    },
    smallerIcon: {
        maxWidth: 35,
        maxHeight: 35
    },
    topTextSmall: {
        fontWeight: "bold"
    },
    circleMenu: {
        maxWidth: 65,
        maxHeight: 65,
        zIndex: 9999
    },
    bottomRightCorner: {
        position: "absolute",
        bottom: 75,
        right: 20,
        zIndex: 9999
    },
    horizontalScroll: {
        height: 125
    },
    containerStyle: {
        paddingBottom: 25
    },
    rightColumn: {
        width: width * 0.80
    },
    container: {
        width,
        height: "100%",
        backgroundColor: "white",
        flex: 1
    },
    margin: {
        margin: 12
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#f0f0f0",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },
    circleTwo: {
        width: 60,
        minWidth: 60,
        minHeight: 60,
        height: 60,
        margin: 10,
        borderRadius: 30,
        backgroundColor: "#f0f0f0",
        alignItems: 'center',
        alignContent: "center"
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    }
})