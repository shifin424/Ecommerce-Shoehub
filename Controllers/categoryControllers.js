const categories = require('../model/categorySchema');
const subCategories = require('../Model/subCategorySchema')




const addCategory = async (req, res, next) => {
    try {
        if (req.body.name) {
            const name = req.body.name
            const catgry = await categories.findOne({ category_name: name });
            if (catgry) {
                req.session.categoryExist = "category already exist";
                res.redirect('/admin/category')
            } else {
                const category = new categories({
                    category_name: req.body.name
                })
                await category.save()
                res.redirect('/admin/category');
            }
        } else {
            res.redirect('/admin/category')
        }
    } catch (err) {
        next(err)
    }

};

const addSubCategory = async (req, res, next) => {
    try {
        if (req.body.name) {
           
            const name = req.body.name
            console.log(name);
            const subcatgry = await subCategories.findOne({ subcategory_name: name });
            console.log(subcatgry);
            if (subcatgry) {
                req.session.subcategoryExist = "subCategory  already exit";
                res.redirect('/admin/subCategory')
            } else {
                const subcategory = new subCategories({
                    subcategory_name: req.body.name
                })
                await subcategory.save()
                res.redirect('/admin/subCategory');
            }
        } else {
            res.redirect('/admin/subCategory')
        }
    } catch (err) {
        next(err)
    }
};

const getCategory = async (req, res, next) => {
    try {
        const category = await categories.find();
        res.render('admin/category', { category });
    } catch (err) {
        next(err)
    }
};

const getsubCategory = async (req, res, next) => {
    try {
        const subCategory = await subCategories.find();
        res.render('admin/subCategory', { subCategory })
    } catch (err) {
        next(err)
    }
};


const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await categories.deleteOne({ _id: id })
        res.redirect('/admin/category')
    } catch (err) {
        next(err)
    }
};

const deletesubCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        await subCategories.deleteOne({ _id: id })
        res.redirect('/subCategory')
    } catch (err) {
        next(err)
    }
};

const subCategory = async (req, res, next) => {
    try {
        const subcategory = await subCategories.find();
        console.log(subcategory);
        res.render('admin/subCategory', { subCategory: subCategory })
    } catch (err) {
        next(err)
    }
};





module.exports = {

    addCategory,
    addSubCategory,
    getCategory,
    deleteCategory,
    deleteCategory,
    subCategory,
    deletesubCategory,
    getsubCategory

}