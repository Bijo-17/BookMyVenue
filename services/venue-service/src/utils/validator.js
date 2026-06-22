
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
console.log(req.body ,  !venueName,
             !venueType,
             !description,
             !address,
             !venuePhone,
             !city,
             !state,
             !country,
             !pincode,
        
             !pricePerDay,
             !capacity,
             !facilities,
             !idealFor, )
       
      if( !venueName || !venueType || !description ||
          !address || !venuePhone || !city || !state ||
          !country || !pincode || !pricePerDay || 
          !capacity || !facilities ||!idealFor
       ){
           throw new Error('Fill all the required fields');
       } else if(!validator.isMobilePhone(venuePhone.toString().trim(), 'en-IN')){
        throw new Error("Enter a valid phone number");
      }  else if(pincode.length !== 7){
         throw new Error("Enter a valid pincode");
      }  else if(pricePerDay < 0) {
         throw new Error("Enter a valid price");
      }  else if(capacity < 0){
         throw new Error("Enter a valid capacity");
      } else if (pricePerHour && pricePerDay < pricePerHour){
         throw new Error("Price per Day should not be lesser than price per Hour");
      } else if (facilities.length > 50){
         throw new Error("Facilities limit reached");
      } else if(idealFor.length > 50){
         throw new Error("ideal for limit reached");
      }


}


module.exports = { validateSignup , validateVenueSignupData }


