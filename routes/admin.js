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





adminRouter.get('/',loginSession,adminController.getAdminLogin);

adminRouter.post('/signin',loginSession,adminController.postAdminLogin);

adminRouter.get('/home',adminSession,adminController.getAdminHome);

adminRouter.get('/twoFactorAdmin',adminController.twoFactorAdmin);

adminRouter.post('/twoFactorAdmin',adminController.postTwoFactor)

adminRouter.get('/adminLogout',adminController.adminLogout);

adminRouter.get('/addProduct',adminSession,productController.addProduct);

adminRouter.post('/postProduct',upload.array('myFiles',3),adminSession,productController.postProduct);


adminRouter.get('/productdetails',adminSession,productController.productDetails);

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



module.exports = adminRouter;