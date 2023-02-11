const cart = require('../model/cartSchema');
const users = require('../model/userSchema')
const products = require('../model/productSchema');
const mongoose = require("mongoose");




const addToCart = async (req, res) => {
    const body = req.body;
    console.log(body);
    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id);
    const session = req.session.user;
    const size = body.size;
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
                res.redirect("/viewcart");
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

                    res.redirect("/viewcart");


                });

            }
        } else {
            cart
                .updateOne({ userId: userData._id }, { $push: { product: productObj } })
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
                    size: Number(size),
                },
            ],
        });
        newCart.save().then(() => {

            res.redirect("/viewcart");


        });
    }

};



const viewCart = async (req, res,next) => {
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


const changeQuantity = async (req, res) => {
    const data = req.body;
    console.log(data);
    const objId = mongoose.Types.ObjectId(data.product);
    cart
      .aggregate([
        {
          $unwind: "$product",
        },
      ])
      .then((data) => {
      });
    cart.updateOne(
      { _id: data.cart, "product.productId": objId },
      { $inc: { "product.$.quantity": data.count } }
    ).then(() => {
      res.json({ status: true });
    })


  };







module.exports = {

    viewCart,
    addToCart,
    removeProduct,
    changeQuantity,


}

