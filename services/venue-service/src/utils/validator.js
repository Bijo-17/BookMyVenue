
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

const validateVenueData = (req)=>{

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

       
      if( !venueName.trim() || !venueType || !description.trim() ||
          !address.trim() || !venuePhone.trim() || !city.trim() || !pincode.trim() || !pricePerDay.trim() || 
          !capacity.trim() || !JSON.parse(facilities).length || !JSON.parse(idealFor).length
       ){
           throw new Error('Fill all the required fields');
       } else if(!validator.isMobilePhone(venuePhone.toString().trim(), 'en-IN')){
        throw new Error("Enter a valid phone number");
      }  else if(pincode.length !== 6){
         throw new Error("Enter a valid pincode");
      }  else if(pricePerDay < 0) {
         throw new Error("Enter a valid price");
      }  else if(capacity < 0){
         throw new Error("Enter a valid capacity");
      } else if (pricePerHour && Number(pricePerDay) <= Number(pricePerHour)){
         throw new Error("Price per Day should be greater than price per Hour");
      } else if (JSON.parse(facilities).length > 30){
         throw new Error("Facilities limit reached");
      } else if(JSON.parse(idealFor).length > 30){
         throw new Error("ideal for limit reached");
      } else if(Number(capacity) < 5 ) {
         throw new Error("Minimum capacity 5 is required");
      }


}


module.exports = { validateSignup , validateVenueData }


