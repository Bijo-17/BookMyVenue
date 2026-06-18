
const express = require('express');
const app = express();

const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const venueOwnerAuthRoute = require('./routes/venueOwnerAuthRoutes');
const addVenueRoute = require('./routes/addVenuRoutes');
const editVenueRoute = require('./routes/editVenuRoutes')
const getVenueRoute = require('./routes/getVenuRoutes');

 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth/profile",profileRoute);   
// app.use("/api/auth",authRoute);

app.use("/",venueOwnerAuthRoute);




const PORT = process.env.PORT || 3003 ;


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
