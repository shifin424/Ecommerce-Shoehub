const express = require('express');
const userController = require('../Controllers/userController');
const router = express()
const session = require("../middlewares/session");
const profileController = require('../Controllers/userProfileController');
const cartController = require('../Controllers/userCartController')
const shopController = require('../Controllers/userShopController')
const checkoutController = require('../Controllers/userChekoutController')
 const orderController = require('../Controllers/userOrderController')
 const wishlistController = require('../Controllers/userWishlistController')



router.use(express.json());
router.use(express.urlencoded({ extended:true }));


router.get('/', userController.getHome)

router.get('/login', session.verifyLoginUser,userController.getLogin);

router.post('/postlogin',userController.postlogin)

router.get('/profile',session.userLogin,profileController.viewProfile)

router.get('/editProfile',session.userLogin,profileController.editProfile);

router.get('/chagProfilePassword',session.userLogin,profileController.getPasswordPage)

router.post('/postEditProfile',session.userLogin,profileController.postEditProfile)

router.post('/profileChangePass',session.userLogin,profileController.postChangePassword)

router.get('/Signup', session.verifyLoginUser, userController.getsignup)

router.get('/otp', session.verifyLoginUser,userController.getOtpPage)

router.post('/otp', userController.postOtp)

router.post('/postSignup', userController.postSignup)

router.post('/resend', userController.userResend)

router.post('/changeQuantity',session.userLogin,cartController.changeQuantity);

router.post('/removeProduct',session.userLogin,cartController.removeProduct);

router.get('/viewcart',session.userLogin,cartController.viewCart); 

router.get('/cart',session.userLogin,cartController.addToCart) 

router.post('/cart',session.userLogin,cartController.addToCart);

router.get('/shop',session.userLogin,shopController.getshop)

router.get('/sortLowToHigh',session.userLogin,shopController.sortLowToHigh)

router.get('/sortHighToLow',session.userLogin,shopController.sortHighToLow)

router.get('/productView/:id',session.userLogin,shopController.getProductView)

router.post('/productView/:id',session.userLogin,shopController.reviews)

router.get('/category/:id',session.userLogin,shopController.getCategoryWisePage);

router.post('/searchProduct',session.userLogin,shopController.searchProduct)

router.get('/checkout',session.userLogin,checkoutController.getCheckout)

router.post('/addNewAddress',session.userLogin,checkoutController.addNewAddress);

// router.post('/editAddress',session.userLogin,checkoutController.editAddress);
  
router.get('/orderSuccess',session.userLogin,checkoutController.orderSuccess)

router.post("/placeOrder",session.userLogin,checkoutController.placeOrder);

router.post("/verifyPayment",session.userLogin,checkoutController.verifyPayment);

router.get('/paymentFail',session.userLogin,checkoutController.paymentFail);

router.get('/orderDetails',session.userLogin,orderController .orderDetails)

router.get('/cancelOrder/:id',session.userLogin,orderController.cancelOrder)

router.get('/viewWishlist',session.userLogin,wishlistController.viewWishlist)

router.get('/wishList/:id',session.userLogin,wishlistController.addToWishlist);

router.post('/removeFromWishlist',session.userLogin,wishlistController.removeFromWishlist);

router.get('/orderedProduct/:id',session.userLogin,orderController.orderedProduct);

router.get('/forgotPassword', session.verifyLoginUser, userController.forgotPassword) 

router.post('/forgotPassword', userController.postForgotPassword)

router.post('/post-forgot-password', userController.postOtp)

router.post('/postOtpSignup', userController.getOtpPage)

router.post('/postForgotOtp', userController.postforgototp)

router.post('/forgot-new-password', userController.forgotNewPassword)

router.get('/userTwoFactor',userController.twoFactors)

 router.post('/twoFactorLogin',userController.usertwofactor)

router.get('/logout', userController.userLogout)

router.get('/contact',profileController.getContactPage)

router.get('/EditAddress',session.userLogin,profileController.editAddress)

router.get('/getAddressDetails/:userId',session.userLogin,checkoutController.fetchAddress)




module.exports = router;