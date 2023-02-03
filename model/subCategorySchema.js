const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subCategorySchema = new Schema({
    category_id:{ 
        type:mongoose.SchemaTypes.ObjectId,
        ref:'categories'
    },


    subcategory_name:{
        type:String,
        required:true
    }
    , delete:{
        type:Boolean,
        default:false,
    }
})
 const subCategories = mongoose.model('subCategories',subCategorySchema);
 module.exports=subCategories;
