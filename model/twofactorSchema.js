const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const twoFactorSchema = new Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
}); 

const twoFactor = mongoose.model('twoFactor',twoFactorSchema)
module.exports = twoFactor;