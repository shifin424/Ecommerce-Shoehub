const express = require('express');
const userController = require('../controllers/userController');
const router = express()
const session = require("../middlewares/session");
const profileController = require('../Controllers/userProfileController')


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', userController.getHome)
router.get('/login', session.verifyLoginUser, userController.getLogin)
router.post('/postlogin', userController.postlogin)

router.get('/profile',session.userLogin,profileController.viewProfile)
router.get('/editProfile',session.userLogin,profileController.editProfile);
router.post('/postEditProfile',session.userLogin,profileController.postEditProfile)

router.get('/Signup', session.verifyLoginUser, userController.getsignup)
router.get('/otp', session.verifyLoginUser,userController.getOtpPage)
router.post('/otp', userController.postOtp)
router.post('/postSignup', userController.postSignup)
router.post('/resend', userController.userResend)

router.get('/forgotPassword', session.verifyLoginUser, userController.forgotPassword)
router.post('/forgotPassword', userController.postForgotPassword)
router.post('/post-forgot-password', userController.postOtp)
router.post('/postOtpSignup', userController.getOtpPage)
router.post('/postForgotOtp', userController.postforgototp)
router.post('/forgot-new-password', userController.forgotNewPassword)

router.get('/userTwoFactor',userController.twoFactor)
 router.post('/twoFactorLogin',userController.usertwofactor)

router.get('/logout', userController.userLogout)


module.exports = router;