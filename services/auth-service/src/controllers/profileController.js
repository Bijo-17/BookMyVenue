const User = require("../models/user");
const { validateProfileUpdate } = require("../util/validator");
const { validateEmailUpdate } = require("../util/validator");
const { validatePasswordUpdate } = require("../util/validator");
const bcrypt = require('bcrypt');

const getProfile = async (req,res)=>{
      try {

        const user = await User.findById(req.user.userId).select('firstName lastName email phoneNumber');

          res.send(user);

          
      } catch (error) {
          console.log("ERROR in accesing the profile: "+ error.message)
      }
}

const editProfile =  async (req, res) => {
     try {

          const user = await User.findById(req.user.userId);

          const Allowed_updates = [ 'firstName', 'lastName', 'phoneNumber'];

           let isUpdateAllowed = Object.keys(req.body).every(key=> Allowed_updates.includes(key));

           if(!isUpdateAllowed){
               throw new Error("updates not allowed");
           }

           validateProfileUpdate(req);

          Object.keys(req.body).forEach((key)=> user[key] = req.body[key]);

          await user.save();

          res.send('Profile updated successfully');

     } catch (error) {
          res.status(400).send("Unable to update profile: " + error.message);
     }
}

const editEmail = async (req,res)=>{
      try {
       
           validateEmailUpdate(req.body.email);  
     
           await User.findByIdAndUpdate(req.user.userId, { email : req.body.email });

           res.send("Email updated sucessfully");
          
      } catch (error) {
            res.status(400).send("Unable to update Email: " + error.message);
      }
}

const editPassword = async (req,res)=> {
      try {

          await validatePasswordUpdate(req);

          const hashedPassword = await bcrypt.hash(req.body.newPassword,10);

          await User.findByIdAndUpdate(req.user.userId,{ password:hashedPassword});

          res.send("password updated sucessfully");

      } catch (error) {
          res.status(400).send("Unbale to change the password: "+ error.message);
      }

}


module.exports = { getProfile, editProfile, editEmail, editPassword }