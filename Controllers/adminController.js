const user = require('../model/userSchema');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const twoFactor = require('../model/twofactorSchema')
const mailer = require("../middlewares/otpValidation");
const adminSession = require('../middlewares/session')

dotenv.config();



const adminEmail = process.env.ADMIN_NAME
const adminPassword = process.env.ADMIN_PASSWORD
console.log(adminEmail);
console.log(adminPassword);



  const  getAdminLogin = (req, res, next) => {
        try {
            req.session.errmessage = false
            res.render('admin/login')
        } catch (err) {
            next(err)
        }


    };

   const  postAdminLogin = async (req, res, next) => {

        try {
            if (req.body.email === adminEmail && req.body.password === adminPassword) {
                req.session.admin = true

                const OTP = `${Math.floor(1000 + Math.random() * 9000)}`
                console.log(OTP);
                const botp = await bcrypt.hash(OTP, 10)

                const mailDetail = {
                    from: process.env.MAILER_EMAIL,
                    to: adminEmail,
                    subject: 'Otp for SHOEHUB ',
                    html: `<p>Your OTP for registering in SHOEHUB  is ${OTP}</p>`
              
                  }
                  mailer.mailTransporter.sendMail(mailDetail, async function (err) {
        
                    twoFactor.deleteOne({ email: adminEmail }).then(() => {
            
                      twoFactor.create({
                        email: adminEmail,
                        otp: botp
                      }).then(() => {
            
                        res.redirect(`/admin/twoFactorAdmin?email=${adminEmail}`);
            
                      })
            
                    })
            
                  })



              
            } else {
                invalid =req.session.errmessage = "invalid Email or password";
                req.session.errmessage = false;
                res.render('admin/login', { invalid: "invalid username or password" });
            }
        } catch (err) {
            next(err)
        }
    };


    const twoFactorAdmin = (req,res,next) =>{
        try{
            email = req.query.email
            res.render('admin/twoFactorAdmin',{email})
        }catch(err){
            console.log(err);
        }
    };


    const postTwoFactor = async(req,res,next)=>{
        try{
            

           const  adminEmail = req.body.email;
           const adminOtp = req.body.otp
           

           const admOtp = await twoFactor.findOne({email:adminEmail})
           const bycpOtp = await bcrypt.compare(adminOtp, admOtp.otp )


           if(bycpOtp){
            res.redirect('/admin/home')
      
          }else{
            res.render("admin/twoFactorAdmin",{invalid :"invalid otp" })
          }


        }catch(err){
            next(err)
        }
    };

  const   adminLogout = (req, res, next) => {
        try {
            req.session.admin = null
            res.redirect('/admin')
        } catch (err) {
            next(err)
        }
    };

  const  getAdminHome = (req, res) => {
        try {
            res.render('admin/home');
        } catch (err) {
            next(error)
        }
    };


   const  getAllUsers = async (req, res, next) => {
        try {
            let users = await user.find();
            res.render('admin/userDetails', { users });
        } catch (err) {
            next(err)
        }
    };

   const blockUser = async (req, res) => {
        const id = req.params.id;
        await user.updateOne({ _id: id }, { $set: { isBlocked: true } }).then(() => {
            res.redirect("/admin/userDetails")
        })
    };


  const  unblockUser = async (req, res) => {
        const id = req.params.id;
        await user.updateOne({ _id: id }, { $set: { isBlocked: false } }).then(() => {
            res.redirect('/admin/userDetails');
        })
    };



    module.exports = {
        getAdminLogin,
        postAdminLogin,
        postTwoFactor,
        adminLogout,
        getAdminHome,
        getAllUsers,
        blockUser,
        unblockUser,
        twoFactorAdmin
    }


