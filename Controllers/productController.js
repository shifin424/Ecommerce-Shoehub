const products = require('../model/productSchema');
const categories = require('../model/categorySchema');












const addProduct = async (req, res, next) => {
    try {
        const category = await categories.find()
        res.render('admin/addProduct', { category: category });
    } catch (err) {
        next(err)
    }
}

   const  postProduct = async (req, res,next) => {
        try {
            let categoryId = req.body.category;
           
            const product = new products({
                image1 : req.files[0].filename,
                image2 : req.files[1].filename,
                image3 : req.files[2].filename,
                name: req.body.product_name,
                price: req.body.price,
                category: categoryId,
                description: req.body.description,
                stock: req.body.stock,
                size: req.body.size
            })
             product.save()
             res.redirect('/productdetails')
          
        } catch (err) {
            next(err)
        }
    };

    

   const  editProduct = async (req, res, next) => {
        try {
            const id = req.params.id;
            const category = await categories.find()
            const productData = await products.findOne({ _id: id })
            res.render('admin/editProduct', { productData, category })
        } catch (err) {
            next(err)
        }
    };


const postEditProduct = async (req, res, next) => {
    try {

        const id = req.params.id;

        await products.updateOne({ _id: id }, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description,
                stock: req.body.stock,
                image1 : req.files[0].filename,
                image2 : req.files[1].filename,
                image3 : req.files[2].filename, 

            }
            
        })
        const directorypath = "public/"+req.body.image1
        fs.unlink(directorypath,(err)=>{
            if(err){
                throw err;
            }
            console.log("Delete image successfully");
        })
        res.redirect('/productDetails')
        

    } catch (err) {
        next(err
        )
    }

};

const productDetails = async (req, res, next) => {

    try {

        const product = await products.find().populate('category');
        res.render('admin/productDetails', { product })
    } catch (err) {
        next(err)
    }

};

const addSize = async (req, res,next) => {
    try {
        const product = req.body.product;
        const size = req.body.size;
        const productId = mongoose.Types.ObjectId(product);
        await products.findOneAndUpdate({ _id: productId }, { $push: { size: size } });
        res.redirect('/admin/productDetails')
    } catch (error) {
        next(error)
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        await products.updateOne({ _id: id }, { $set: { delete: true } })
        res.redirect('/admin/productDetails')
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
    productDetails
} 