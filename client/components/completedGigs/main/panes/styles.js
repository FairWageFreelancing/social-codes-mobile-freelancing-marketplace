import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
    containerOutter: {
        backgroundColor: "white"
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10
    },
    header: {
        backgroundColor: "white"
    },
    blackText: {
        color: "black"
    },
    slideItem: {
        width,
        height: "100%"  
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left"
    },
    subContainer: {
        margin: 15
    },
    goldText: {
        color: "#ffd530",
        fontWeight: "bold"
    },
    whiteText: {
        color: "white"
    },
    switchedText: {
        marginLeft: 20,
        fontWeight: "bold"
    },
    boxed: {
        borderWidth: 3,
        margin: 15,
        borderColor: "brown",
        backgroundColor: "#303030",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        minHeight: 55,
        minWidth: 250
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row"
    }
})