
const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({

    userId: { 
               type: mongoose.Schema.Types.ObjectId,
               required : true,
               ref : "user"
            },
    venues: [
               {   venueId: { 
                                  type:mongoose.Schema.Types.ObjectId,
                                  ref:"Venue",
                                  required:true
                            },
                  status : {type: Boolean , default :true}     
                } 
            ]   



},{ timestamps: true })


module.exports = mongoose.model('Wishlist',wishlistSchema);