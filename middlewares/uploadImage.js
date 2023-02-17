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
        cb(null, `productImages/${Date.now()}${path.extname(file.originalname)}`);
    }   
        
})

const multerFilter = (req, file, cb) => {

    if (file.mimetype.split('/')[1] === 'jpeg' ||
      file.mimetype.split('/')[1] === 'png' ||
      file.mimetype.split('/')[1] === 'jpg') {
      cb(null, true);
    } else {
      cb(new Error("Not a JPEG, PNG or JPG File!!"), false);
    }
  }
  




//create the multer instance for  all three files 
const upload = multer({
    storage : multerStorage,fileFilter:multerFilter
})

module.exports = upload