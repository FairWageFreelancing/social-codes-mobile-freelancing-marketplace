const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const app = express();
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');
const User = require("../../../schemas/auth/register.js");
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const stripe = require('stripe')(config.get("stripeSecretKey"));
const request = require('request');


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", async (req, res) => {

        const { 
            firstName,
            lastName,
            email,
            id,
            fullName,
            photo,
            phoneNumber,
            formattedPhoneNumber,
            accountType,
            username,
            birthdate
        } = req.body;

        console.log(req.body);

        if (accountType === "work") {

            const account = await stripe.accounts.create({
                type: 'custom',
                country: 'US',
                email: email.toLowerCase(),
                capabilities: {
                    card_payments: {
                      requested: true
                    },
                    transfers: {
                      requested: true
                    },
                },
            }).then((account) => {
                console.log("account", account);

                const generatedID = uuidv4();

                const url = 'https://api-us.cometchat.io/v2.0/users';

                const options = {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json', 
                            "Accept": 'application/json',
                            "appId": config.get("commetChatAppId"),
                            "apiKey": config.get("commetChatAuthKey")
                    },
                    body: JSON.stringify({
                        name: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
                        uid: generatedID,
                        withAuthToken: true
                    })
                };
                
                fetch(url, options)
                .then(res => res.json())
                .then((json) => {
                    console.log("Json", json);

                    const options = {
                        method: 'POST',
                        url: 'https://auth.emsicloud.com/connect/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        form: {
                            client_id: config.get("emsiSkillsAPIClientID"),
                            client_secret: config.get("emsiSkillsAPISecret"),
                            grant_type: 'client_credentials',
                            scope: config.get("emsiSkillsScope")
                        }
                    };
                    
                    request(options, (error, response, body) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(body);

                            const newUser = new User({
                                accountType,
                                username: username.toLowerCase(),
                                email: email.toLowerCase(),
                                unique_id: generatedID,
                                firstName: firstName.toLowerCase(),
                                lastName: lastName.toLowerCase(),
                                birthdate,
                                phoneNumber,
                                photo,
                                googleID: id,
                                cometChatAuthToken: json.data.authToken,
                                stripeConnectAccount: account,
                                skillsApiToken: JSON.parse(body).access_token
                            });
                
                            newUser.save((err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(data);
                    
                                    res.json({
                                        message: "Successfully updated account information!", 
                                        user: data
                                    })
                                }
                            })
                        }
                    });
                })
                .catch(err => console.error('error:' + err));
            });
        } else {

            const customer = await stripe.customers.create({
                description: `Freelancer named ${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
                email: email.toLowerCase(),
                name: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
                phone: phoneNumber
            }).then((account) => {
                console.log("account", account);

                const generatedID = uuidv4();

                const url = 'https://api-us.cometchat.io/v2.0/users';

                const options = {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json', 
                            "Accept": 'application/json',
                            "appId": config.get("commetChatAppId"),
                            "apiKey": config.get("commetChatAuthKey")
                    },
                    body: JSON.stringify({
                        name: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
                        uid: generatedID,
                        withAuthToken: true
                    })
                };
                
                fetch(url, options)
                .then(res => res.json())
                .then((json) => {
                    console.log("Json", json);

                    const options = {
                        method: 'POST',
                        url: 'https://auth.emsicloud.com/connect/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        form: {
                            client_id: config.get("emsiSkillsAPIClientID"),
                            client_secret: config.get("emsiSkillsAPISecret"),
                            grant_type: 'client_credentials',
                            scope: config.get("emsiSkillsScope")
                        }
                    };
                    
                    request(options, (error, response, body) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(body);

                            const newUser = new User({
                                accountType,
                                username: username.toLowerCase(),
                                email: email.toLowerCase(),
                                unique_id: generatedID,
                                firstName: firstName.toLowerCase(),
                                lastName: lastName.toLowerCase(),
                                birthdate,
                                phoneNumber,
                                googleID: id,
                                photo,
                                cometChatAuthToken: json.data.authToken,
                                stripeCustomerAccount: account,
                                skillsApiToken: JSON.parse(body).access_token
                            });
                
                            newUser.save((err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(data);
                    
                                    res.json({
                                        message: "Successfully updated account information!", 
                                        user: data
                                    })
                                }
                            })
                        }
                    });
                })
                .catch(err => console.error('error:' + err));
            });
        }
    });
});

module.exports = router;