const express = require('express')
const path  = require('path')
const multer = require('multer')


//configuration for multer
const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public')
    },
    filename : (req,file,cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null , `productImages/productImage-${file.fieldname}-${Date.now()}.${ext}`);
    }   
        
})



//create the multer instance for  all three files 
const upload = multer({
    storage : multerStorage
})

module.exports = upload