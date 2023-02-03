const mongoose = require('mongoose');
const Schema = mongoose.Schema
const categorySchema =new Schema({
    category_name:{
        type:String,
        uppercase:true,
        required:true
    },
    delete:{
        type:Boolean,
        default:false,
    }
}) 
const categories = mongoose.model('categories',categorySchema);
module.exports=categories;