
const express = require('express');
const app = express();
const User = require('./models/user');

const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();
const authRoute = require('./routes/authRoutes');
const profileRoute = require('./routes/profileRoutes');

app.use(express.json());
app.use(cookieParser());

app.use("/profile",profileRoute);
app.use("/",authRoute);


const PORT = process.env.PORT || 3001 ;


connectDB()
     .then(()=>{

          console.log('mongodb connected...');
          app.listen(PORT, () => {
          console.log(`Auth service running at port ${PORT}`);
     });
           
 })
   .catch(err=>{
         console.log("Failed to connect to database",err);
   })





