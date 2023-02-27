const order = require('../model/orderSchema')
const mongoose = require("mongoose");
const users = require('../model/userSchema')





const orderDetails = async (req, res, next) => {
  try {
    const session = req.session.user;
    const userData = await users.findOne({ email: session.email });
    const userId = userData._id
    const objId = mongoose.Types.ObjectId(userId);
    const productData = await order
      .aggregate([
        {
          $match: { userId: objId },
        },
        {
          $unwind: "$orderItems",
        },
        {
          $project: {
            productItem: "$orderItems.productId",
            productQuantity: "$orderItems.quantity",
            productSize: "$orderItems.size",
            address: 1,
            name: 1,
            phoneNumber: 1,
            totalAmount: 1,
            orderStatus: 1,
            paymentMethod: 1,
            paymentStatus: 1,
            orderDate: 1,
            deliveryDate: 1,
            createdAt: 1,
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          }
        },
        {
          $project: {
            productItem: 1,
            productQuantity: 1,
            name: 1,
            phoneNumber: 1,
            address: 1,
            totalAmount: 1,
            orderStatus: 1,
            paymentMethod: 1,
            paymentStatus: 1,
            orderDate: 1,
            deliveryDate: 1,
            createdAt: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
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
        }

      ]).sort({ createdAt: -1 });

    const orderDetails = await order.find({ userId: userData._id }).sort({ createdAt: -1 });
    res.render('user/orderDetails', { productData, orderDetails });

  } catch (err) {
    console.log(err);
    next(err)
  }

};

const orderedProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = req.session.user;
    const userData = await users.findOne({ email: session.email });
    const orderDetails = await order.find({ userId: userData._id }).sort({ createdAt: -1 })
    const objId = mongoose.Types.ObjectId(id);
    const productData = await order
      .aggregate([
        {
          $match: { _id: objId },
        },
        {
          $unwind: "$orderItems",
        },
        {
          $project: {
            productItem: "$orderItems.productId",
            productQuantity: "$orderItems.quantity",
            productSize: "$orderItems.size",
            address: 1,
            name: 1,
            phonenumber: 1
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          }
        },
        {
          $project: {
            productItem: 1,
            productQuantity: 1,
            name: 1,
            phoneNumber: 1,
            address: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
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
        }

      ]);
    console.log(productData, 2)


    res.render('user/orderedProduct', { productData, orderDetails });
  } catch (err) {
    next(err)
  }


};

const cancelOrder = async (req, res, next) => {
  try {
    const data = req.params.id;
    const orderData = await order.findOne({ _id: data })
    const refundAmount = orderData.totalAmount
    const userData = await users.findOne({ _id: orderData.userId });


    const updatedWalletTotal = userData.walletTotal + refundAmount;
    const updatedWalletDetails = userData.walletDetails.concat({
      transactionType: 'refund',
      amount: refundAmount,
      orderDetails: orderData._id,
      date: new Date()
    });

    await users.updateOne(
      { _id: orderData.userId },
      { $set: { walletTotal: updatedWalletTotal, walletDetails: updatedWalletDetails } }
    );
    await order.updateOne({ _id: data }, { $set: { orderStatus: "cancelled" } })
    res.redirect("/orderDetails");
  } catch (err) {
    next(err)
  }

};

module.exports = {
  orderDetails,
  cancelOrder,
  orderedProduct
}