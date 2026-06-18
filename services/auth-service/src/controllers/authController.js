const User = require('../models/user');
const { validateSignupData } = require('../util/validator');
const bcrypt = require('bcrypt');
const generateOtp = require('../util/otpGenerator');
const { validateOtp } = require('../util/validator');
const PendingUser = require('../models/pendingUser');

const signupUser = async (req, res) => {
     try {

          const { firstName, lastName, email, password, phoneNumber, role } = req.body;

          const existingUser = await User.findOne({ email: email });

          if(existingUser){
               throw new Error("Email already exists");
          }

          validateSignupData(req);

          // sent otp as mail

         const isOtpSent = await generateOtp(req,email);

           const hashPassword = await bcrypt.hash(password, 10);

          const tempUser = await PendingUser.create({

                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    phoneNumber,
                    otp:req.otp,
                    otpExpiry: req.otpExpiry,
                    role : role || 'user'

           })
           

           res.json({
                message:'OTP Sent',
                tempUserId:tempUser._id,
                redirectUrl:'/loadOtpPage'
           })

          

     } catch (error) {
          res.send('Error in adding user: ' + error.message);
     }
}

const login = async (req, res) => {
     try {
        
          const { email, password } = req.body;
          const user = await User.findOne({ email: email });

          if (!user) {

               throw new Error('Invalid credentials');

          }

          const isPasswordValid = await user.validatePassword(password);

          if (!isPasswordValid) {

               throw new Error('Invalid  credentials');

          } else {

             const token = await user.getJWT();

             res.cookie('token',token , { maxAge : 7 * 24 * 60 * 60 * 1000 });
             res.send('login sucesfull!');

          }


     } catch (error) {
          res.send('Error: ' + error.message);
     }
}

const logout = async (req,res)=> {
   

          res.cookie('token', null ,{
               expires: new Date(Date.now())
          })
          req.user = null;

          res.send("logout sucessfull!");

}


const loadOtpPage = async (req,res)=> {
     try {

          
            res.send('otp Conforming page lOaded...');
            
          
     } catch (error) {
          res.status(400).send('ERROR: '+error.message);
          
     }
}

const verifyOtp = async (req,res)=>{
     try {
          
           const { tempUserId, otp } = req.body;
          
           const pendingUser = await PendingUser.findById(tempUserId);

           if (!pendingUser) {
                   throw new Error("Session Expired!");
               }


            await validateOtp(pendingUser.otp,otp,pendingUser.otpExpiry);
      
 
          const user = new User({
               firstName:pendingUser.firstName,
               lastName:pendingUser.lastName,
               email:pendingUser.email,
               phoneNumber:pendingUser.phoneNumber,
               password: pendingUser.password,
               role: pendingUser.role
          })

          await user.save();

          await PendingUser.findByIdAndDelete(tempUserId);

          res.send('User created sucessfully');
       
          
     } catch (error) {
          res.status(400).send('ERROR: '+error.message);          
     }
}


module.exports = { signupUser , login, logout , loadOtpPage, verifyOtp }
