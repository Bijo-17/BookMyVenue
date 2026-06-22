const { validateVenueSignupData } = require("../utils/validator");
const Venue = require('../models/venues');
const VenueOwner = require('../models/venuOwners')

const addVenue = async (req, res) => {
    try {

        const venueOnwer = await VenueOwner.findOne({userId:req.user.userId});


        if(!venueOnwer){
            throw new Error('ERROR: first register as an Venue Owner And then try adding your venue');
        }

        await validateVenueSignupData(req);

        const { 
                  venueName,
                  venueType,
                  description,
                  address,
                  venuePhone,
                  city,
                  state,
                  country,
                  pincode,
                  location,
                  pricePerHour,
                  pricePerDay,
                  capacity,
                  facilities,
                  idealFor
                                     }    = req.body;

        const isVenueExist = await Venue.findOne({
            venueName: { $regex: `^${venueName}$`, $options: 'i' },
            isDeleted:false
        });


        if(isVenueExist){
             throw new Error("Venue name already exists");
        }

        await new Venue({
            venueName,
            venueType,
            description,
            address,
            venuePhone,
            city,
            state,
            country,
            pincode,
            location,
            pricePerHour,
            pricePerDay,
            capacity,
            facilities,
            idealFor,
            ownerId:venueOnwer._id
        }).save();

        
        res.send('venue added sucessfully , waiting for Approval');

    } catch (error) {
        res.status(400).send("ERROR in adding venue: "+ error.message);
    }
}



const deleteVenue = async (req,res)=>{
    try {

        const { venueId } = req.params;

        const venue = await Venue.findByIdAndUpdate(venueId,{isDeleted:true});

        if(venue){
            res.send('Deleted sucessfully...');
        } else {
            res.send('Error in deleting venue');
        }
        
    } catch (error) {
        res.status(500).send('ERROR in deleting venue');      
    }
}


const viewVenue = async (req,res)=>{
    try {
        
        const venues = await Venue.find({isDeleted: false});

           const indexs = await Venue.collection.indexes();
        

           console.log(" Index: " ,indexs);
     
        res.json({success:true, venues});

        
    } catch (error) {
        res.json({success:false , message: error.message});
    }
}

module.exports = { addVenue, deleteVenue, viewVenue };