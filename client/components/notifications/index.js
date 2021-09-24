import React, { Component, Fragment } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList, 
    ScrollView,
    Platform
} from 'react-native';
import { Header, Left, Body, Right, Button, Title, Subtitle } from 'native-base';
import styles from './styles.js';
import { connect } from 'react-redux';
import axios from "axios";
import Config from "react-native-config";
import moment from 'moment';
import _ from 'lodash';
import Video from 'react-native-video';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Dialog from "react-native-dialog";
import Modal from 'react-native-modal';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AwesomeButtonBlue from 'react-native-really-awesome-button/src/themes/blue';


class NotificationsMainPageHelper extends Component {
constructor(props) {
    super(props);

        this.state = {
            notifications: [],
            modalVisible: false,
            isVisible: false,
            notification: null,
            ready: false
        }
}
    componentDidMount() {
        axios.get(`${Config.ngrok_url}/gather/notifications`, {
            params: {
                id: this.props.unique_id
            }
        }).then((res) => {
            if (res.data.message === "Gathered notifications!") {
                console.log(res.data);

                const { notifications } = res.data;

                this.setState({
                    notifications,
                    ready: true
                }, () => {
                    if (typeof notifications !== "undefined" && notifications.length > 0) {
                        this.flatListRef.scrollToIndex({ animated: true, index: notifications.length - 1 });
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    onSwipeLeft = (gestureState) => {
        console.log("gestureState", gestureState);

        this.setState({
            modalVisible: true
        })
    }
    renderPhotoOrVideo = (notification) => {
        console.log("notification", notification);
        if (notification.profilePics !== null && typeof notification.profilePics !== 'undefined' && notification.profilePics.length > 0) {
            if (notification.profilePics[notification.profilePics.length - 1].type === "video") {
                const picture = notification.profilePics[notification.profilePics.length - 1].picture;
                return (
                    <Video  
                        resizeMode="cover"
                        repeat
                        source={{ uri: `${Config.wasabi_url}/${picture}` }}   // Can be a URL or a local file.
                        autoplay={true}
                        ref={(ref) => {
                            this.player = ref
                        }}
                        muted={true}
                        style={styles.avatar}
                    />
                );
            } else {
                const picture = notification.profilePics[notification.profilePics.length - 1].picture;

                return <Image source={{ uri: `${Config.wasabi_url}/${picture}` }} style={styles.avatar} />;
            }
        } else if (_.has(notification, "photo") && notification.photo !== null) {
            return <Image source={{ uri: notification.photo }} style={styles.avatar} />;
        } else {
            return <Image source={{ uri: Config.no_image_avaliable }} style={styles.avatar} />;
        }
    }
    lookupNotificationVideoCall = (notification) => {

        const interviewID = notification.data.data.interviewID;

        axios.get(`${Config.ngrok_url}/get/interview/fetch/single/notifications`, {
            params: {
                interviewID,
                id: this.props.unique_id
            }
        }).then((res) => {
            if (res.data.message === "Located interview!") {

                console.log(res.data);

                const { interview } = res.data;

                this.props.props.navigation.push("activate-video-call-prescreen", { interview })
            } else {
                console.log("err locating interview", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    clickedNotification = (notification) => {
        axios.post(`${Config.ngrok_url}/mark/notification/read`, {
            notification,
            id: this.props.unique_id
        }).then((res) => {
            if (res.data.message === "Marked!") {
                console.log(res.data);

                const { notifications } = res.data;

                this.setState({
                    notifications
                }, () => {
                    if (notification.link === "job") {
                        this.props.props.navigation.push("view-job-individual", { item: notification.job });
                    } else if (notification.link === "friend-request") {
                        this.props.props.navigation.push("friends-pending");
                    } else if (notification.link === "interview") {
                        this.props.props.navigation.push("manage-all-active-proposal-related");
                    } else if (notification.link === "video-conference") {
                        this.lookupNotificationVideoCall(notification);
                    } else if (notification.link === "files-pending-project") {
                        this.lookupNotificationFile(notification);
                    } else if (notification.link === "accepted-job-interview") {
                        this.props.props.navigation.push("active-live-jobs-main");
                    } else if (notification.link === "started-group-chat") {
                        this.props.props.navigation.push("group-conversation-thread", { conversation: notification.data.data });
                    } else if (notification.link === "accepted-job-interview") {

                    } else if (notification.link === "submitted-work") {

                    } else if (notification.link === "reviews") {
                        
                    }
                })
            } else {
                console.log("err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    lookupNotificationFile = (notification) => {
        axios.get(`${Config.ngrok_url}/locate/specific/active/job`, {
            params: {
                withWho: notification.data.data.with,
                jobID: notification.data.data.jobID,
                id: this.props.unique_id
            }
        }).then((res) => {
            if (res.data.message === "Successfully gathered more info!") {

                const { item } = res.data;

                this.props.props.navigation.push("individual-active-gig-manage", { item });
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    deleteNotification = () => {
        const { notification } = this.state;

        console.log("notification", notification);

        axios.post(`${Config.ngrok_url}/delete/notification`, {
            id: this.props.unique_id,
            notification
        }).then((res) => {
            if (res.data.message === "Deleted Notification!") {
                console.log(res.data);

                const { notifications } = res.data;

                this.setState({
                    notifications
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    renderFlatList = () => {
        const { notifications } = this.state;
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        if (typeof notifications !== "undefined" && notifications.length > 0) {
            return (
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    inverted={true}
                    style={styles.root}
                    data={notifications}
                    extraData={this.state}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={styles.separator}/>
                        )
                    }}
                    keyExtractor={(item)=>{
                        return item._id;
                    }}
                    onScrollToIndexFailed={info => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            if (typeof notifications !== "undefined" && notifications.length > 0) {
                                this.flatListRef.scrollToIndex({ animated: true, index: notifications.length - 1 });
                            }
                        });
                    }}
                    renderItem={(item) => {
                        const Notification = item.item;
                        
                        console.log("Notification", Notification);

                        let attachment = <View/>;

                        let mainContentStyle = styles.mainContentTwo;
                        if(Notification.attachment) {
                            mainContentStyle = styles.mainContent;
                            attachment = <Image style={styles.attachment} source={{uri:Notification.attachment}}/>
                        }
                        return (
                            <GestureRecognizer
                                onSwipeLeft={(state) => {
                                    this.setState({
                                        notification: Notification
                                    }, () => {
                                        this.onSwipeLeft(state);
                                    })
                                }}
                                config={config}
                                style={{
                                    
                                }}
                            >
                                <TouchableOpacity onPress={() => {
                                    if (Notification.link === "friend-request") {
                                        this.clickedNotification(Notification);
                                    } else {
                                        this.clickedNotification(Notification);
                                    }
                                }} style={_.has(Notification, "read") && Notification.read === true ? styles.blueContainer : styles.container}>
                                {this.renderPhotoOrVideo(Notification)}
                                <View style={styles.content}>
                                    <View style={mainContentStyle}>
                                        <View style={styles.text}>
                                            <Text style={[styles.name, { color: "#0057ff" }]}>{`${Notification.firstName} ${Notification.lastName}`}</Text>
                                            <Text style={_.has(Notification, "read") && Notification.read === true ? { color: "black", fontWeight: "bold" } : styles.whiteText}>{Notification.data.title}</Text>
                                            <Text style={_.has(Notification, "read") && Notification.read === true ? { color: "black", fontWeight: "bold" } : styles.greyLightText}>{Notification.data.body.slice(0, 125)} {typeof Notification.data.body !== "undefined" && Notification.data.body.length > 125 ? "..." : ""}</Text>
                                        </View>
                                        <Text style={styles.timeAgo}>
                                            {moment(Notification.system_date).fromNow()}
                                        </Text>
                                        </View>
                                        {attachment}
                                    </View>
                                </TouchableOpacity>
                            </GestureRecognizer>
                        );
                }}/>
            );
        } else {
            return (
                <Fragment>
                    <ScrollView style={styles.background}>
                        <Image source={require("../../assets/images/7.png")} resizeMode={"contain"} style={styles.myImage} />
                        <View style={{ marginTop: 20 }} />
                        <Text style={styles.headText}>Oh no! You don't have any new or pending notifications, interact with the community and get the ball rolling...!</Text>
                        <View style={{ marginTop: 30 }} />
                        <AwesomeButtonBlue borderColor={"#141414"} borderWidth={2} style={{ zIndex: -1 }} type={"primary"} backgroundColor={"#ffffff"} backgroundPlaceholder={"black"} backgroundProgress={"black"} textColor={"black"} shadowColor={"grey"} onPress={() => {
                            this.props.props.navigation.push("jobs-homepage");
                        }} stretch={true}>Apply to jobs</AwesomeButtonBlue>
                        <View style={{ marginTop: 5 }} />
                    </ScrollView>
                </Fragment>
            );
        }
    }
    render() {
        const { ready } = this.state;
        return (
            <View style={styles.blackBackground}>
                <Header style={{ backgroundColor: "#303030" }}>
                    <Left>
                        <Button onPress={() => {
                            this.props.props.navigation.goBack();
                        }} transparent>
                            <Image source={require("../../assets/icons/go-back.png")} style={[styles.headerIcon, { tintColor: "#ffffff" }]} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: "#ffffff" }}>Notifications</Title>
                        <Subtitle style={{ color: "#ffffff" }}>Changes & More...</Subtitle>
                    </Body>
                    <Right>
                        <Button onPress={() => {
                            this.setState({
                                isVisible: true
                            })
                        }} transparent>
                            <Image source={require("../../assets/icons/help.png")} style={[styles.headerIconTwo, { tintColor: "#ffffff" }]} />
                        </Button>
                    </Right>
                </Header> 
                <Modal isVisible={this.state.isVisible}>
                    <View style={styles.customModalBody}>
                        <Text style={styles.hintText}>HINT: Swipe LEFT on a notification to delete it from your notification list/feed. This will however permenantly delete the notification.</Text>
                        <Image source={require("../../assets/icons/swipe.png")} style={styles.swipeIcon} />
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isVisible: false
                            })
                        }} style={styles.closeTouch}>
                            <Image source={require("../../assets/icons/close.png")} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View>
                    <Dialog.Container visible={this.state.modalVisible}>
                    <Dialog.Title>Are you sure you'd like to delete this notification?</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this notification? This action cannot be un-done.
                    </Dialog.Description>
                    <Dialog.Button onPress={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }} label="Cancel" />
                    <Dialog.Button onPress={() => {
                        this.setState({
                            modalVisible: false
                        }, () => {
                            this.deleteNotification();
                        })
                    }} label="DELETE" />
                    </Dialog.Container>
                </View>
                {ready === true ? this.renderFlatList() : <Fragment>
                <SkeletonPlaceholder>
                    <View style={{ width: "100%", height: 125 }} />    
                </SkeletonPlaceholder>
                <View style={{ marginTop: 20 }} /><SkeletonPlaceholder>
                    <View style={{ width: "100%", height: 125 }} />    
                </SkeletonPlaceholder>
                <View style={{ marginTop: 20 }} /><SkeletonPlaceholder>
                    <View style={{ width: "100%", height: 125 }} />    
                </SkeletonPlaceholder>
                <View style={{ marginTop: 20 }} /><SkeletonPlaceholder>
                    <View style={{ width: "100%", height: 125 }} />    
                </SkeletonPlaceholder>
                <View style={{ marginTop: 20 }} /><SkeletonPlaceholder>
                    <View style={{ width: "100%", height: 125 }} />    
                </SkeletonPlaceholder>
                <View style={{ marginTop: 20 }} /></Fragment>}
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        unique_id: state.signupData.authData.unique_id
    }
}
export default connect(mapStateToProps, {  })(NotificationsMainPageHelper);