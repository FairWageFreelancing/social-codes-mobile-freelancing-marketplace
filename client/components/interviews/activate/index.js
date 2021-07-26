import React, { Fragment, Component } from 'react';
import styles from './styles.js';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Header, Left, Body, Right, Title, Subtitle, Button, Text as NativeText } from 'native-base';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import axios from 'axios';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import Dialog from "react-native-dialog";
import Toast from 'react-native-toast-message';


const months = ["", "January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


class ActivateVideoCallHelper extends Component {
constructor(props) {
    super(props);

    this.state = {
        hide: false,
        ready: false
    }
}
    calculateDay = (day) => {
        if (day === 1 || day === 21 || day === 31) {
            return `${day}st`;
        } else if (day === 2 || day === 22) {
            return `${day}nd`;
        } else if (day === 3 || day === 23) {
            return `${day}rd`;
        } else {
            return `${day}th`;
        }
    }
    viewJobListing = (jobID) => {
        axios.get(`${Config.ngrok_url}/gather/individual/job/listing`, {
            params: {
                jobID
            }
        }).then((res) => {
            if (res.data.message === "Successfully located listing!") {

                const { job } = res.data;

                this.props.props.navigation.push("view-job-individual", { item: job });
            } else {
                console.log("err", res.data);

                Toast.show({
                    type: "error",
                    position: "top",
                    visibilityTime: 4500,
                    text1: "ERROR OCCURRED RETRIEVING JOB.",
                    text2: "An error occurred while trying to gather this specific job data, please try again or refresh the page..."
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    hireApplicant = () => {
        console.log("hire user...");

        const interview = this.props.props.route.params.interview;

        axios.post(`${Config.ngrok_url}/hire/applicant/job`, {
            id: this.props.unique_id,
            interview,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            username: this.props.username,
            interviewID: interview.id
        }).then((res) => {
            if (res.data.message === "Hired user!") {
                console.log(res.data);

                this.setState({
                    hide: false
                }, () => {
                    setTimeout(() => {
                        Toast.show({
                            type: "success",
                            position: "top",
                            visibilityTime: 4500,
                            text1: "SUCCESSFULLY HIRED APPLICANT!",
                            text2: "You've successfully hired this applicant and they have been notified! Congrats!"
                        })
                    }, 1000)
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    componentDidMount() {
        const interview = this.props.props.route.params.interview;
        
        axios.get(`${Config.ngrok_url}/gather/user`, {
            params: {
                id: this.props.unique_id
            }
        }).then((res) => {
            if (res.data.message === "Located the desired user!") {

                console.log(res.data);

                const { user } = res.data;

                console.log("interview !~!!", interview);
                
                if (interview.hostID === this.props.unique_id) {

                    const promise = new Promise((resolve, reject) => {
                        if (typeof user.activeHiredApplicants !== "undefined" && user.activeHiredApplicants.length > 0) {
                            for (let index = 0; index < user.activeHiredApplicants.length; index++) {
                                const applicant = user.activeHiredApplicants[index];
                                if (applicant.with === interview.with) {
                                    resolve(true);
                                }
                                if ((user.activeHiredApplicants.length - 1) === index) {
                                    resolve(false);
                                }
                            }
                        } else {
                            resolve(false);
                        }
                    })

                    promise.then((passedData) => {
                        this.setState({
                            user,
                            ready: true,
                            hide: passedData === true ? false : user.activeJobs.includes(interview.jobID)
                        })
                    })  
                } else {
                    console.log("This one ran...")
                    this.setState({
                        user,
                        ready: true,
                        hide: false
                    })
                }
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    checkIfCardsRegistered = () => {

        axios.get(`${Config.ngrok_url}/check/active/debit/credit/cards`, {
            params: {
                id: this.props.unique_id
            }
        }).then((res) => {
            if (res.data.message === "User HAS REGISTERED a card already!") {
                this.setState({
                    showHireDialog: true
                })
            } else {
                console.log("err", res.data);

                Toast.show({
                    type: "error",
                    position: "top",
                    visibilityTime: 4500,
                    text1: "You MUST register a debit/credit card before proceeding to hire this user...",
                    text2: "You MUST have a payment method on file before hiring/proceeding with this user, Please add a payment method and try again!"
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    render () {
        const interview = this.props.props.route.params.interview;

        const { hide, ready } = this.state;

        console.log("interview:", this.props.props.route.params.interview, "this.state:", this.state);
        return (
            <Fragment>
                <Header style={{ backgroundColor: "#303030" }}>
                    <Left>
                        <Button onPress={() => {
                            this.props.props.navigation.goBack();
                        }} transparent>
                            <Image source={require("../../../assets/icons/go-back.png")} style={styles.headerIcon} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={styles.goldText}>Initiate</Title>
                        <Subtitle style={styles.goldText}>Interview with {interview.firstName} {interview.lastName}</Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Toast ref={(ref) => Toast.setRef(ref)} />
                <View>
                    <Dialog.Container visible={this.state.showHireDialog}>
                    <Dialog.Title>Are you sure you'd like to hire this applicant?</Dialog.Title>
                    <Dialog.Description>
                        Once you select this applicant for your pending job, you will not be able to undo this action or select other freelancers if your job only requests one (1) worker.
                    </Dialog.Description>
                    <Dialog.Button onPress={() => {
                        this.setState({
                            showHireDialog: false
                        })
                    }} label="Cancel" />
                    <Dialog.Button onPress={() => {
                        this.setState({
                            showHireDialog: false
                        }, () => {
                            this.hireApplicant();
                        })
                    }} label="HIRE" />
                    </Dialog.Container>
                </View>
                <View style={styles.container}>
                    <View style={styles.margin}>
                        <Text style={styles.largeText}>You're about to interview with <Text style={{ color: "darkblue" }}>{interview.firstName} {interview.lastName}</Text> with the username of <Text style={{ color: "darkblue" }}>{interview.username}</Text></Text>
                        <View style={styles.hr} />
                        <Text style={[styles.description, { marginTop: 10, marginBottom: 10 }]}>On {months[interview.day.month]} {this.calculateDay(interview.day.day)}, {interview.day.year}</Text>
                        <Text style={[styles.date, { marginBottom: 20 }]}>Scheduled for {interview.fullTime}</Text>
                        <View style={styles.hr} />
                        <TouchableOpacity style={styles.touchContainer} onPress={() => {
                            this.viewJobListing(interview.jobID);
                        }}>
                            <Text style={styles.touch}>|   View Job Listing   |</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottom}>
                        {hide === true && ready === true ? <AwesomeButtonCartman type={"anchor"} textColor={"black"} backgroundColor={"#ffd530"} onPress={() => {
                            this.checkIfCardsRegistered();
                        }} stretch={true}>Hire Applicant</AwesomeButtonCartman> : null}
                        <View style={{ marginTop: 30 }} />
                        <AwesomeButtonCartman type={"anchor"} textColor={"white"} onPress={() => {
                            this.props.props.navigation.push("video-call-live-active-peer-to-peer-interview", { interview });
                        }} stretch={true}>Initiate Video Call</AwesomeButtonCartman>
                    </View>
                </View>
                
            </Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        unique_id: state.signupData.authData.unique_id,
        firstName: state.signupData.authData.firstName,
        lastName: state.signupData.authData.lastName,
        username: state.signupData.authData.username
    }
}
export default connect(mapStateToProps, {  })(ActivateVideoCallHelper);