const express = require("express");
const router = express.Router();
const app = express();
const mongo = require("mongodb");
const config = require("config");
const cors = require('cors');


mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", (req, res) => {

        const database = db.db("db");

        const collection = database.collection("users");

        const { id } = req.body;

        collection.findOne({ unique_id: id }).then((user) => {
            if (user) {

                res.json({
                    message: "Gathered cards successfully!",
                    cards: user.cardPaymentMethods
                })
            } else {
                res.json({
                    message: "Could not locate the appropriate user..."
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    });
});

module.exports = router;