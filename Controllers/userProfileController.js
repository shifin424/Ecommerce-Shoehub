
const user = require('../model/userSchema')

const viewProfile = async (req, res,next) => {
try{
    const session =req.session.user
    const email = session.email
    const userData = await user.findOne({email:email})
    res.render('user/profile',{userData})
}
catch(err){
    next(err)
};
}


const editProfile = async (req, res,next) => {
   try{
    const session = req.session.user
    const email = session.email
    const userData = await user.findOne({email:email})
    console.log(userData);
    res.render('user/editProfile',{userData})
   }catch(err){
    next(err)
   }
   
  };

 const postEditProfile = async (req,res,next)=>{
try{


    const session = req.session.user
    console.log(session);
     await user.updateOne(
      {email : session},
      {
        $set: {

          username: req.body.name,
          phonenumber:req.body.phone,
          email:req.body.email,
          addressDetails:[
            {
              housename:req.body?.housename,
              area:req.body?.area,
              landMark:req.body?.landmark,
              district:req.body?.district,
              state:req.body?.state,
              postoffice:req.body?.postoffice,
              pin:req.body?.pin,
            },
          ],
        },
      },
      ) 
      res.redirect('/profile')
  }catch(err){
    next(err)
  }

}

     module.exports={
        editProfile,
        viewProfile,
        postEditProfile
       
     }