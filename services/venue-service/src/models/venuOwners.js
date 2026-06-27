
const mongoose = require('mongoose');
const User = require('../../../auth-service/src/models/user');

const venuOwnerSchema = mongoose.Schema({

   userId           :  {  type : mongoose.Schema.Types.ObjectId , ref: 'User' , required: true},

   ownerName        : { type: String , minLength:3, maxLength: 30},

   organizationName :  {
                          type: String,
                          maxLength : 100
                       },

   businessEmail    :  {
                          type: String, 
                          trim: true, 
                          required: true, 
                          unique: true, 
                          trim: true 
                       },

   businessPhone    :  { 
                          type: Number , 
                          minLength:10, 
                          maxLength:10 
                       },
   

   gstNumber       :   {
                         type:String,
                         maxLength:80
                       },

   description     :   {
                         type: String,
                         maxLength: 200
                       },

   status          :   {
                        type: String,   
                        maxLength : 40              
                       },
   isDeleted       :   {
                          type:Boolean,
                          default: false
                       }                     

},
 { timestamps: true}
);

module.exports = mongoose.model('VenuOwner',venuOwnerSchema);