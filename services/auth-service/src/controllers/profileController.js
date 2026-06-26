const User = require("../models/user");
const { validateProfileUpdate } = require("../util/validator");
const { validateEmailUpdate } = require("../util/validator");
const { validatePasswordUpdate } = require("../util/validator");
const bcrypt = require('bcrypt');

const getProfile = async (req,res)=>{
      try {

        const user = await User.findById(req.user.userId).select('firstName lastName email phoneNumber photoUrl location');

          res.send(user);

          
      } catch (error) {
          console.log("ERROR in accesing the profile: "+ error.message)
      }
}

const editProfile =  async (req, res) => {
     try {

          const user = await User.findById(req.user.userId);

          const Allowed_updates = [ 'firstName', 'lastName', 'phoneNumber', 'location'];

           let isUpdateAllowed = Object.keys(req.body).every(key=> Allowed_updates.includes(key));

           if(!isUpdateAllowed){
               throw new Error("updates not allowed");
           }

           validateProfileUpdate(req);

          Object.keys(req.body).forEach((key)=> user[key] = req.body[key]);

          await user.save();

          res.json({success:true , message: "Profile updated successfully" });

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
          res.status(400).send(error.message);
      }

}

const changeRole = async (req,res)=>{
     try {

         const { userId } = req.body;

         const user =  await User.findById( userId);

          if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

         if(!user.role.includes('venueOwner')){
             await User.findByIdAndUpdate( userId, { $push: {role:'venueOwner'}});
         } 

        res.status(200).json({
            success: true,
            message: 'Role updated',
            user
        });

     } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
          console.log(error);
     }
}


module.exports = { getProfile, editProfile, editEmail, editPassword, changeRole }