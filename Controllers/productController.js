const products = require('../model/productSchema');
const categories = require('../model/categorySchema');
const fs = require('fs');
const mongoose = require("mongoose");
const subCategories = require('../Model/subCategorySchema');
const cart = require('../model/cartSchema')










const addProduct = async (req, res, next) => {
    try {
        const category = await categories.find().populate("subcategory.subId")
        console.log(category);
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
            

            }

        })
        res.redirect('/admin/productdetails')


    } catch (err) {
        next(err )
    }

};


const changeImage1 = async (req,res) => {
    try{

        await products.updateOne({_id: req.params.id},
            {$set: 
                { 
                    image1 : req.file.filename,
                }
            })

            const directoryPath = "public/" + req.body.image1;
            fs.unlink(directoryPath , (err) => {
                try{
                    if (err) {
                        throw err;
                    }
                    console.log("Delete Image 1 successfully.");
                }catch(err){
                    console.error(`Error Deleting image : ${err}`);
                }
            });
        res.redirect('/admin/productdetails');

    }catch(err){
        console.error(`Error Change Image 1 : ${err}`);
        res.redirect('/admin/productdetails');
    }
}


const changeImage2 = async (req,res) => {
    try{

        await products.updateOne({_id: req.params.id},
            {$set: 
                { 
                    image2 : req.file.filename,
                }
            })

            const directoryPath = "public/" + req.body.image2;
            fs.unlink(directoryPath , (err) => {
                try{
                    if (err) {
                        throw err;
                    }
                    console.log("Delete Image 2 successfully.");
                }catch(err){
                    console.error(`Error Deleting image : ${err}`);
                }
            });
        res.redirect('/admin/productdetails');

    }catch(err){
        console.error(`Error Change Image 2 : ${err}`);
        res.redirect('/admin/productdetails');
    }
}


const changeImage3 = async (req,res) => {
    try{

        await products.updateOne({_id: req.params.id},
            {$set: 
                { 
                    image3 : req.file.filename,
                }
            })

            const directoryPath = "public/" + req.body.image3;
            fs.unlink(directoryPath , (err) => {
                try{
                    if (err) {
                        throw err;
                    }
                    console.log("Delete Image 3 successfully.");
                }catch(err){
                    console.error(`Error Deleting image : ${err}`);
                }
            });
        res.redirect('/admin/productdetails');

    }catch(err){
        console.error(`Error Change Image 3 : ${err}`);
        res.redirect('/admin/productdetails');
    }
}






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
        await cart.updateMany({}, {$pull: {product: {productId: id}}})
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
    changeImage2 ,
    changeImage3

} 