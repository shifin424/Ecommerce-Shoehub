
const user = require('../model/userSchema')
const bcrypt = require('bcrypt');
const sharp = require('sharp')

const viewProfile = async (req, res, next) => {
  try {
    const session = req.session.user
    const email = session.email
    const userData = await user.findOne({ email: email })
    const walletDetails = userData.walletDetails
    res.render('user/profile', { userData,walletDetails  })
  }
  catch (err) {
    next(err)
  };
}


const editProfile = async (req, res, next) => {
  try {
    const session = req.session.user
    const email = session.email
    const userData = await user.findOne({ email: email })
    console.log(userData);
    res.render('user/editProfile', { userData })
  } catch (err) {
    next(err)
  }

};

const postEditProfile = async (req, res, next) => {
  try {


    const session = req.session.user
    await user.updateOne(
      { email: session.email },
      {
        $set: {

          username: req.body.name,
          phonenumber: req.body.phone,
          email: req.body.email,
          addressDetails: [
            {
              housename: req.body?.housename,
              area: req.body?.area,
              landMark: req.body?.landmark,
              district: req.body?.district,
              state: req.body?.state,
              postoffice: req.body?.postoffice,
              pin: req.body?.pin,
            },
          ],
        },
      },
    )
    res.redirect('/profile')
  } catch (err) {
    next(err)
  }

}
const getPasswordPage = async (req, res, next) => {
  try {
    res.render('user/profilePassword')
  } catch (err) {
    console.log(err);
    next(err)
  }
};

const postChangePassword = async (req, res, next) => {
  try {

    const data = req.body
    const session = req.session.user
    if (data.newPassword === data.conNewPassword) {

      const userData = await user.findOne({ email: session.email })
      const passwordMatch = await bcrypt.compare(data.currentPassword, userData.password)

      if (passwordMatch) {

        const hashPassword = await bcrypt.hash(data.newPassword, 10)

        user.updateOne({ email: session.email }, { $set: { password: hashPassword } }).then(() => {

          req.session.user = null;
          res.redirect('/')
        })

      } else {
        res.render('user/profilePassword', { invalid: "Incorrect password" })
      }

    } else {
      res.render('user/profilePassword', { invalid: "Password must be same" })
    }



  } catch (err) {
    console.log(err);
  }
};

  const getContactPage = async(req,res,next)=>{
    try{
      res.render('user/contact')
    }catch(err){
      console.log(err);
    }
  }


const editAddress = async(req,res,next)=>{
  try{
    const session = req.session.user
    const userData = await user.findOne({_id:session._id})
    res.render('user/editAddress',{userData})
  }catch(err){
    next(err)
  }
}


const myProfile = async(req,res,next)=>{
  try{
    let session = req.session.user
    let email = session.email
    data = req.file
    console.log(data,1);
    let myImage = `myProfiles/${Date.now()}${ req.file.originalname}`;
        sharp(req.file.buffer)
         .toFormat("png","jpg","jpeg")
           // .resize(255,380)
           .toFile(`public/${myImage}`);

            await user.updateOne({email:email},{$set:{profile:myImage}})
        res.redirect('/profile')  

  }catch(err){
    console.log(err);
    next(err)
  }
}


const editProfileAddress = async(req,res,next)=>{
  try{
    let session = req.session.user
    Id = req.params.id
    const userData = await user.findOne({email:session.email})
    const address = {
      housename:req.body.housename,
      area:req.body.area,
      landMark:req.body.landmark,
      district:req.body.district,
      postoffice:req.body.postoffice,
      state:req.body.state,
      pin:req.body.pin,
    }
     const addressEdit= await user.updateOne({_id:userData._id,"addressDetails._id":Id},{$set:{"addressDetails.$":address}})
    res.redirect('/profile')
  }catch(err){
    next(err)
  }
}

const deleteProfile = async (req, res, next) => {
  try {
    const session = req.session.user;
    const addressId = req.params.id;
    const userData = await user.findOne({ email: session.email });
    const deleteAddress = await user.updateOne(
      { _id: userData._id },
      { $pull: { addressDetails: { _id:addressId } } }
    );
    res.redirect('/EditAddress');
  } catch (err) {
    next(err);
  }
};



const changeDp = async(req,res,next)=>{
  try{
    let changeImage = `myProfiles/${Date.now()}${ req.file.originalname}`;
    sharp(req.file.buffer)
     .toFormat("png","jpg","jpeg")
        //.resize(255,380)
       .toFile(`public/${changeImage}`);
       
    await user.updateOne({ _id: req.params.id },
         {
             $set:
             {
                 profile:changeImage,
             }
         })

    
    res.redirect('/profile');
  }catch(err){
    console.log(err);
    next(err)
  }
}



module.exports = {
  editProfile,
  viewProfile,
  postEditProfile,
  getPasswordPage,
  postChangePassword,
  getContactPage,
  editAddress ,
  editProfileAddress,
  myProfile,
  changeDp,
  deleteProfile
  


}