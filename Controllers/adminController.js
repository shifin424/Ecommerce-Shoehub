const user = require('../model/userSchema');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const twoFactor = require('../model/twofactorSchema')
const mailer = require("../middlewares/otpValidation");
const adminSession = require('../middlewares/session')
const order = require('../model/orderSchema')
const products = require('../model/productSchema')
const moment = require("moment");
moment().format();



dotenv.config();



const adminEmail = process.env.ADMIN_NAME
const adminPassword = process.env.ADMIN_PASSWORD
console.log(adminEmail);
console.log(adminPassword);



const getAdminLogin = (req, res, next) => {
    try {
        req.session.errmessage = false
        res.render('admin/login')
    } catch (err) {
        next(err)
    }


};

const postAdminLogin = async (req, res, next) => {

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
            invalid = req.session.errmessage = "invalid Email or password";
            req.session.errmessage = false;
            res.render('admin/login', { invalid: "invalid username or password" });
        }
    } catch (err) {
        next(err)
    }
};


const twoFactorAdmin = (req, res, next) => {
    try {
        email = req.query.email
        res.render('admin/twoFactorAdmin', { email })
    } catch (err) {
        console.log(err);
    }
};


const postTwoFactor = async (req, res, next) => {
    try {


        const adminEmail = req.body.email;
        const adminOtp = req.body.otp


        const admOtp = await twoFactor.findOne({ email: adminEmail })
        const bycpOtp = await bcrypt.compare(adminOtp, admOtp.otp)


        if (bycpOtp) {
            res.redirect('/admin/dashBoard')

        } else {
            res.render("admin/twoFactorAdmin", { invalid: "invalid otp" })
        }


    } catch (err) {
        next(err)
    }
};

const adminLogout = (req, res, next) => {
    try {
        req.session.admin = null
        res.redirect('/admin')
    } catch (err) {
        next(err)
    }
};

const getAdminDashboard = async (req, res, next) => {
    try {
        const orderData = await order.find({ orderStatus: { $ne: "cancelled" } });
        const totalRevenue = orderData.reduce((accumulator, object) => {
            return accumulator + object.totalAmount;
        }, 0);
        const todayOrder = await order.find({
            orderDate: moment().format("MMM Do YY"),
        });
        const todayRevenue = todayOrder.reduce((accumulator, object) => {
            return accumulator + object.totalAmount;
        }, 0);
        const start = moment().startOf("month");
        const end = moment().endOf("month");
        const oneMonthOrder = await order.find({ orderStatus: { $ne: "cancelled" }, createdAt: { $gte: start, $lte: end }, })
        const monthlyRevenue = oneMonthOrder.reduce((accumulator, object) => {
            return accumulator + object.totalAmount
        }, 0);
        const allOrders = orderData.length;
        const pending = await order.find({ orderStatus: "pending" }).count();
        const shipped = await order.find({ orderStatus: "shipped" }).count();
        const delivered = await order.find({ orderStatus: "delivered" }).count();
        const cancelled = await order.find({ orderStatus: "cancelled" }).count();
        const cod = await order.find({ paymentMethod: "COD" }).count();
        const online = await order.find({ paymentMethod: "Online" }).count();
        const activeUsers = await user.find({ isBlocked: false }).count();
        const product = await products.find({ delete: false }).count();
        res.render('admin/home', { cod, online, pending, shipped, delivered, cancelled, totalRevenue, allOrders, activeUsers, product, monthlyRevenue, todayRevenue });
    } catch (err) {
        console.log(err);
        next(err)
    }
};


const getAllUsers = async (req, res, next) => {
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


const unblockUser = async (req, res) => {
    const id = req.params.id;
    await user.updateOne({ _id: id }, { $set: { isBlocked: false } }).then(() => {
        res.redirect('/admin/userDetails');
    })
};


const salesReport = async (req, res, next) => {
    try {
        const allsalesReport = await order.find({
            paymentStatus: "paid",
            orderStatus: "delivered",
        });
        res.render("admin/salesReport", { allsalesReport });
    } catch (err) {
        console.log(err);
        next(err)
    }
}

const dailyReport = async (req, res, next) => {
    try {
        const allsalesReport = await order.find({
            $and: [
                {
                    paymentStatus: "paid", orderStatus: "delivered"
                },
                {
                    orderDate: moment().format("MMM Do YY")
                }
            ]
        })
        console.log(allsalesReport);
        res.render("admin/salesReport", { allsalesReport });
    } catch (err) {
        console.log(err);
        next(err)
    }
}


const monthlyReport = async (req, res, next) => {
    try {
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        const allsalesReport = await order.find({
            $and: [
                { paymentStatus: "paid", orderStatus: "delivered" },
                { created: { $gte: d } }
            ],
        })
        res.render('admin/salesReport', { allsalesReport });
    } catch (err) {
        console.log(err);
        next(err)
    }
}




module.exports = {
    getAdminLogin,
    postAdminLogin,
    postTwoFactor,
    adminLogout,
    getAdminDashboard,
    getAllUsers,
    blockUser,
    unblockUser,
    twoFactorAdmin,
    salesReport,
    dailyReport,
    monthlyReport,

}


