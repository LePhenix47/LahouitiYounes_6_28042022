const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    console.log(req.body.email);
    bcrypt
        .hash(req.body.password, 15)
        .then((hash) => {
            const newUser = new User({
                email: req.body.email,
                password: hash,
            });

            newUser
                .save(console.log(newUser))
                .then(() =>
                    res.status(201).json({ message: "User SUCCESSFULLY created!" })
                )
                .catch((error) => {
                    res.status(400).json({ error });
                    console.log(error);
                });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                console.log("User " + user + " not found");
                return res.status(401).json({ error: "User not found!" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        console.log("User password not valid");
                        return res.status(401).json({ error: "Incorrect password!" });
                    }

                    console.log("User SUCCESSFULLY authenticated");
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            process.env.ACCESS_TOKEN_SECRET, {
                                expiresIn: "24h",
                            }
                        ),
                    });
                })
                .catch((error) => {
                    console.log("Error 500 after user validation: " + error);
                    res.status(500).json({ error });
                });
        })
        .catch((error) => {
            console.log("Error 500 after finding user: " + error);
            res.status(500).json({ error });
        });
};