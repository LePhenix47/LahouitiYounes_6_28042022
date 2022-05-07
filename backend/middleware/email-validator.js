const emailValidator = require("validator");

module.exports = (req, res, next) => {
    let email = req.body.email;
    try {
        if (emailValidator.isEmail(email)) {
            console.log(
                "The email " +
                email +
                " is correct, boolean value: " +
                emailValidator.isEmail(email)
            );
            next(); //Validé
        } else {
            throw (
                "The email is incorrect, boolean value for the verification of the email: " +
                emailValidator.isEmail(email)
            ); //Email incorrect
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};