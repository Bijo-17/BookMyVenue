

const jwt = require('jsonwebtoken');
const User = require('../../services/auth-service/src/models/user');

const  authenticate = async (req,res,next)=>{
     try {
 
         const {token} = req.cookies;

         if(!token){
             throw new Error('please log in again');
          }

         const decodedData = await jwt.verify(token, process.env.JWT_SECRET);

         const {userId, email, role } = decodedData;
 
         req.user = { userId , email, role };  

         next();  
        
     } catch (error) {
        res.status(400).send("ERROR: Please log in again");
        console.log('ERROR: '+error);
     }
}


module.exports = authenticate


