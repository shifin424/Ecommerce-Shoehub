const express = require('express');
const adminController = require('../controllers/adminController');
const { loginSession } = require('../middlewares/session');
const adminRouter = express()
const verifylogin  = require('../middlewares/session');
const adminSession=verifylogin.verifyLoginAdmin
const productController = require('../Controllers/productController')
const couponController = require('../Controllers/couponControllers')
const categoryController = require('../Controllers/categoryControllers')
const upload = require('../middlewares/uploadImage')
const bannerController = require('../Controllers/bannerController')
const orderController = require('../Controllers/orderController')





adminRouter.get('/',loginSession,adminController.getAdminLogin);

adminRouter.post('/signin',loginSession,adminController.postAdminLogin);

adminRouter.get('/dashBoard',adminSession,adminController.getAdminDashboard);

adminRouter.get('/salesReport',adminSession,adminController.salesReport);

adminRouter.get('/dailyReport',adminSession, adminController.dailyReport);

adminRouter.get('/monthlyReport',adminSession,adminController.monthlyReport);

adminRouter.get('/twoFactorAdmin',adminController.twoFactorAdmin);

adminRouter.post('/twoFactorAdmin',adminController.postTwoFactor)

adminRouter.get('/adminLogout',adminController.adminLogout);

adminRouter.get('/addProduct',adminSession,productController.addProduct);

adminRouter.post('/postProduct',upload.array('myFiles',3),adminSession,productController.postProduct);

adminRouter.get('/productdetails',adminSession,productController.productDetails);   

adminRouter.post('/changeImage1/:id',upload.single('myFile1'),adminSession,productController.changeImage1)

adminRouter.post('/changeImage2/:id',upload.single('myFile2'),adminSession,productController.changeImage2)

adminRouter.post('/changeImage3/:id',upload.single('myFile3'),adminSession,productController.changeImage3)

adminRouter.get('/editProduct/:id',adminSession,productController.editProduct);

adminRouter.post('/postEditproduct/:id',upload.array('myFiles',3),adminSession,productController.postEditProduct)

adminRouter.post('/addSize',adminSession,productController.addSize);

adminRouter.get('/deleteproduct/:id',adminSession,productController.deleteProduct);

adminRouter.get('/restoreProduct/:id',adminSession,productController.restoreProduct);

adminRouter.get('/category',adminSession,categoryController.getCategory);

adminRouter.post('/editCategory/:id',adminSession,categoryController.editCategory)

adminRouter.post('/editSubCategory/:id',adminSession,categoryController.editSubCategory)

adminRouter.get('/restoreCategory/:id',adminSession,categoryController.restoreCategory)

adminRouter.get('/restoreSubCategory/:id',adminSession,categoryController.restoreSubCategory)

adminRouter.post('/addCategory',adminSession,categoryController.addCategory);

adminRouter.get('/deleteCategory/:id',adminSession,categoryController.deleteCategory);

adminRouter.get('/subCategory',adminSession,categoryController.getsubCategory);

adminRouter.post('/addSubCategory',adminSession,categoryController.addSubCategory);

adminRouter.get('/deleteSubCategory/:id',adminSession,categoryController.deleteSubCategory);

adminRouter.get('/userDetails',adminSession,adminController.getAllUsers);

adminRouter.get('/blockUser/:id',adminSession,adminController.blockUser);

adminRouter.get('/unblockUser/:id',adminSession,adminController.unblockUser);

adminRouter.get('/coupon',adminSession,couponController.getCouponPage);

adminRouter.post('/addCoupon',adminSession,couponController.addCoupon);

adminRouter.get('/deleteCoupon/:id',adminSession,couponController.deleteCoupon);

adminRouter.get('/removeCoupon/:id',adminSession,couponController.removeCoupon);

adminRouter.get('/restoreCoupon/:id',adminSession,couponController.restoreCoupon);

adminRouter.post('/editCoupon/:id',adminSession,couponController.editCoupon);

adminRouter.get('/getBanner',adminSession,bannerController.getBannerPage);

adminRouter.post('/addBanner',upload.single('bannerImage'),adminSession,bannerController.addBanner);

adminRouter.post('/editBanner/:id',adminSession,bannerController.editBanner);

adminRouter.get('/deleteBanner/:id',adminSession,bannerController.deleteBanner);

adminRouter.get('/restoreBanner/:id',adminSession,bannerController.restoreBanner);

adminRouter.get('/order',adminSession,orderController.getOrders)

adminRouter.get('/orderedProduct/:id',adminSession,orderController.getOrderedProduct)

adminRouter.post('/orderStatuschange/:id',orderController.orderStatusChanging)




module.exports = adminRouter;