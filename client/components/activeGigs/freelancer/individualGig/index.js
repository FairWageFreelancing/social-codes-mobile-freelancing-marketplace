import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Header, Left, Body, Right, Title, Subtitle, Button, Text as NativeText, List, ListItem, Icon, Thumbnail } from 'native-base';
import styles from './styles.js';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import SheetHelperPaymentsDisplayRef from "./sheets/payments/payments.js";
import moment from "moment";
import SubmitWorkRefPane from "./sheets/submittingWork/index.js";
import { connect } from "react-redux";
import Config from "react-native-config";
import Modal from 'react-native-modal';
import ProgressiveImage from "../../../lazyLoadImage.js";
import FileViewer from 'react-native-file-viewer';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import { saveFilesPane } from "../../../../actions/work/index.js";
import axios from "axios";
import Dialog from "react-native-dialog";
import GestureRecognizer from 'react-native-swipe-gestures';

class ViewJobActiveClientFreelancerHelper extends Component {
constructor(props) {
    super(props);

    this.state = {
        modalVisible: false,
        selected: null,
        videoModalVisible: false,
        confirmationCompleteModal: false,
        questionModal: false,
        selectedFile: null,
        selectedItem: null,
        application: {
            links: [],
            note: ""
        }
    }
    this.paymentsRef = React.createRef(null);
    this.submitWorkRef = React.createRef(null);
}
    componentDidMount() {
        const passedData = this.props.props.route.params.item;

        axios.get(`${Config.ngrok_url}/gather/uploaded/files`, {
            params: {
                id: this.props.unique_id,
                passedID: passedData.id
            }
        }).then((res) => {
            if (res.data.message === "Gathered files!") {
                console.log(res.data);

                const { files } = res.data;

                this.props.saveFilesPane([...files]);
            } else {
                console.log("Err" , res.data);
            }
        }).catch((err) => {
            console.log(err);
        })

        axios.get(`${Config.ngrok_url}/gather/application/data`, {
            params: {
                id: this.props.unique_id,
                passedID: passedData.id
            }
        }).then((res) => {
            if (res.data.message === "Gathered data!") {

                const { application } = res.data;

                console.log(res.data);

                this.setState({
                    application
                })
            } else {
                console.log("Err" , res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    deleteItem = (file) => {

        const passedData = this.props.props.route.params.item;

        axios.put(`${Config.ngrok_url}/delete/file/from/application`, {
            file,
            id: this.props.unique_id,
            otherUserID: passedData.with,
            passedID: passedData.id
        }).then((res) => {
            if (res.data.message === "Removed/deleted file!") {
                console.log(res.data);

                this.props.saveFilesPane(this.props.files.filter((element) => {
                    if (element.id !== file.id) {
                        return element;
                    }
                }));
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    markJobAsComplete = () => {
        console.log("markJobAsComplete clicked...");

        const passedData = this.props.props.route.params.item;

        axios.post(`${Config.ngrok_url}/complete/freelance/gig/half/freelancer`, {
            id: this.props.unique_id,
            activeID: passedData.id,
            otherUserID: passedData.with
        }).then((res) => {
            if (res.data.message === "Successfully updated users accounts and posted notification!") {
                console.log(res.data);

                Toast.show({
                    text1: 'You have successfully marked your half of this job complete!',
                    text2: 'Please wait for the other user to confirm before funds will be released...',
                    type: "success",
                    visibilityTime: 4500,
                    position: "top"
                });
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    deleteLinkUrl = (linkID) => {
        const passedData = this.props.props.route.params.item;

        axios.put(`${Config.ngrok_url}/delete/link/url`, {
            linkID,
            activeID: passedData.id,
            id: this.props.unique_id,
            otherUserID: passedData.with,
            fullName: this.props.fullName,
            jobID: passedData.jobID
        }).then((res) => {
            if (res.data.message === "Deleted!") {

                const { links } = res.data;

                this.setState({
                    application: {
                        ...this.state.application,
                        links
                    }
                })
                console.log(res.data);
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    render() {
        // console.log(this.props.props.route.params.item);
        console.log("this.state freelancer index.js", this.state);

        const { selected, modalVisible, videoModalVisible, questionModal, confirmationCompleteModal, application, selectedItem } = this.state;

        const configSwipe = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        
        const passedData = this.props.props.route.params.item;
        return (
            <Fragment>
                <Header style={{ backgroundColor: "#303030" }}>
                    <Left>
                        <Button onPress={() => {
                            this.props.props.navigation.goBack();
                        }} transparent>
                            <Image source={require("../../../../assets/icons/go-back.png")} style={styles.headerIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.goldText}>Manage</Title>
                        <Subtitle style={styles.goldText}>Manage your active gig</Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Toast ref={(ref) => Toast.setRef(ref)} />
                <View>
                    <Dialog.Container visible={questionModal}>
                    <Dialog.Title>Are you sure you'd like to delete this file?</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete/remove this file? You cannot undo this action.
                    </Dialog.Description>
                    <Dialog.Button onPress={() => {
                        this.setState({
                            questionModal: false
                        })
                    }} label="Cancel" />
                    <Dialog.Button onPress={() => {
                        this.setState({
                            questionModal: false
                        }, () => {
                            this.deleteItem(this.state.selectedFile);
                        })
                    }} label="Delete" />
                    </Dialog.Container>
                </View>
                <View>
                    <Dialog.Container visible={confirmationCompleteModal}>
                    <Dialog.Title>Are you sure you'd like to mark this project as complete?</Dialog.Title>
                    <Dialog.Description>
                        Once you mark this project as complete, it will be registered and validated permanently... Would you like to continue?
                    </Dialog.Description>
                    <Dialog.Button onPress={() => {
                        this.setState({
                            confirmationCompleteModal: false
                        })
                    }} label="Cancel" />
                    <Dialog.Button onPress={() => {
                        this.setState({
                            confirmationCompleteModal: false
                        }, () => {
                            this.markJobAsComplete();
                        })
                    }} label="Mark Complete" />
                    </Dialog.Container>
                </View>
                {selected !== null ? <Modal isVisible={modalVisible}>
                    <View style={styles.modal}>
                        <View style={styles.margin}>
                            <ProgressiveImage source={{ uri: `${Config.wasabi_url}/${selected.fileName}` }} style={styles.modalPicOrVideo} />
                        </View>
                    </View>
                    <AwesomeButtonCartman type={"anchor"} textColor={"white"} onPress={() => {
                        this.setState({
                            modalVisible: false
                        });
                    }} stretch={true}>Close Preview</AwesomeButtonCartman>
                </Modal> : null}
                {selected !== null ? <Modal isVisible={videoModalVisible}>
                    <View style={styles.modal}>
                        <View style={styles.margin}>
                            <Video source={{ uri: `${Config.wasabi_url}/${selected.fileName}` }}
                                ref={(ref) => {
                                    
                                }}
                                loop
                                autoPlay
                                style={styles.modalPicOrVideo} 
                            />
                        </View>
                    </View>
                    <AwesomeButtonCartman type={"anchor"} textColor={"white"} onPress={() => {
                        this.setState({
                            videoModalVisible: false
                        });
                    }} stretch={true}>Close Preview</AwesomeButtonCartman>
                </Modal> : null}
                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
                    <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            Contract with {passedData.otherUserFirstName} {passedData.otherUserLastName}
                        </Text>
                    </View>

                    <View style={styles.postContent}>
                        <Text style={styles.postTitle}>
                            This is the place where you will be able to manage uploads, content trading, payments and much more...
                        </Text>
                        <View style={styles.greyHr} />
                        <Text style={styles.postDescription}>
                            Please use this page to upload completed work (zip files, code, images, etc...) and manage your job and much more... Click payments to see what payments the client has deposited prior to submitting any work. Make sure the client has deposited funds <Text style={{ textDecorationLine: "underline" }}>before</Text> so you know funds will be released upon both parties agreeing the work was completed or mediation from <Text style={{ color: "darkred", fontStyle: 'italic' }}>Social Codes</Text> but always try to work things out before contacting us.
                        </Text>

                        <Text style={styles.date}>
                            Project started {moment(passedData.systemDate).fromNow()}
                        </Text>
                        <View style={styles.greyHr} />
                        <View style={styles.boxed}>
                            <TouchableOpacity onPress={() => {
                                console.log("clicked");

                                this.submitWorkRef.current.open();
                            }} style={styles.row}>
                                <Image source={require("../../../../assets/icons/ana.png")} style={styles.icon} />
                                <Text style={styles.iconText}>Submit project files and more...</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, marginBottom: 15 }}>
                            <List>
                            {typeof this.props.files !== "undefined" && this.props.files.length > 0 ? this.props.files.map((file, index) => {
                                return (
                                    <Fragment key={index}>
                                        <ListItem style={{ maxHeight: 65 }}>
                                            <Left>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({
                                                        questionModal: true,
                                                        selectedFile: file
                                                    })
                                                }}>
                                                    <Thumbnail style={{ maxWidth: 30, maxHeight: 30, marginRight: 20 }} source={require("../../../../assets/icons/close.png")} />
                                                </TouchableOpacity>
                                                <Text style={{ marginTop: 10 }}>{file.fileName}</Text>
                                            </Left>
                                            <Right>
                                                <TouchableOpacity onPress={() => {
                                                    if (file.type === "application/pdf") {
                                                        const localFile = `${RNFS.DocumentDirectoryPath}/${file.fileName}`;
        
                                                        const options = {
                                                            fromUrl: `${Config.wasabi_url}/${file.fileName}`,
                                                            toFile: localFile
                                                        };
                                                        RNFS.downloadFile(options).promise.then(() => FileViewer.open(localFile)).then(() => {
                                                            // success
                                                        }).catch(error => {
                                                            // error
                                                            Toast.show({
                                                                text1: 'Critical error while trying to open PDF doc...',
                                                                text2: 'Please try this action again or choose a *local* file.',
                                                                type: "error",
                                                                visibilityTime: 4500,
                                                                position: "top"
                                                            });
                                                        });
                                                    } else if (file.type === "video/mp4") {
                                                        this.setState({
                                                            selected: file,
                                                            videoModalVisible: true
                                                        })
                                                    } else {
                                                        this.setState({
                                                            selected: file,
                                                            modalVisible: true
                                                        })
                                                    }
                                                }}>
                                                    <Icon name="arrow-forward" />
                                                </TouchableOpacity>
                                            </Right>
                                        </ListItem>
                                    </Fragment>
                                );
                            }) : null}
                            </List>
                            <View style={{ marginTop: 20 }} />
                            <Text style={{ fontWeight: 'bold', textAlign: 'left', color: "darkred" }}>Note for client</Text>
                            <Text style={styles.note}>{application.note.length === 0 ? "No note entered..." : application.note}</Text>
                            <View style={styles.greyHr} />
                            <Text style={{ fontWeight: 'bold', textAlign: 'left', color: "darkred" }}>Links submitted for client</Text>
                            {application.links.length !== 0 ? application.links.map((link, index) => {
                                return (
                                    <GestureRecognizer
                                        onSwipeLeft={(state) => {
                                            console.log("Swipped left");

                                            this.setState({
                                                selectedItem: link
                                            })
                                        }}
                                        config={configSwipe}
                                        style={{
                                            flex: 1,
                                            backgroundColor: this.state.backgroundColor
                                        }}
                                        >
                                        <ListItem selected>
                                            <Left>
                                                <Text>{link.link}</Text>
                                            </Left>
                                            {selectedItem !== null && selectedItem.id === link.id ? <Right>
                                                <TouchableOpacity onPress={() => {
                                                    this.deleteLinkUrl(link.id);
                                                }}>
                                                    <Icon style={{ color: "red" }} type="FontAwesome" name="trash" />
                                                </TouchableOpacity>
                                            </Right> : <Right>
                                                <Icon type="FontAwesome" name="arrow-left" />
                                            </Right>}
                                        </ListItem>
                                    </GestureRecognizer>
                                );
                            }) : <Text>No links entered or found...</Text>}
                        </View>
                        <Text style={styles.with}>With...</Text>
                        <View style={styles.profile}>
                            {passedData.type === "picture" ? <Image style={styles.avatar}
                            source={{uri: passedData.photo }}/> : null}

                            <Text style={styles.name}>
                                {passedData.otherUserFirstName} {passedData.otherUserLastName} {"\n"}aka {passedData.otherUserUsername}
                            </Text>
                        </View>
                        <SubmitWorkRefPane passedData={passedData} submitWorkRef={this.submitWorkRef} props={this.props} /> 
                        <SheetHelperPaymentsDisplayRef payments={passedData.payments} props={this.props} paymentsRef={this.paymentsRef} />
                        <AwesomeButtonCartman style={{ marginTop: 20 }} type={"anchor"} textColor={"white"} onPress={() => {
                            this.paymentsRef.current.open();
                        }} stretch={true}>View payments from client</AwesomeButtonCartman>
                        <View style={styles.greyHr} />
                        <Text style={styles.direction}>If both parties (freelancer and client alike) agree the job is completed and the work submitted is sufficient, you should mark the job complete by clicking the button below. Once both users have confirmed the job is complete, <Text style={{ color: "darkred", fontWeight: "bold" }}>funds with be fully released from pending state</Text>..</Text>
                        <AwesomeButtonCartman style={{ marginTop: 20 }} type={"anchor"} backgroundShadow={"#ffd530"} textColor={"white"} onPress={() => {
                            this.setState({
                                confirmationCompleteModal: true
                            })
                        }} stretch={true}>Mark project as complete</AwesomeButtonCartman>
                    </View>
                    </View>
                </ScrollView>
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        files: state.savedFiles.filesSaved,
        unique_id: state.signupData.authData.unique_id,
        fullName: `${state.signupData.authData.firstName} ${state.signupData.authData.lastName}`
    }
}
export default connect(mapStateToProps, { saveFilesPane })(ViewJobActiveClientFreelancerHelper);
