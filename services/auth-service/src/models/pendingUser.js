
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
     firstName: { type: String, required: true, minLength: 3, maxLength: 50, trim: true },
     lastName:  { type: String, maxLength: 50},
     email:     { type: String, trim: true, required: true },
     password:  { type: String },
     phoneNumber: { type: Number , minLength:10, maxLength:10 },
     role:      { type :    String , 
                   Enum:    ['user','admin','venuOwner'], 
                   default: 'user'
                 },

     otp: { type: String , maxLength:6},
     otpExpiry : {type: String, maxLength: 50},
     
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800
    }

});


module.exports = mongoose.model('pendingUser', userSchema);


