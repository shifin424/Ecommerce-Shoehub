
const order = require('../model/orderSchema')
const mongoose = require('mongoose')




const getOrders = async (req, res, next) => {
    try {
        order.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]).then((orderDetails) => {
            res.render("admin/orders", { orderDetails });
        })
    } catch (err) {
        next(err)
    }
};


const orderStatusChanging = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await order.updateOne(
            { _id: id },
            {
                $set: {
                    orderStatus: data.orderStatus,
                    paymentStatus: data.paymentStatus,
                }
            }
        )
        res.redirect("/admin/order");
    } catch (err) {
        next(err)
    }
};

const getOrderedProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const objId = mongoose.Types.ObjectId(id)
        const productData = await order.aggregate([
            {
                $match: { _id: objId }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $project: {
                    productItem: "$orderItems.productId",
                    productQuantity: "$orderItems.quantity",
                    productSize: "$orderItems.size",
                    address: 1,
                    name: 1,
                    phoneNumber: 1
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productItem",
                    foreignField: "_id",
                    as: "productDetail"
                }
            },
            {
                $project: {
                    productItem: 1,
                    productQuantity: 1,
                    productSize: 1,
                    address: 1,
                    name: 1,
                    phoneNumber: 1,
                    productDetail: { $arrayElemAt: ["$productDetail", 0] }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productDetail.category',
                    foreignField: "_id",
                    as: "category_name"
                }
            },
            {
                $unwind: "$category_name"
            },

        ]);
        res.render('admin/orderDetails', { productData })
    } catch (err) {
        console.log(err);
        next(err)
    }
}



module.exports = {
    getOrders,
    orderStatusChanging,
    getOrderedProduct
}