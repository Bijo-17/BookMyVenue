
const jwt = require('jsonwebtoken');
const  User = require('../models/user');

const userAuth = async (req,res,next)=>{
     try {
 
         const {token} = req.cookies;

         if(!token){
             throw new Error('invalid token! please log in again');
          }

         const decodedData = await jwt.verify(token,'venUe55@22$!00');

         const {userId} = decodedData;

         const user = await User.findById(userId)

         if(!user){
             throw new Error('user not found! Please log in again');
          }

         req.user = user;  
         next();  
        
     } catch (error) {
        res.status(400).send("ERROR: "+error.message)
        console.log('ERROR: '+error.message);
     }
}

module.exports = { userAuth }
