
const mailer = require("../middlewares/otpValidation");
const otp = require('../model/otpSchema');
const user = require('../model/userSchema')
const bcrypt = require('bcrypt');
const { response } = require('express')
const sendMail = require('../config/mailSender');
const TFotp = require('../model/twofactorSchema')



//home page
const getHome = (req, res, next) => {
  try {
    let loging = req.session.user
    res.render('user/home', { loging })
  } catch (err) {
    next(err)
  }
};

//login page
const getLogin = (req, res, next) => {
  try {
    invalid = req.session.errMessage
    req.session.errMessage = false
    res.render("user/login",{invalid});
  } catch (err) {
    next(err)
  }
};


// signup page
const getsignup = (req, res, next) => {
  try {
    const session = req.session.user
    res.render("user/signup", { session })
  } catch (err) {
    next(err)
  }

};



// post signup 
const postSignup = async (req, res, next) => {
  try {

    const hash = await bcrypt.hash(req.body.password, 10)

    const userName = req.body.username
    const email = req.body.email
    const phoneNumber = req.body.phonenumber
    const password = hash


    const userData = await user.findOne({ email: email })

    if (userData) {
      res.render('user/signup', { err_message: 'User already exists' })
    } else {

      const User = {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: password
      }
      const mailer = await sendMail(User)
      console.log(mailer);
      if (mailer) {
        res.redirect(`/otp?username=${User.userName}&email=${User.email}&phonenumber=${User.phoneNumber}&password=${User.password}`);

      } else {
        console.log('error')
      }

    }

  } catch (err) {
    next(err)
  }

};



//post signupOtp details
const postOtp = (req, res, next) => {
  try {

    const body = req.body
    const userData = {
      username: body.username,
      email: body.email,
      phonenumber: body.phonenumber,
      password: body.password
    }
    otp.findOne({ email: body.email.trim() }).then(async (sendOtp) => {
      if (req.body.otp == sendOtp.otp) {

        res.redirect('/login')

        await user.create({
          username: body.username,
          email: body.email,
          phonenumber: body.phonenumber,
          password: body.password
        })


      } else {
        res.render('user/otp', { invalid: 'invalid otp', userData })
      }
    })

  } catch (error) {
    next(err)
  }
};



// login post
const postlogin = async (req, res, next) => {

  try {
    const email = req.body.email
    const password = req.body.password
    const userData = await user.findOne({ email: email })
    invalid = req.session.err_message;
    req.session.err_message = false;

    if (userData) {
      console.log(userData);
      if (userData.isBlocked === false) {
        const passwordMatch = await bcrypt.compare(password, userData.password)
        if (passwordMatch) {
          response.email = userData
          req.session.user = response.email


          


          res.redirect('/')
        } else {
          req.session.errMessage="Invalid password"
          res.redirect('/login')
        }
      } else {
        req.session.errMessage = "You can't login!!"
        res.redirect('/login')
      }
    } else {
      req.session.errMessage = 'Invalid password or email!!'
      res.render('user/login')
    }
  } catch (err) {
    nect(err)
  }
};


//rendering otp page
const getOtpPage = (req, res, next) => {
  try {
    let userData = req.query
    res.render('user/otp', { userData })
  } catch (err) {
    next(err)
  }
};

//rendering of 
const forgotPassword = (req, res, next) => {
  try {
    res.render("user/forgotPassword")
  } catch (err) {
    next(err)
  }
};


//forgot password post
const postForgotPassword = async (req, res, next) => {

  try {

    const userEmail = req.body.email;

    const userData = req.body;
    const isUserExist = await user.findOne({ email: userEmail });
    const OTP = `${Math.floor(1000 + Math.random() * 9000)}`
    console.log(OTP);
    const botp = await bcrypt.hash(OTP, 10)
    
    const mailDetails = {

      from: process.env.MAILER_EMAIL,
      to: userEmail,
      subject: 'Otp for SHOEHUB ',
      html: `<p>Your OTP for registering in SHOEHUB  is ${OTP}</p>`

    }
    if (isUserExist) {
      console.log(isUserExist);
      mailer.mailTransporter.sendMail(mailDetails, async function (err) {

        otp.deleteOne({ email: userEmail }).then(() => {

          otp.create({
            email: userEmail,
            otp: botp
          }).then(() => {

            res.render("user/postForgotOtp", { userEmail });

          })

        })

      })

    } else {
      res.render('user/forgotPassword', { invalid: "please enter a valid Email", userData })
    }

  } catch (err) {
    next(err)
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await products.updateOne({ _id: id }, { $set: { delete: true } })
    res.redirect('/admin/productDetails')
  } catch (err) {
    next(err)
  }

};



const postChangePassword = async (req, res, next) => {
  try {

    const newPassword = req.body.newPassword;
    const sNewPassword = await bcrypt.hash(newPassword, 10);
    const filter = { email: req.body.email };
    const update = { password: sNewPassword };
    await user.findOneAndUpdate(filter, update, {
      new: true
    }).then(() => {

      res.redirect('/login');
    })

  } catch (err) {
    next(err)
  }
};


//post for otp in changing password
const postforgototp = async (req, res, next) => {
  try {
    const body = req.body;
    const email = req.body.email
    const cotp = body.otp;
    const sendOtp = await otp.findOne({ email: body.email })


    const validOtp = await bcrypt.compare(cotp, sendOtp.otp);
    if (validOtp) {
      res.render('user/changePassword', { email });
    } else {
      res.render("user/forgotOTP", { email, error: "invalid OTP" })
    }
  } catch (err) {
    next(err)
  }
};



// post otp reset of passwordfinal
const forgotNewPassword = async (req, res, next) => {

  try {

    const email = req.body.email
    const password = req.body.password
    const hash = await bcrypt.hash(password, 10)
    if (password === req.body.conPassword) {

      await user.findOneAndUpdate(
        { email: email },
        { $set: { password: hash } })

      res.render('user/login')

    } else {

      res.render('user/changePassword', { email, invalid: 'Password must be same' })
    }


  } catch (err) {
    console.log(err);
  }

};


//user logout
const userLogout = (req, res, next) => {
  try {
    req.session.user = null
    res.redirect('/')
  } catch (err) {
    next(err)
  }
};

//change password 
const getpostotp = (req, res, next) => {
  try {
    res.render('user/changePassword')
  } catch (err) {
    next(err)
  }
};


const userResend = async (req, res, next) => {
  try {

    const hash = await bcrypt.hash(req.body.password, 10)

    const userName = req.body.username
    const email = req.body.email
    const phoneNumber = req.body.phonenumber
    const password = hash


    const User = {
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: password
    }
    const mailer = await sendMail(User)
    if (mailer) {
      console.log(mailer)
      res.redirect(`/otp?username=${User.userName}&email=${User.email}&phonenumber=${User.phoneNumber}&password=${User.password}`);
    } else {
      console.log('error')
    }



  } catch (err) {
    next(err)
  }



};

const twoFactor =(req,res,next)=> {
  try{
    res.render("user/userTwoFactor")
  }catch(err){
    next(err)
  }
}

const usertwofactor = async (req,res,next)=>{
  try{
    const useremail = req.body.email;

    const userdata = req.body;
    const isuserExist = await user.findOne({ email: userEmail });
    const TFotp = `${Math.floor(1000 + Math.random() * 9000)}`
    const bcryptotp = await bcrypt.hash(TFotp, 10)


    const mailDetail = {

      from: process.env.MAILER_EMAIL,
      to: useremail,
      subject: 'Otp for SHOEHUB ',
      html: `<p>Your OTP for registering in SHOEHUB  is ${TFotp}</p>`

    }

    if (isuserExist) {
      console.log(isuserExist);
      mailer.mailTransporter.sendMail(mailDetail, async function (err) {

        TFotp.deleteOne({ email: useremail }).then(() => {

          TFotp.create({
            email: useremail,
            otp: bcryptotp
          }).then(() => {

            res.render("user/home", { useremail });

          })

        })

      })

    } else {
      res.render('user/userTwoFactor', { invalid: "please enter a valid Email", userdata })
    }


}catch(err){
  next(err)
}
}

module.exports = {

  getHome, 
  getLogin,
  getsignup,
  postSignup,
  postOtp,
  postlogin,
  forgotPassword,
  deleteProduct,
  postForgotPassword,
  postChangePassword,
  postforgototp,
  forgotNewPassword,
  getpostotp,
  userResend,
  getOtpPage,
  userLogout,
  twoFactor,
  usertwofactor

};