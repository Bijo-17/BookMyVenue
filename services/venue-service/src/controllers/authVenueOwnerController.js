
const { validateSignup } = require("../util/validator");
const VenuOwner = require('../models/venuOwners');
const User = require('../../../auth-service/src/models/user');

const registerVenueOwner = async (req, res) => {
    try {

        await validateSignup(req);

        const { organizationName,
            businessEmail,
            businessPhone,
            description,
            status } = req.body;

        await new VenuOwner({

            userId: req.user.userId,
            organizationName,
            businessEmail,
            businessPhone,
            description

        }).save();

        res.send('successfully register as a Venue Owner');

    } catch (error) {

        res.status(400).send('ERROR Registering as venu owner: ' + error.message);

    }
}

const venuOwnerLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {

            throw new Error('Invalid credentials');

        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {

            throw new Error('Invalid  credentials');

        } else {

            // autenticate;

            if (user.role !== 'venuOwner') {

                return res.status(403).send('Access Denied');

            }

            const token = await user.getJWT();

            res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.send('login sucesfull!');

        }

    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
}

const venuOwnerLogout = (req, res) => {

    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    req.user = null;

    res.send("logout sucessfull!");

}

module.exports = { registerVenueOwner, venuOwnerLogin, venuOwnerLogout }