const coupon = require('../model/couponSchema');
const moment = require("moment");
moment().format();





const getCouponPage = async (req, res, next) => {
    try {
        const couponData = await coupon.find()
        res.render('admin/coupon', { couponData })
    } catch (err) {
        next(err)
    }
};



const addCoupon = (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        const dis = parseInt(data.discount);
        const maxLimit = parseInt(data.maxLimit);
        const discount = dis / 100;
        coupon.create({
            couponName: data.couponName,
            discount: discount,
            maxLimit: maxLimit,
            expirationTime: data.expirationTime,
        }).then((data) => {
            res.redirect("/admin/coupon")
        });
    } catch {
        console.error();
        res.render("user/error")
    }
};


const deleteCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;
        await coupon.updateOne({ _id: id }, { $set: { delete: true } })
        res.redirect('/admin/coupon');
    } catch (error) {
        next(error)
    }
};

const removeCoupon = async (req, res, next) => {

    try {
        const id = req.params.id;
        console.log(id);
        await coupon.deleteOne({ _id: id });
        res.redirect("/admin/coupon");
    } catch (error) {
        next(error)
    }
};

const restoreCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;
        await coupon.updateOne({ _id: id }, { $set: { delete: false } });
        res.redirect("/admin/coupon");
    } catch (error) {
        next(error)
    }
};

const editCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        coupon.updateOne(
            { _id: id },
            {
                couponName: data.couponName,
                discount: data.discount / 100,
                maxLimit: data.maxLimit,
                expirationTime: data.expirationTime
            }
        ).then(() => {
            res.redirect("/admin/coupon");
        })
    } catch (error) {
        next(error)
    }
};




module.exports = {

    addCoupon,
    deleteCoupon,
    removeCoupon,
    restoreCoupon,
    editCoupon,
    getCouponPage,

}