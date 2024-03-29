const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');


dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});



const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "HostelHive",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});


const fileFilter = (req, file, cb) => {
  if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    return cb(new Error("File is not an image"));
  }
  return cb(null, true);
};

const upload = multer({ storage, fileFilter });
const uploadImage = (req, res, next) => {


  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      if (err.message === "File is not an image") {
        return res.status(400).json({ error: 'Selected file is not an image' });
      }
      return res.status(500).json({ error: 'An error occurred during file upload' });
    }else{
      console.log("reached to cloudinary")
     return next();
    }
  });
};


module.exports = uploadImage;


