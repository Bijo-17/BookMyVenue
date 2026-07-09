
const mongoose = require('mongoose');

const venueSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "VenueOwner",
    },

    venueName: {
        type: String,
        maxLength: 100,
        required:true,
       
    },

    venueType: {
        type: String,
        enNum: [
                 "Convention centers",
                 "Conference centers",
                 "Hotels",
                 "Resorts",
                 "Restaurants",
                 "Auditorium",
                 "Banquet Halls",
                 "Event centers",
                 "Private Residence",
                 "Community Centers",
           ]

    },

    description: {
        type: String,
        maxLength: 200
    },

    address: {
        type: String,
        maxLength: 100
    },
     venuePhone:{
         type: Number,
         minLength:10,
         maxLength:10,
         required: true
     },
    city: {
        type: String,
        maxLength: 50,
       
    },

    state: {
        type: String,
        maxLength: 50,
        default:'Kerala'
    },

    country: {
        type: String,
        maxLength: 50,
        default: 'India'
    },

    pincode: {
        type: Number,
        maxLength: 10
    },

    location: {
        latitude: {type:String},
        longitude: {type:String}
    },

    pricePerHour: {
        type: Number,
        maxLength: 10
    },

     pricePerDay: {
        type: Number,
        maxLength : 10,
        
     },

    capacity: {
        type: Number,
        maxLength: 10
    },

    
    facilities: [{ type: String ,
        Enum: [ 
                "Parking",
                "WiFi",
                "AC",
                "Projector",
                "Stage",
                "Sound System",
                "Catering",
                "Power Backup"
             ]
    }],        
    
    idealFor: [{ type: String,
          Enum: [
                    "Reception",
                    "Wedding",
                    "Birthday",
                    "Meeting",
                    "Conference",
                    "Party",
                    "Corporate Event"
                ]        
     }],

    images: [{ 
                url: { type: String, required: true} ,
                filename: { type:String, required: true},
                isPrimary : { type: Boolean , default: false},           
            }],

    rating:{
       type: Number,
       maxLength:15
    },

    averageRating: {
        type: Number,
        maxLength: 15
    },

    totalReviews: {
        type: Number,
        maxLength: 15
    },

    status: {
        type: String,
        Enum: ['pending','approved','rejected'],
        default:'pending'
    },

    message: {
        type: String,
    },

    isDeleted: {
        type:Boolean,
        default: false
    },

    isApproved: {
        type:Boolean,
        default: false
    },
    
    isAvailable: {
        type:Boolean,
        default:true
    },
    bookings: {
        type:Number,
        default:0
    }

},
    { timestamps: true }
);


module.exports = mongoose.model('Venue', venueSchema);