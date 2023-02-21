const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subCategorySchema = new Schema({
    subcategory_name:{
      
        type:String,
        uppercase:true,
        required:true
    }
    , delete:{
        type:Boolean,
        default:false,
    }
})
 const subCategories = mongoose.model('subCategories',subCategorySchema);
 module.exports=subCategories;
