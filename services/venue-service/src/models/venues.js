
const mongoose = require('mongoose');

const venueSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "VenueOwner"
    },

    venueName: {
        type: String,
        maxLength: 100
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
         maxLength:10
     },
    city: {
        type: String,
        maxLength: 50
    },

    state: {
        type: String,
        maxLength: 50
    },

    country: {
        type: String,
        maxLength: 50
    },

    pincode: {
        type: Number,
        maxLength: 10
    },

    location: {
        latitude,
        longitude
    },

    pricePerHour: {
        type: Number,
        maxLength: 10
    },

     pricePerDay: {
        type: Number,
        maxLength : 10
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

    images: [{ type: String }],

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
    }

},
    { timestamps: true }
);


module.exports = mongoose.model('Venue', venueSchema);