const express = require('express');
const userController = require('../controllers/userController');
const router = express()
const session = require("../middlewares/session");
const profileController = require('../Controllers/userProfileController');
const cartController = require('../Controllers/userCartController')
const shopController = require('../Controllers/userShopController')
const checkoutController = require('../Controllers/userChekout')



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

router.post('/changeQuantity',session.userLogin,cartController.changeQuantity);

router.post('/removeProduct',session.userLogin,cartController.removeProduct);

router.get('/viewcart',session.userLogin,cartController.viewCart); 

router.get('/cart/:id',session.userLogin,cartController.addToCart) 

router.post('/cart/:id',session.userLogin,cartController.addToCart);

router.get('/shop',session.userLogin,shopController.getshop)

router.get('/checkout',session.userLogin,checkoutController.getCheckout)

router.get('/productView/:id',session.userLogin,shopController.getProductView)

router.get('/category/:id',session.userLogin,shopController.getCategoryWisePage);  

router.get('/forgotPassword', session.verifyLoginUser, userController.forgotPassword) 

router.post('/forgotPassword', userController.postForgotPassword)

router.post('/post-forgot-password', userController.postOtp)

router.post('/postOtpSignup', userController.getOtpPage)

router.post('/postForgotOtp', userController.postforgototp)

router.post('/forgot-new-password', userController.forgotNewPassword)

router.get('/userTwoFactor',userController.twoFactors)

 router.post('/twoFactorLogin',userController.usertwofactor)

router.get('/logout', userController.userLogout)


module.exports = router;