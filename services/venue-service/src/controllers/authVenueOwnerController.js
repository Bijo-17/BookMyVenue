
const { validateSignup } = require("../utils/validator");
const VenueOwner = require('../models/venuOwners');
const User = require('../../../auth-service/src/models/user');
const axios = require('axios');
const BASE_URL = require('../utils/constants');

const registerVenueOwner = async (req, res) => {
    try {

        await validateSignup(req);

     const { organizationName,
            businessEmail,
            businessPhone,
            description,
            status } = req.body;

      const existingVenueOwner = await VenueOwner.findOne({ businessEmail: businessEmail });

      if(existingVenueOwner){
        return res.status(409).json('Email address already exists!');
      }
      
      const venueOwner =  await new VenueOwner({

            userId: req.user.userId,    
            organizationName,
            businessEmail,
            businessPhone,
            description

        });

         const response = await axios.patch(
              'http://localhost:3001/profile/changeRole',
              { userId: req.user.userId},

         );


         if(response.data.success){
             await venueOwner.save();
             res.json({success: true , message:'successfully register as a Venue Owner' });
         } else {
             res.status(400).json(response.data.message);
         }
      

    } catch (error) {

        res.status(400).json(error.message);

    }
}


const venuOwnerLogout = (req, res) => {

    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    req.user = null;

    res.send("logout sucessfull!");

}

module.exports = { registerVenueOwner, venuOwnerLogout }