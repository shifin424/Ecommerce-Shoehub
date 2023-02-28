const products = require('../model/productSchema');
const categories = require('../model/categorySchema');
const fs = require('fs');
const mongoose = require("mongoose");
const subCategories = require('../model/subCategorySchema');
const cart = require('../model/cartSchema')
const sharp = require('sharp')
const path  = require('path')




const addProduct = async (req, res, next) => {
    try {
        const category = await categories.find().populate("subcategory.subId")
        const subCategory = await subCategories.find()
        res.render('admin/addProduct', { category, subCategory });
    } catch (err) {
        next(err)
    }
}



const postProduct = async (req, res, next) => {
    try {
        let categoryId = req.body.category;
        let subCategoryId = req.body.subcategory;
        let FirstImage = `productImages/${Date.now()}${ req.files[0].originalname}`;
        sharp(req.files[0].buffer)
         .toFormat("png","jpg","jpeg")
        //    .resize(255,380)
           .toFile(`public/${FirstImage}`);
        let SecondImage = `productImages/${Date.now()}${ req.files[1].originalname}`;
        sharp(req.files[1].buffer)
         .toFormat("png","jpg","jpeg")
        //  .resize(255,380)
           .toFile(`public/${SecondImage}`);

        let ThirdImage = `productImages/${Date.now()}${ req.files[2].originalname}`;
        sharp(req.files[2].buffer)
         .toFormat("png","jpg","jpeg")
        // .resize(255,380)
          .toFile(`public/${ThirdImage}`);

        const product = new products({
            image1: FirstImage,
            image2:SecondImage,
            image3: ThirdImage,
            name: req.body.product_name,
            price: req.body.price,
            category: categoryId,
            subCategory: subCategoryId,
            stock: req.body.stock,
            size: req.body.size,
            brand:req.body.brand,
            description:req.body.description
        })
        product.save()
        res.redirect('/admin/productDetails')

    } catch (err) {
        next(err)
    }
};


const editProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await categories.find()
        const subCategory = await subCategories.find()
        const productData = await products.findOne({ _id: id }).populate('category').populate('subCategory')
        console.log(productData,1);
        res.render('admin/editProduct', { productData, category, subCategory })
    } catch (err) {
        next(err)
    }
};


const postEditProduct = async (req, res, next) => {
    try {

        const id = req.params.id;
        console.log(req.body.image2)
        await products.updateOne({ _id: id }, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                subCategory: req.body.subCategory,
                description: req.body.description,
                stock: req.body.stock,
                brand:req.body.brand


            }

        })
        res.redirect('/admin/productdetails')


    } catch (err) {
        next(err)
    }

};

const getProductView = async (req, res, next) => {
    try {
        let id = req.params.id
        let product = await products.findOne({ _id: id }).populate('category')

        res.render('user/productView', { product: product })
    } catch (err) {
        next(err)
    }
};


const changeImage1 = async (req, res) => {
    try {

  let FirstImage = `productImages/${Date.now()}${ req.file.myFile1}`;
  
        sharp(req.file.buffer)
         .toFormat("png","jpg","jpeg")
        //    .resize(255,380)
           .toFile(`public/${FirstImage}`);
           
        await products.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    image1:FirstImage,
                }
            })

        
        res.redirect('/admin/productdetails');

    } catch (err) {
        console.error(`Error Change Image 1 : ${err}`);
        res.redirect('/admin/productdetails');
    }
}


const changeImage2 = async (req, res) => {
    try {

        let SecondImage = `productImages/${Date.now()}${ req.file.myFile2}`;
  
        sharp(req.file.buffer)
         .toFormat("png","jpg","jpeg")
        //    .resize(255,380)
           .toFile(`public/${FirstImage}`);
           
        await products.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    image2:SecondImage,
                }
            })

        
        res.redirect('/admin/productdetails');

    } catch (err) {
        console.error(`Error Change Image 2 : ${err}`);
        res.redirect('/admin/productdetails');
    }
}


const changeImage3 = async (req, res) => {
    try {

        let ThirdImage = `productImages/${Date.now()}${ req.file.myFile2}`;
  
        sharp(req.file.buffer)
         .toFormat("png","jpg","jpeg")
        //    .resize(255,380)
           .toFile(`public/${FirstImage}`);
           
        await products.updateOne({ _id: req.params.id },
            {
                $set:
                {
                    image2:ThirdImage ,
                }
            })

        
        res.redirect('/admin/productdetails');

    } catch (err) {
        console.error(`Error Change Image 3 : ${err}`);
        res.redirect('/admin/productdetails');
    }
}






const productDetails = async (req, res, next) => {
    try {
        const product = await products.find().populate('category').populate('subCategory');
        res.render('admin/productDetails', { product })
    } catch (err) {
        next(err)
    }

};

const addSize = async (req, res, next) => {
    try {
        const product = req.body.product;
        const size = req.body.size;
        const productId = mongoose.Types.ObjectId(product);
        await products.findOneAndUpdate({ _id: productId }, { $push: { size: size } });
        res.redirect('/admin/productdetails')
    } catch (error) {
        next(error)
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        await products.updateOne({ _id: id }, { $set: { delete: true } })
        await cart.updateMany({}, { $pull: { product: { productId: id } } })
        res.redirect('/admin/productdetails')
    } catch (err) {
        next(err)
    }

};

const restoreProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        await products.updateOne({ _id: id }, { $set: { delete: false } })
        res.redirect('/admin/productDetails')
    } catch (err) {
        next(err)
    }

};



module.exports = {
    addProduct,
    postProduct,
    editProduct,
    postEditProduct,
    restoreProduct,
    addSize,
    deleteProduct,
    productDetails,
    changeImage1,
    changeImage2,
    changeImage3,
    getProductView,

} 