const products = require('../model/productSchema');
const categories = require('../model/categorySchema');
const productSchema = require('../model/productSchema');

const getshop = async (req, res, next) => {
    try {
        let product = await products.find({ delete: false }).populate('category')
        const category = await categories.find();

        res.render('user/shop', { product, category })
    } catch (err) {
        next(err)
    }
}

const sortLowToHigh = async (req, res, next) => {
    try {
        let product = await products.find({ delete: false }).populate('category')
        product = product.sort((a, b) => a.price - b.price)
        const category = await categories.find();

        res.render('user/shop', { product, category })
    } catch (err) {
        console.log(err);
    }
}

const sortHighToLow = async (req, res, next) => {
    try {
        let product = await products.find({ delete: false }).populate('category')
        product = product.sort((a, b) => b.price - a.price)
        const category = await categories.find();

        res.render('user/shop', { product, category })
    } catch (err) {
        console.log(err);
        next(err)
    }
}

const getProductView = async (req, res, next) => {
    try {
        let id = req.params.id
        let product = await products.findOne({ _id: id }).populate('category')

        res.render('user/productView', { product: product })
    } catch (err) {
        next(err)
    }
};

const getCategoryWisePage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await categories.find();
        const product = await products.find({ category: id, delete: false }).populate('category');
        console.log(product);
        const productCount = await products.find({ category: id, delete: false }).populate('category').count();
        res.render('user/shop', { product, category, productCount })
    } catch (err) {
        next(err)
    }
};


const searchProduct = async(req,res,next)=>{
    try{
        const searchInput = req.body
        const category = await categories.find();

        const searchTerm = searchInput.searchInput;
        const product = await products.find({ name: { $regex: searchTerm, $options: 'i' } });
        console.log(product);
        
        res.render('user/shop', { product, category })

    }catch(err){
        console.log(err);
        next(err)
    }
};



module.exports = {
    getshop,
    getProductView,
    getCategoryWisePage,
    sortLowToHigh,
    sortHighToLow,
    searchProduct

}