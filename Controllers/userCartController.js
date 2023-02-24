const cart = require('../model/cartSchema');
const users = require('../model/userSchema')
const products = require('../model/productSchema');
const mongoose = require("mongoose");




const addToCart = async (req, res) => {
    const id = req.query.productid
    const objId = mongoose.Types.ObjectId(id);
    const session = req.session.user;



    const size = req.query.size;
    let productObj = {
        productId: objId,
        quantity: 1,
        size: size,

    };
    const userData = await users.findOne({ email: session.email });
    const userCart = await cart.findOne({ userId: userData._id });
    if (userCart) {
        let productExist = userCart.product.findIndex(
            (product) => product.productId == id
        );
        if (productExist != -1) {
            await cart.aggregate([
                {
                    $unwind: "$product",
                },
            ]);
            let sameSizeExist = userCart.product[0].size;
            if (sameSizeExist == size) {
                await cart.updateOne(
                    { userId: userData._id, "product.productId": objId },
                    { $inc: { "product.$.quantity": 1 } }
                );
                res.redirect("/productView");
            } else {
                const newCart = new cart({
                    userId: userData.id,
                    product: [
                        {
                            productId: objId,
                            quantity: 1,
                            size: Number(size),
                        },
                    ],
                });
                newCart.save().then(() => {

                    res.redirect("/productView");


                });

            }
        } else {
            cart
                .updateOne({ userId: userData._id }, { $push: { product: productObj } })
                .then(() => {

                    res.redirect("/productView");

                });
        }
    } else {
        const newCart = new cart({
            userId: userData.id,
            product: [
                {
                    productId: objId,
                    quantity: 1,
                    size: Number(size),
                },
            ],
        });
        newCart.save().then(() => {

            res.redirect("/productView");


        });
    }

};



const viewCart = async (req, res, next) => {
    const session = req.session.user;
    const cartEmail = session.email
    const userData = await users.findOne({ email: cartEmail });
    const productData = await cart.aggregate([
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
    console.log(productData);
    
    const sum = productData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
    }, 0);
    countInCart = productData.length;
    console.log("viewCart");
   
    res.render("user/cart", { productData, sum, countInCart });

    console.log(productData+555555555);
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


const totalAmount = async (req, res) => {
    try {

        let session = req.session.user;
        const userData = await users.findOne({ email: session.email });
        const productData = await cart.aggregate([
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
                    productDetail: { $arrayElemAt: ["$productDetail", 0] },
                },
            },
            {
                $addFields: {
                    productPrice: {
                        $multiply: ["$productQuantity", "$productDetail.price"],
                    },
                },
            },
            {
                $group: {
                    _id: userData.id,
                    total: {
                        $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
                    },
                },
            },
        ]).exec();
        res.json({ status: true, productData });
    } catch (err) {
        console.log(err);
        next(err)
    }
};


// const changeQuantity = async (req, res) => {
//     const data = req.body;
//     console.log(data);
//     const objId = mongoose.Types.ObjectId(data.product);
//     cart
//       .aggregate([
//         {
//           $unwind: "$product",
//         },
//       ])
//       .then((data) => {
//       });
//     cart.updateOne(
//       { _id: data.cart, "product.productId": objId },
//       { $inc: { "product.$.quantity": data.count } }
//     ).then(() => {
//       res.json({ status: true });
//     })


//   };


const changeQuantity = (req, res, next) => {
    try {
        const data = req.body
        console.log(data, "counted");
        const objId = mongoose.Types.ObjectId(data.product)
        console.log(objId);

        if (data.count == -1 && data.quantity == 1) {
            cart.updateOne(
                { _id: data.cart, "product.productId": objId },
                { $pull: { product: { productId: objId } } }
            )
                .then(() => {
                    res.json({ quantity: true })
                }).catch(err => console.log(err))
        } else {
            cart.updateOne(
                { _id: data.cart, "product.productId": objId },
                { $inc: { "product.$.quantity": data.count } }
            ).then(() => {
                next()
            })
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

};





module.exports = {

    viewCart,
    addToCart,
    removeProduct,
    changeQuantity,
    totalAmount


}

