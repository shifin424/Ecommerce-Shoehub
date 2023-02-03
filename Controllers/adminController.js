const user = require('../model/userSchema');
const products = require('../model/productSchema');
const categories = require('../model/categorySchema');
const mongoose = require("mongoose");
const coupon = require('../model/couponSchema');
const dotenv = require('dotenv');
const subCategories = require('../Model/subCategorySchema')
const adminSession = require('../middlewares/session')
const moment = require("moment");
moment().format();
dotenv.config();



const aEmail = process.env.ADMIN_NAME
const aPassword = process.env.ADMIN_PASSWORD
console.log(aEmail);
console.log(aPassword);



  const  getAdminLogin = (req, res, next) => {
        try {
            req.session.errmessage = false
            res.render('admin/login')
        } catch (err) {
            next(err)
        }


    };

   const  postAdminLogin = (req, res, next) => {

        try {
            if (req.body.email === aEmail && req.body.password === aPassword) {
                req.session.admin = true
                res.render('admin/home');
            } else {
                req.session.errmessage = "invalid Email or password"
                res.render('admin/login', { invalid: "invalid username or password" });
            }
        } catch (err) {
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
            next(err)
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
        adminLogout,
        getAdminHome,
        getAllUsers,
        blockUser,
        unblockUser,
    }


