const { validateVenueData } = require("../utils/validator");
const Venue = require('../models/venues');
const VenueOwner = require('../models/venuOwners');
const deleteFiles = require('../utils/deleteFiles');

const addVenue = async (req, res) => {
    try {

        const venueOnwer = await VenueOwner.findOne({userId:req.user.userId});

        if(!venueOnwer){
            return res.status(404).send('First register as an Venue Owner And then try adding your venue');
        }
    
        await validateVenueData(req);
        
        const images = req.files.map((file,i)=> ({ 

                 url:`/uploads/venues/${file.filename}`,
                 filename: file.filename,
                 isPrimary: i===0
            })
        )


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
            await deleteFiles(req.files);
            return res.status(409).send("Venue name already exists");
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
            facilities : JSON.parse(facilities),
            idealFor : JSON.parse(idealFor),
            ownerId:venueOnwer._id,
            images
        }).save();

        
        res.status(201).send('venue added sucessfully , waiting for Approval');

    } catch (error) {
        await deleteFiles(req.files);
        res.status(400).send("ERROR in adding venue: "+ error.message);
    }
}



const deleteVenue = async (req,res)=>{
    try {

        const { venueId } = req.params;

        const venue = await Venue.findByIdAndUpdate(venueId,{isDeleted:true});

        if(venue){
            res.status(204).end();
        } else {
            res.status(404).send('Error in deleting venue');
        }
        
    } catch (error) {
        res.status(400).send('ERROR in deleting venue');      
    }
}


const viewVenue = async (req,res)=>{
    try {
        
        const venues = await Venue.find({isDeleted: false});  
     
        res.json({success:true, venues});

        
    } catch (error) {
        res.status(400).json(error.message);
    }
}


const editVenue = async (req,res)=>{
     try {

      
        const { venueId } = req.params
        const venue = await Venue.findById(venueId);

        if(!venue) {
            return res.status(404).send("Venue not found! Try creating new one");
        }

        await validateVenueData(req);

        const metadata = JSON.parse(req.body.imagesMetadata)

        const uploadedFiles = req.files;

        const finalImages = [];

        for(const item of metadata){
 
            if(item.type === 'existing'){

                  finalImages.push({
                      filename:item.filename,
                      url:`/uploads/venues/${item.filename}`,
                      isPrimary: item.isPrimary
                  })

            } else {
                   
                     const file = uploadedFiles[item.fileIndex];

                     finalImages.push({
                         filename:file.filename,
                         url:`/uploads/venues/${file.filename}`,
                         isPrimary:item.isPrimary
                     })
            }
        }


        const filenamesInDb = venue.images.map(i=> i.filename);

        const filenamesInMetadata = metadata.filter(i=> i.type === 'existing').map(i=> i.filename);

        const removed = filenamesInDb.filter(x=> !filenamesInMetadata.includes(x));

        if(removed.length){
            await deleteFiles(removed);
        }

    

        const {
                venueName,
                venueType,
                description,
                address,
                venuePhone,
                city,
                pincode,
                location,
                pricePerHour,
                pricePerDay,
                capacity,
                facilities,
                idealFor,
                isAvailable
                         } = req.body;

       Object.assign( venue,{  
                                venueName,
                                venueType,
                                description,
                                address,
                                venuePhone,
                                city,
                                pincode,
                                location,
                                pricePerHour,
                                pricePerDay,
                                capacity,
                                isAvailable,
                                facilities : JSON.parse(facilities),
                                idealFor : JSON.parse(idealFor),
                                images:finalImages,
                             }
                      )

        await venue.save();

        res.status(200).json({success: true , message: "Venue Edited successfully", venue });


     } catch (error) {
        console.log("ERROR:" + error);
        await deleteFiles(req.files);
        res.status(400).json(error.message);
     }
}

module.exports = { addVenue, deleteVenue, viewVenue, editVenue };