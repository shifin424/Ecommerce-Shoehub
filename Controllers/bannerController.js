
const { Error } = require('mongoose');
const banner = require('../model/bannerSchema')

const getBannerPage = async (req, res, next) => {
    try {
        const bannerData = await banner.find()
        res.render('admin/banner', { bannerData });
    } catch (err) {
        next(err)
    }
};


const addBanner = async (req, res, next) => {
    try {
        let BannerImage = `productImages/${Date.now()}${ req.file.bannerImage}`;
        sharp(req.file.buffer)
         .toFormat("png","jpg","jpeg")
        //    .resize(255,380)
           .toFile(`public/${FirstImage}`);
        await banner.create({
            offerType: req.body.offerType,
            bannerText: req.body.bannerText,
            couponName: req.body.couponName,
            bannerImage: BannerImage,
        }).then((data) => {
            res.redirect('/admin/getBanner')
        })
    } catch (err) {
        next(err)
    }

};

const editBanner = async (req, res, next) => {
    try {



        const id = req.params.id;
        const editedData = req.body;
        await banner.updateOne(
            { _id: id },
            {
                offerType: editedData.offerType,
                bannerText: editedData.bannerText,
                couponName: editedData.couponName,
            }
        ).then(() => {
            res.redirect('/admin/getBanner');
        })

    } catch (err) {
        next(err)
    }
};


const deleteBanner = async (req, res, next) => {
    try {

        const id = req.params.id;
        await banner.updateOne({ _id: id }, { $set: { isDeleted: true } })
        res.redirect('/admin/getBanner');
    } catch (err) {
        next(err)
    }

};

const restoreBanner = async (req, res, next) => {
    try {
        const id = req.params.id;
        await banner.updateOne({ _id: id }, { $set: { isDeleted: false } });
        res.redirect("/admin/getBanner");
    } catch (err) {
        next(err)
    }
};




module.exports = {
    getBannerPage,
    addBanner,
    editBanner,
    deleteBanner,
    restoreBanner,
}