import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
    BarIndicator
} from 'react-native-indicators';
import Video from 'react-native-video';

const { width, height } = Dimensions.get("window");

class Loading extends Component {
constructor () {
	super();

	this.state = {
		loading: true
	}
}
	render() {
		return (
			<View style={{┬ájustifyContent: 'center', alignItems: "center", alignContent: "center", backgroundColor: "#303030" }}>
				<Video  
					resizeMode="stretch"
					repeat
					source={require("./assets/video/splash.mp4")}
					autoplay={true}
					ref={(ref) => {
						this.player = ref
					}}
					muted={true}
					style={styles.coverLoadingVideo}
				/>
				{/* <View style={{┬ájustifyContent: 'center', alignItems: "center", alignContent: "center" }}>
					<BarIndicator count={14} color='#fdd530' />
				</View> */}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	text: {
		fontSize: 100
	},
	coverLoadingVideo: {
        height: "100%",
        width,
        position: "absolute",
        bottom: 0,
        top: 0,
        right: 0,
        left: 0
    }
});

export default Loading;