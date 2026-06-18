
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
     firstName: { type: String, required: true, minLength: 3, maxLength: 50, trim: true },
     lastName:  { type: String, maxLength: 50},
     email:     { type: String, trim: true, required: true, unique: true, trim: true },
     password:  { type: String },
     gender:    {
                  type: String,

                     validate(value) {
                            if (!['male', 'female'].includes(value)) {
                             throw new Error('Gender data is not valid');
                             }
                     }

                },
     location:  { type: String, trim: true, maxLength:50},
     phoneNumber: { type: Number , minLength:10, maxLength:10 },
     role:      { type :    String , 
                   Enum:    ['user','admin','venuOwner'], 
                   default: 'user'
                 }

},
     { timestamps: true });


 userSchema.methods.getJWT = async function(){
     
      const user = this;
      const token = await jwt.sign({userId:user._id , email:user.email, role: user.role },process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;

 }   

userSchema.methods.validatePassword = async function (password) {

      const user = this;
      const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}



module.exports = mongoose.model('User', userSchema);


