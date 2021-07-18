import React, { Component, Fragment } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import styles from './styles.js';
import axios from "axios";
import Config from "react-native-config";
import { Header, Left, Body, Right, Title, Subtitle, Button, Text as NativeText, Thumbnail, List, ListItem, Footer, FooterTab, Badge } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import SlideUpPaymentHelper from "./panes/fixed/slideUpPanePay.js";
import Popover from 'react-native-popover-view';
import Video from 'react-native-video';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import _ from "lodash";
import PayHourlyDepositPaneHelper from "./panes/hourly/payHourlyDeposit.js";

const { width, height } = Dimensions.get("window");

class IndividualActiveJobHelper extends Component {
constructor(props) {
    super(props);

    this.state = {
        job: null
    }
    this.sheetRef = React.createRef();
    this.sheetRefHourly = React.createRef();
}
    componentDidMount() {

        const passedData = this.props.props.route.params.item;

        axios.get(`${Config.ngrok_url}/fetch/specific/job/active`, {
            params: {
                id: this.props.unique_id,
                jobID: passedData.jobID,
                applicant: passedData.with
            }
        }).then((res) => {
            if (res.data.message === "Located specific job!") {
                console.log(res.data);

                const { job } = res.data;

                this.setState({
                    job
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    calculateLength = (duration, date) => {
        switch (duration) {
            case "Less than 1 month":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 30).format("MMMM Do YYYY")} as a payment guarantee...`;
                break;
            case "1 to 3 months":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 30).format("MMMM Do YYYY")} to ${moment(date += 1000 * 60 * 60 * 24 * 90).format("MMMM Do YYYY")} as a payment guarantee...`;
                break;
            case "3 to 6 months":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 90).format("MMMM Do YYYY")} to ${moment(date += 1000 * 60 * 60 * 24 * 180).format("MMMM Do YYYY")} as a payment guarantee...`;
                break;
            case "More than 6 months":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 180).format("MMMM Do YYYY")} or longer as a payment guarantee...`;
                break;
            default:
                break;
        }
    }
    calculateLengthHourly = (duration, date) => {
        const { job } = this.state;

        switch (duration) {
            case "Less than 1 month":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 30).format("MMMM Do YYYY")} as a payment guarantee for a minimum of 5 hours of work clocked at $${Math.round(Number(job.hourlyRate)).toFixed(2)} per hour...`;
                break;
            case "1 to 3 months":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 30).format("MMMM Do YYYY")} to ${moment(date += 1000 * 60 * 60 * 24 * 90).format("MMMM Do YYYY")} as a payment guarantee for a minimum of 5 hours of work clocked at $${Math.round(Number(job.hourlyRate)).toFixed(2)} per hour...`;
                break;
            case "3 to 6 months":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 90).format("MMMM Do YYYY")} to ${moment(date += 1000 * 60 * 60 * 24 * 180).format("MMMM Do YYYY")} as a payment guarantee for a minimum of 5 hours of work clocked at $${Math.round(Number(job.hourlyRate)).toFixed(2)} per hour...`;
                break;
            case "More than 6 months":
                return ` deposit is due by/within ${moment(date += 1000 * 60 * 60 * 24 * 180).format("MMMM Do YYYY")} or longer as a payment guarantee for a minimum of 5 hours of work clocked at $${Math.round(Number(job.hourlyRate)).toFixed(2)} per hour...`;
                break;
            default:
                break;
        }
    } 
    renderQuestions = (jobData) => {
        if (jobData.question4 !== null) {
            return (
                <View>
                    <Text style={[styles.detailsTitle, { marginTop: 25 }]}>Applicant Q&A (replies to original posting questions)</Text>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question0.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question0.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question1.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question1.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question2.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question2.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question3.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question3.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question4.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question4.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                </View>
            );
        } else if (jobData.question3 !== null) {
            return (
                <View>
                    <Text style={[styles.detailsTitle, { marginTop: 25 }]}>Applicant Q&A (replies to original posting questions)</Text>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question0.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question0.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question1.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question1.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question2.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question2.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question3.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question3.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                </View>
            );
        } else if (jobData.question2 !== null) {
            return (
                <View>
                    <Text style={[styles.detailsTitle, { marginTop: 25 }]}>Applicant Q&A (replies to original posting questions)</Text>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question0.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question0.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question1.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question1.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question2.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question2.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                </View>
            );
        } else if (jobData.question1 !== null) {
            return (
                <View>
                    <Text style={[styles.detailsTitle, { marginTop: 25 }]}>Applicant Q&A (replies to original posting questions)</Text>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question0.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question0.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question1.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question1.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                </View>
            );
        } else if (jobData.question0 !== null) {
            return (
                <View>
                    <Text style={[styles.detailsTitle, { marginTop: 25 }]}>Applicant Q&A (replies to original posting questions)</Text>
                    <View style={styles.thinBlackHr} />
                    <Popover
                        from={(
                            <TouchableOpacity>
                                <Text style={{ color: "darkred" }}>{jobData.question0.question}</Text>
                            </TouchableOpacity>
                        )}>
                        <View style={{ padding: 20 }}>
                            <Text>{jobData.question0.answer}</Text>
                        </View>
                    </Popover>
                    <View style={styles.thinBlackHr} />
                </View>
            );
        }
    }
    onButtonPressHourly = () => {
        console.log("clicked.");

        this.sheetRefHourly.current.open();
    }
    renderPayHourlyOrNot = () => {

        const passedData = this.props.props.route.params.item;

        const { job } = this.state;

        if (job !== null) {
            if (job.hourly === true) {
                return (
                    <Fragment>
                        <View style={[styles.centered, { marginTop: 25 }]}>
                            <Text style={styles.mainText}>Make a payment so your client can get started!</Text>
                            <View style={styles.centeredPriceBox}>
                                <View style={styles.margin}>
                                    <Text style={styles.priceText}>$<Text style={{ color: "#ffd530", textDecorationLine: "underline" }}>{Math.round(Number(job.hourlyRate) * 5).toFixed(2)}</Text>{this.calculateLengthHourly(job.duration, passedData.systemDate)}</Text>
                                    <View style={styles.hr} />
                                    <View style={styles.centered}>
                                        <Button onPress={this.onButtonPressHourly} style={styles.greyButton} info>
                                            <Text style={{ color: "#ffd530" }}>Make a payment</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.blackHr} />
                            <View style={styles.margin}>
                                <Text style={styles.detailsTitle}>Details</Text>
                            </View>
                        </View>
                        <List>
                            <ListItem thumbnail>
                                <Left>
                                    {passedData.type === "video" ? <Video source={{uri: passedData.photo }} 
                                    ref={(ref) => {
                                        this.player = ref
                                    }}
                                    style={styles.thumbnailVideo} /> : <Thumbnail style={styles.thumbnailVideo} source={{uri: passedData.photo }} />}
                                </Left>
                                <Body>
                                    <NativeText>Payment will go to {passedData.otherUserFirstName} {passedData.otherUserLastName}</NativeText>
                                    <NativeText note numberOfLines={1}>also known as {passedData.otherUserUsername}</NativeText>
                                </Body>
                                <Right>
                                    <Button onPress={() => {
                                        this.props.props.navigation.push("individual-profile-public", { item: { unique_id: passedData.with }});
                                    }} transparent>
                                        <NativeText>View</NativeText>
                                    </Button>
                                </Right>
                            </ListItem>
                        </List>
                        <View style={styles.margin}>
                            <Text style={styles.milestoneText}>Paying by milestone? {job.payByMilestone === false ? "Nope" : "Yes!"}</Text>
                            <View style={styles.hrCustom} />
                            <Text style={styles.milestoneText}>Client has paid freelancer in-full? <Text style={{ color: "blue" }}>{(this.props.minimumHourlyPaymentCompleted.completed === true && this.props.minimumHourlyPaymentCompleted.jobID === passedData.jobID) || passedData.paidFull === true ? "Full deposit completed for pending completion." : "Full deposit has NOT been received."}</Text></Text>
                            <View style={styles.hrCustom} />
                            <Text style={styles.milestoneText}>Client has made a partial payment to the freelancer(s)? <Text style={{ color: "blue" }}>{(this.props.customPaymentCompleted.completed === true && this.props.customPaymentCompleted.jobID === passedData.jobID) || passedData.paidPartial === true ? "Custom payment has been completed for pending completion!" : "Custom payment has NOT been received."}</Text></Text>
                            {this.renderQuestions(job)}
                        </View>
                    </Fragment>
                ); 
            } else {
                return (
                    <Fragment>
                        <View style={[styles.centered, { marginTop: 25 }]}>
                            <Text style={styles.mainText}>Make a payment so your client can get started!</Text>
                            <View style={styles.centeredPriceBox}>
                                <View style={styles.margin}>
                                    <Text style={styles.priceText}>$<Text style={{ color: "#ffd530", textDecorationLine: "underline" }}>{job.ratePerProjectCompletion}</Text>{this.calculateLength(job.duration, passedData.systemDate)}</Text>
                                    <View style={styles.hr} />
                                    <View style={styles.centered}>
                                        <Button onPress={this.onButtonPress} style={styles.greyButton} info>
                                            <Text style={{ color: "#ffd530" }}>Make a payment</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.blackHr} />
                            <View style={styles.margin}>
                                <Text style={styles.detailsTitle}>Details</Text>
                            </View>
                        </View>
                        <List>
                            <ListItem thumbnail>
                                <Left>
                                    {passedData.type === "video" ? <Video source={{uri: passedData.photo }} 
                                    ref={(ref) => {
                                        this.player = ref
                                    }}
                                    style={styles.thumbnailVideo} /> : <Thumbnail style={styles.thumbnailVideo} source={{uri: passedData.photo }} />}
                                </Left>
                                <Body>
                                    <NativeText>Payment will go to {passedData.otherUserFirstName} {passedData.otherUserLastName}</NativeText>
                                    <NativeText note numberOfLines={1}>also known as {passedData.otherUserUsername}</NativeText>
                                </Body>
                                <Right>
                                    <Button onPress={() => {
                                        this.props.props.navigation.push("individual-profile-public", { item: { unique_id: passedData.with }});
                                    }} transparent>
                                        <NativeText>View</NativeText>
                                    </Button>
                                </Right>
                            </ListItem>
                        </List>
                        <View style={styles.margin}>
                            <Text style={styles.milestoneText}>Paying by milestone? {job.payByMilestone === false ? "Nope" : "Yes!"}</Text>
                            <View style={styles.hrCustom} />
                            <Text style={styles.milestoneText}>Client has paid freelancer in-full? <Text style={{ color: "blue" }}>{(this.props.fullPaymentCompleted.completed === true && this.props.fullPaymentCompleted.jobID === passedData.jobID) || passedData.paidFull === true ? "Full payment completed for pending completion." : "Full payment has NOT been received."}</Text></Text>
                            <View style={styles.hrCustom} />
                            <Text style={styles.milestoneText}>Client has made a partial payment to the freelancer(s)? <Text style={{ color: "blue" }}>{(this.props.partialPaymentCompleted.completed === true && this.props.partialPaymentCompleted.jobID === passedData.jobID) || passedData.paidPartial === true ? "Partial payment has been completed for pending completion!" : "Partial payment has NOT been received."}</Text></Text>
                            {this.renderQuestions(job)}
                        </View>
                        
                    </Fragment>
                );
            }
        } else {
            return (
                <View style={{ margin: 15 }}>
                    <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20 }}>
                        <View style={{ width: width * 0.70, height: 20, borderRadius: 4 }} />
                        <View
                            style={{ marginTop: 6, width: width * 0.55, height: 20, borderRadius: 4 }}
                        />
                        </View>
                    </View>
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 20 }} />
                    <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20 }}>
                        <View style={{ width: width * 0.70, height: 20, borderRadius: 4 }} />
                        <View
                            style={{ marginTop: 6, width: width * 0.55, height: 20, borderRadius: 4 }}
                        />
                        </View>
                    </View>
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 20 }} />
                    <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20 }}>
                        <View style={{ width: width * 0.70, height: 20, borderRadius: 4 }} />
                        <View
                            style={{ marginTop: 6, width: width * 0.55, height: 20, borderRadius: 4 }}
                        />
                        </View>
                    </View>
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 20 }} />
                    <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20 }}>
                        <View style={{ width: width * 0.70, height: 20, borderRadius: 4 }} />
                        <View
                            style={{ marginTop: 6, width: width * 0.55, height: 20, borderRadius: 4 }}
                        />
                        </View>
                    </View>
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 20 }} />
                    <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20 }}>
                        <View style={{ width: width * 0.70, height: 20, borderRadius: 4 }} />
                        <View
                            style={{ marginTop: 6, width: width * 0.55, height: 20, borderRadius: 4 }}
                        />
                        </View>
                    </View>
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 20 }} />
                    <SkeletonPlaceholder>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 60, height: 60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20 }}>
                        <View style={{ width: width * 0.70, height: 20, borderRadius: 4 }} />
                        <View
                            style={{ marginTop: 6, width: width * 0.55, height: 20, borderRadius: 4 }}
                        />
                        </View>
                    </View>
                    </SkeletonPlaceholder>
                </View>
            );
        }
    }
    onButtonPress = () => {
        console.log("clicked.");

        this.sheetRef.current.open();
    }
    renderSheetContent = () => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 16,
                    height: 450,
                }}
                >
                <Text>Swipe down to close</Text>
            </View>
        );
    }
    render() {
        const { job } = this.state;

        console.log(this.props.props.route.params.item);

        const passedData = this.props.props.route.params.item;

        console.log("this.state activeGigs individual index.js state", this.state);
        return (
            <Fragment>
                
                <ScrollView contentContainerStyle={{ paddingBottom: 150 }} style={styles.container}>
                    {job !== null ? <SlideUpPaymentHelper job={job} withID={passedData.with} rate={job.ratePerProjectCompletion} props={this.props} sheetRef={this.sheetRef} /> : null}
                    {job !== null ? <PayHourlyDepositPaneHelper job={job} withID={passedData.with} rate={job.hourlyRate} props={this.props} sheetRefHourly={this.sheetRefHourly} /> : null}
                    {this.renderPayHourlyOrNot()}
                </ScrollView>
                <Footer style={{ borderColor: "transparent", backgroundColor: "#303030" }}>
                    <FooterTab>
                        <Button style={styles.grayButton} onPress={() => {
                            this.props.props.navigation.push("homepage");
                        }}>
                            <Image source={require("../../../../assets/icons/home.png")} style={styles.maxedIconSmall} />
                        </Button>
                        <Button style={styles.grayButton} button={true} onPress={() => {
                            this.props.props.navigation.push("jobs-homepage");
                        }}>
                            <Image source={require("../../../../assets/icons/seeker.png")} style={styles.maxedIconSmall} />
                        </Button>
                        <Button style={styles.grayButton} button={true} onPress={() => {
                            this.props.props.navigation.push("people-list-all");
                        }}>
                            <Image source={require("../../../../assets/icons/people.png")} style={styles.maxedIconSmall} />
                        </Button>
                        <Button style={styles.grayButton} button={true} onPress={() => {
                            this.props.props.navigation.push("notifications");
                        }}>
                            <Badge style={styles.absoluteBadge}><Text style={{ color: "white", fontSize: 10 }}>51</Text></Badge>
                            <Image source={require("../../../../assets/icons/bell.png")} style={[styles.maxedIconSmall, { bottom: 7.5 }]} />
                            
                        </Button>
                    </FooterTab>
                </Footer>
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        unique_id: state.signupData.authData.unique_id,
        fullPaymentCompleted: _.has(state.payments, "fullPaymentCompleted") ? state.payments.fullPaymentCompleted : {
            completed: false,
            jobID: null
        },
        partialPaymentCompleted: _.has(state.payments, "partialPaymentCompleted") ? state.payments.partialPaymentCompleted : {
            completed: false,
            jobID: null
        },
        minimumHourlyPaymentCompleted: _.has(state.payments, "minimumHourlyPaymentCompleted") ? state.payments.minimumHourlyPaymentCompleted : {
            completed: false,
            jobID: null
        },
        customPaymentCompleted: _.has(state.payments, "customPaymentCompleted") ? state.payments.customPaymentCompleted : {
            completed: false,
            jobID: null
        }
    }
}
export default connect(mapStateToProps, { })(IndividualActiveJobHelper);
