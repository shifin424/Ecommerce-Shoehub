const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim : true 
    },
    phonenumber:{
        type:Number,
        trim: true,
        required:true,
    },

    walletTotal:{
        type:Number,
        default:0
    },
    walletDetails:[

    ],
    cancelledDate:{
        type: String,
    },


    addressDetails:[
        {
         housename:{
            type:String,
         },
         area:{
            type:String,
         },
         landMark:{
            type:String,
         },
         district:{
            type:String,
         },
         postoffice:{
            type:String,
         },
         state:{
            type:String,
         },
         pin:{
            type:String,
         }
        }
    ],
    password:{
        type:String,
        required:true,
        trim :true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
})
 
module.exports = mongoose.model('User',userSchema)

