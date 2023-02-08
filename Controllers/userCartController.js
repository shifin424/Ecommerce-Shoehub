const cart = require('../model/cartSchema');
const users = require('../model/userSchema')
const products = require('../model/productSchema');
const mongoose = require("mongoose");




const addToCart = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id);
    const session = req.session.user;

    let proObj = {
        productId: objId,
        quantity: 1,

    };
    const userData = await users.findOne({ email: session.email });

    const userCart = await cart.findOne({ userId: userData._id });
    if (userCart) {
        let proExist = userCart.product.findIndex(
            (product) => product.productId == id
        );
        if (proExist != -1) {
            await cart.aggregate([
                {
                    $unwind: "$product",
                },
            ]);

            const newCart = new cart({
                userId: userData.id,
                product: [
                    {
                        productId: objId,
                        quantity: 1,

                    },
                ],
            });
            newCart.save().then(() => {

                res.redirect("/viewcart");


            });


        } else {
            cart
                .updateOne({ userId: userData._id }, { $push: { product: proObj } })
                .then(() => {

                    res.redirect("/viewcart");

                });
        }
    } else {
        const newCart = new cart({
            userId: userData.id,
            product: [
                {
                    productId: objId,
                    quantity: 1,
                },
            ],
        });
        newCart.save().then(() => {

            res.redirect("/viewcart");


        });
    }

};



const viewCart = async (req, res) => {
    const session = req.session.user;
    const cEmail = session.email
    const userData = await users.findOne({ email: cEmail });
    const productData = await cart
        .aggregate([
            {
                $match: { userId: userData.id },
            },
            {
                $unwind: "$product",
            },
            {
                $project: {
                    productItem: "$product.productId",
                    productQuantity: "$product.quantity",

                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productItem",
                    foreignField: "_id",
                    as: "productDetail",
                },
            },
            {
                $project: {
                    productItem: 1,
                    productQuantity: 1,
                    productSize: 1,
                    productDetail: { $arrayElemAt: ["$productDetail", 0] },
                },
            },
            {
                $addFields: {
                    productPrice: {
                        $multiply: ["$productQuantity", "$productDetail.price"]
                    }
                }
            }
        ])
        .exec();
    const sum = productData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
    }, 0);
    countInCart = productData.length;
    let id = req.params.id
    let product = await products.findOne({ _id: id })
    res.render("user/cart", { productData, sum, countInCart, product: product });
};



const removeProduct = async (req, res) => {
    const data = req.body;
    const objId = mongoose.Types.ObjectId(data.product);
    await cart.aggregate([
        {
            $unwind: "$product"
        }
    ]);
    await cart
        .updateOne(
            { _id: data.cart, "product.productId": objId },
            { $pull: { product: { productId: objId } } }
        )
        .then(() => {
            res.json({ status: true });
        });
};







module.exports = {

    viewCart,
    addToCart,
    removeProduct,


}

