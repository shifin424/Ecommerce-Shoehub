const categories = require('../model/categorySchema');
const subCategories = require('../model/subCategorySchema')
const mongoose = require('mongoose')




const addCategory = async (req, res, next) => {
    try {
        const { name, subname } = req.body;

        const existingCategory = await categories.findOne({ category_name: name });
        if (existingCategory) {
            req.session.categoryExist = "category already exists";
            return res.redirect('/admin/category');
        }
        const subcategoryArray = await subCategories.find({ _id: subname })
        console.log(subcategoryArray);

        const category = new categories({
            category_name: name,
            subcategory: subcategoryArray
        });
        await category.save();

        res.redirect('/admin/category');
    } catch (err) {
        next(err);
    }
};


const getsubCategories = async (req, res, next) => {
    try {
        const categoryID = req.body.category;
        const categoryId = mongoose.Types.ObjectId(categoryID);
        const category = await categories.findOne({ _id: categoryId }).populate("subcategory").select("subcategory");
        const subcategoryIds = category.subcategory;
        const subcategories = await subCategories.find({ _id: { $in: subcategoryIds } }).select("subcategory_name");
        console.log(subcategories,1);
        res.json(subcategories);
    } catch (err) {
        console.log(err);
        next(err);
    }
}


const editCategory = async (req, res) => {
    if (req.body.name) {
        const name = req.body.name
        const id = req.params.id;
        const category = await categories.findOne({ category_name: name });
        if (category) {
            req.session.editCategoryExist = "Category already exist";
            res.redirect('/admin/category')
        } else {
            await categories.updateOne({ _id: id }, {
                $set: {
                    category_name: req.body.name
                }
            });
            res.redirect('/admin/category');
        }

    } else {
        res.redirect('/admin/category')
    }
}



const editSubCategory = async (req, res) => {
    if (req.body.name) {
        const name = req.body.name
        const id = req.params.id;
        const subcatgry = await subCategories.findOne({ subcategory_name: name });
        if (subcatgry) {
            req.session.subcategoryExist = "SubCategory already exist";
            res.redirect('/admin/subCategory')
        } else {
            await subCategories.updateOne({ _id: id }, {
                $set: {
                    subcategory_name: req.body.name
                }
            });
            res.redirect('/admin/subCategory');
        }

    } else {
        res.redirect('/admin/subCategory')
    }
}


const addSubCategory = async (req, res, next) => {
    try {
        if (req.body.name) {

            const name = req.body.name
            const subcatgry = await subCategories.findOne({ subcategory_name: name });
            if (subcatgry) {
                req.session.subcategoryExist = "subCategory  already exit";
                res.redirect('/admin/subCategory')
            } else {
                const subcategory = new subCategories({
                    category_id: req.params.id,
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
        const subcategory = await subCategories.find()
        res.render('admin/category', { category, subcategory });
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
    const id = req.params.id;
    await categories.updateOne({ _id: id }, { $set: { delete: true } })
    res.redirect('/admin/category')
};

const restoreCategory = async (req, res) => {
    const id = req.params.id
    await categories.updateOne({ _id: id }, { $set: { delete: false } })
    res.redirect('/admin/category');
};

const deleteSubCategory = async (req, res) => {
    const id = req.params.id;
    await subCategories.updateOne({ _id: id }, { $set: { delete: true } })
    res.redirect('/admin/SubCategory')
};

const restoreSubCategory = async (req, res) => {
    const id = req.params.id
    await subCategories.updateOne({ _id: id }, { $set: { delete: false } })
    res.redirect('/admin/SubCategory');
};



const subCategory = async (req, res, next) => {
    try {
        const subcategory = await subCategories.find();
        console.log(subcategory);
        res.render('subCategory', { subCategory: subCategory })
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
    deleteSubCategory,
    getsubCategory,
    editCategory,
    restoreCategory,
    restoreSubCategory,
    editSubCategory,
    getsubCategories

}