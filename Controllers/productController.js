const products = require('../model/productSchema');
const categories = require('../model/categorySchema');
const fs = require('fs');
const mongoose = require("mongoose");
const subCategories = require('../Model/subCategorySchema');










const addProduct = async (req, res, next) => {
    try {
        const category = await categories.find()
        const subCategory = await subCategories.find()
        res.render('admin/addProduct', { category,subCategory  });
    } catch (err) {
        next(err)
    }
}



const postProduct = async (req, res, next) => {
    try {
        let categoryId = req.body.category;
        let subCategoryId = req.body.subcategory;
    

        const product = new products({
            image1: req.files[0].filename,
            image2: req.files[1].filename,
            image3: req.files[2].filename,
            name: req.body.product_name,
            price: req.body.price,
            category: categoryId,
            subCategory:subCategoryId,
            description: req.body.description,
            stock: req.body.stock,
            size: req.body.size
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
        const productData = await products.findOne({ _id: id })
        res.render('admin/editProduct', { productData, category ,subCategory})
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
                subCategory:req.body.subCategory,
                description: req.body.description,
                stock: req.body.stock,
                image1: req.files[0].filename,
                image2: req.files[1].filename,
                image3: req.files[2].filename,

            }

        })
        const directorypath1 = "public/" + req.body.image1
        const directorypath2 = "public/" + req.body.image2
        const directorypath3 = "public/" + req.body.image3
        const path = [directorypath1, directorypath2, directorypath3]
        for (i = 0; i < 3; i++) {
            fs.unlink(path[i], (err) => {
                if (err) {
                    throw err;
                }
                console.log("Deleted image successfully");
            })
        }
       
        res.redirect('/admin/productdetails')


    } catch (err) {
        next(err )
    }

};






const productDetails = async (req, res, next) => {

    try {

        const product = await products.find().populate('category').populate('subCategory');
        res.render('admin/productdetails', { product })
    } catch (err) {
        next(err)
    }

};

const addSize = async (req, res, next) => {
    try {
        const product = req.body.product;
        const size = req.body.size;
        const productId= mongoose.Types.ObjectId(product);    
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

} 