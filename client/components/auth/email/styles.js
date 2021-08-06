import React from "react";
import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
    headerIcon: {
        maxWidth: 35,
        maxHeight: 35
    },
    container: {
        zIndex: -1,
        width,
        height,
        backgroundColor: "#141414",
        flex: 1
    },
    goldText: {
        color: "#ffffff"
    },
    margin: {
        margin: 20
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff"
    },
    greyText: {
        color: "#ededed"
    },
    bottomContainer: {
        backgroundColor: "white"
    },
    greenText: {
        color: "#66FF33",
        fontSize: 15,
        marginTop: 15
    },
    redText: {
        color: "red",
        fontSize: 15,
        marginTop: 15
    }
})