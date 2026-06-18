const { validateVenueSignupData } = require("../util/validator");
const Venue = require('../models/venues');

const addVenue = async(req,res)=>{
    try {

        await validateVenueSignupData(req);
      
        
    } catch (error) {
        res.status(400).send("ERROR in adding venue");
    }
}


module.exports = { addVenue }