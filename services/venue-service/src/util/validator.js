
const validator = require('validator');

const validateSignup = (req)=>{

     const {  organizationName , 
              businessEmail, 
              businessPhone,
              description, 
              status            }  = req.body;


     if(    !organizationName.trim() ||
            !businessEmail.trim()    ||
            !businessPhone.trim()    ||
            !description.trim()){
          throw new Error('All fields are required');
       }else if(organizationName.length < 3 || organizationName.length > 50){
        throw new Error('Organization name must be between 3 and 50 characters ');
     } else if(!validator.isEmail(businessEmail.trim())){
        throw new Error('Enter a valid Email');
     } else if(!validator.isMobilePhone(businessPhone.toString().trim(), 'en-IN')){
        throw new Error("Enter a valid phone number");
     } 

}

const validateVenueSignupData = (req)=>{

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
             idealFor,           
                              }  = req.body;

       
      if( !venueName || !venueType || !description ||
          !address || venuePhone || !city || !state ||
          !country || !pincode || !pricePerDay || 
          !capacity || !facilities ||!idealFor
       ){
           throw new Error('Fill all the required fields');
       } else if(!validator.isMobilePhone(venuePhone.toString().trim(), 'en-IN')){
        throw new Error("Enter a valid phone number");
      }              


}


module.exports = { validateSignup , validateVenueSignupData }


