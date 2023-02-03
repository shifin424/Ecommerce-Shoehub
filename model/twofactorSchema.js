const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const twoFactorSchema = new Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String
    }
}); 

const TFotp = mongoose.model('twoFactor',twoFactorSchema)
module.exports = TFotp;