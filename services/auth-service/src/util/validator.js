
const validator = require('validator');
const generateOtp = require('../util/otpGenerator');
const bcrypt = require('bcrypt');

const validateSignupData = (req) => {

     const { firstName, lastName, email, password, phoneNumber } = req.body;

     if (!firstName && !lastName && !email && !password && !phoneNumber) throw new Error("All fields are required");

     if (!firstName || !lastName) {

          throw new Error("Enter your first and last name");

     } else if (firstName.length < 3 || firstName.length > 50) {

          throw new Error("First name should be between 3 and 50 charcters")

     } else if (!validator.isEmail(email)) {

          throw new Error("Enter a valid email address");

     } else if (!validator.isStrongPassword(password)) {

          throw new Error("Enter a strong password");

     } else if (!validator.isMobilePhone(phoneNumber.toString(), 'en-IN')) {
          throw new Error("Enter a valid phone number");
     }

}

const validateProfileUpdate = (req) => {

     const { firstName, lastName, phoneNumber } = req.body;

     if (!firstName && !lastName && !email && !password && !phoneNumber) {

          throw new Error("All fields are required");

     } else if (firstName.length < 3 || firstName.length > 50) {

          throw new Error("First name should be between 3 and 50 charcters")

     } else if (!validator.isMobilePhone(phoneNumber.toString(), 'en-IN')) {
          throw new Error("Enter a valid phone number");
     }

}

const validateEmailUpdate = async (email) => {

     if (!validator.isEmail(email)) {

          throw new Error("Enter a valid email address");

     }

     const isOtpSent = await generateOtp(email);
 
      if(!isOtpSent){
          throw new Error("Error in sending Email");
      }
}

const validatePasswordUpdate = async (req) => {

     const { enteredPassword, newPassword, confirmPassword } = req.body

     const user = req.user;

      const isPasswordValid = await user.validatePassword(enteredPassword);
      const isPasswordsame = await user.validatePassword(newPassword);
      
     if (!isPasswordValid) {

          throw new Error("Existing password is not correct");

     } else if(isPasswordsame){

          throw new Error("Enter a different password");

     } else if (!validator.isStrongPassword(newPassword)) {

          throw new Error("Enter a strong password");

     } else if (newPassword !== confirmPassword) {

          throw new Error("Entered password doesn't match")
     }


}


const validateOtp = async (otp,enteredOtp,otpExpiry)=>{
    
      if(!enteredOtp){
          throw new Error('Enter your otp');
      } else if(!otp){
          throw new Error('Otp not send try again');
      } else  if(Date.now() > otpExpiry ){
          throw new Error('OTP expired! Resend the OTP again');
      } else if( otp !== enteredOtp){
          throw new Error('Otp is not valid');
      }
      
}


module.exports = {
     validateSignupData,
     validateProfileUpdate,
     validateEmailUpdate,
     validatePasswordUpdate,
     validateOtp
}
