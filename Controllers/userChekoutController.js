const users = require("../model/userSchema");
const cart = require("../model/cartSchema");
const order = require("../model/orderSchema");
const mongoose = require("mongoose");
const instance = require("../middlewares/razorpay");
const coupon = require("../model/couponSchema");
const crypto = require("crypto");
const dotenv = require("dotenv");
const moment = require("moment");

moment().format();
dotenv.config();

function checkCoupon(data, id) {
  return new Promise((resolve) => {
    if (data.coupon) {
      coupon
        .find(
          { couponName: data.coupon },
          { users: { $elemMatch: { userId: id } } }
        )
        .then((exist) => {
          console.log(exist);
          if (exist[0].users.length) {
            resolve(true);
          } else {
            coupon.find({ couponName: data.coupon }).then((discount) => {
              resolve(discount);
            });
          }
        });
    } else {
      resolve(false);
    }
  });
}

const getCheckout = async (req, res, next) => {
  try {
    let session = req.session.user;
    const userData = await users.findOne({ email: session.email });
    const addressData = await users.find({ email: session.email });
    console.log(addressData);
    const userId = userData._id.toString();
    const productData = await cart
      .aggregate([
        {
          $match: { userId: userId },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
            productQuantity: "$product.quantity",
            productSize: "$Product.size",
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
              $multiply: ["$productQuantity", "$productDetail.price"],
            },
          },
        },
      ])
      .exec();
    const sum = productData.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);

    const query = req.query;
    res.render("user/checkout", { productData, sum, userData, addressData });
  } catch (err) {
    next(err);
  }
};

const addNewAddress = async (req, res, next) => {
  try {
    const session = req.session.user;
    const emilSession = session.email;
    const addressObject = {
      housename: req.body.housename,
      area: req.body.area,
      landMark: req.body.landmark,
      district: req.body.district,
      state: req.body.state,
      postoffice: req.body.postoffice,
      pin: req.body.pin,
    };

    await users.updateOne(
      { email: emilSession },
      { $push: { addressDetails: addressObject } }
    );
    res.redirect("/checkout");
  } catch (err) {
    next(err);
  }
};

const orderSuccess = async (req, res, next) => {
  try {
    const query = req.query;
    console.log(query);
    const orderId = query.orderId;
    await order.updateOne(
      { _id: orderId },
      { $set: { orderStatus: "placed", paymentStatus: "paid" } }
    );
    await cart.deleteOne({ userId: query.cartId });
    res.render("user/orderSuccess");
  } catch (err) {
    next(err);
  }
};

const placeOrder = async (req, res, next) => {
  try {
    let invalid;
    let couponDeleted;
    const data = req.body;
    console.log(data, 2);
    const session = req.session.user;
    const userData = await users.findOne({ email: session.email });
    const objId = mongoose.Types.ObjectId(userData._id);
    const cartData = await cart.findOne({ userId: userData._id });
    if (data.coupon) {
      invalid = await coupon.findOne({ couponName: data.coupon });
      if (invalid?.delete == true) {
        couponDeleted = true;
      }
    } else {
      invalid = 0;
    }

    if (invalid == null) {
      res.json({ invalid: true });
    } else if (couponDeleted) {
      res.json({ couponDeleted: true });
    } else {
      const discount = await checkCoupon(data, objId);
      console.log(discount);
      if (discount == true) {
        res.json({ coupon: true });
      } else {
        if (cartData) {
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
            ])
            .exec();
          const sum = productData.reduce((accumulator, object) => {
            return accumulator + object.productPrice;
          }, 0);
          if (discount == false) {
            var total = sum;
          } else {
            var dis = sum * discount[0].discount;
            if (dis > discount[0].maxLimit) {
              total = sum - discount[0].maxLimit;
            } else {
              total = sum - dis;
            }
          }

          const orderData = new order({
            userId: userData._id,
            name: userData.username,
            phoneNumber: userData.phonenumber,
            houseName: req.body.housename,
            area: req.body.area,
            landMark: req.body.landMark,
            district: req.body.district,
            state: req.body.state,
            postOffice: req.body.postOffice,
            pin: req.body.pincode,
            orderItems: cartData.product,
            totalAmount: total,
            paymentMethod: req.body.paymentMethod,
            orderDate: moment().format("MMM Do YY"),
            deliveryDate: moment().add(3, "days").format("MMM Do YY"),
          });

          if (req.body.paymentMethod === "COD") {
            const orderDatas = await orderData.save();
            const orderId = orderDatas._id;
            await order.updateOne(
              { _id: orderId },
              { $set: { orderStatus: "placed" } }
            );

            res.json({ success: true });
            coupon
              .updateOne(
                { couponName: data.coupon },
                { $push: { users: { userId: objId } } }
              )
              .then((updated) => {
                console.log(updated + "hey this process modified");
              });
          } else if (req.body.paymentMethod === "Wallet") {
            if (userData.walletTotal < orderData.totalAmount) {
              res.json({ wallet: true });
            } else {
              const orderDatas = await orderData.save();
              const orderId = orderDatas._id;

              order
                .updateOne(
                  { _id: orderId },
                  { $set: { paymentStatus: "Paid", orderStatus: "Placed" } }
                )
                .then(async () => {
                  const updatedWalletTotal =
                    userData.walletTotal - orderDatas.totalAmount;
                  const updatedWalletDetails = userData.walletDetails.concat({
                    transactionType: "Purchase",
                    amount: orderDatas.totalAmount,
                    orderDetails: orderData._id,
                    date: new Date(),
                  });

                  await users.updateOne(
                    { _id: userData._id },
                    {
                      $set: {
                        walletTotal: updatedWalletTotal,
                        walletDetails: updatedWalletDetails,
                      },
                    }
                  );

                  res.json({ success: true });
                  coupon.updateOne(
                    { couponName: data.coupon },
                    { $push: { users: { userId: objId } } }
                  );
                })
                .catch((err) => {
                  console.log(err);
                  res.json({ status: false, err_message: "Payment failed" });
                  order.deleteOne({ _id: orderId });
                });
            }
          } else {
            const orderDatas = await orderData.save();
            const orderId = orderDatas._id;
            const amount = orderDatas.totalAmount * 100;

            let options = {
              amount: amount,
              currency: "INR",
              receipt: "" + orderId,
            };
            instance.orders.create(options, function (err, order) {
              if (err) {
                console.log(err);
              } else {
                res.json({ order: order });

                coupon
                  .updateOne(
                    { couponName: data.coupon },
                    { $push: { users: { userId: objId } } }
                  )
                  .then((updated) => {
                    console.log(updated);
                  });
              }
            });
          }
        } else {
          res.redirect("/viewCart");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const details = req.body;
    let hmac = crypto.createHmac("SHA256", process.env.KETSECRET);
    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );
    hmac = hmac.digest("hex");

    if (hmac == details.payment.razorpay_signature) {
      const objId = mongoose.Types.ObjectId(details.order.receipt);
      order
        .updateOne(
          { _id: objId },
          { $set: { paymentStatus: "paid", orderStatus: "placed" } }
        )
        .then(() => {
          res.json({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.json({ status: false, err_message: "payment failed" });
        });
    } else {
      console.log(err);
      res.json({ status: false, err_message: "payment failed" });
    }
  } catch (err) {
    next(err);
  }
};

const paymentFail = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

const fetchAddress = async (req, res, next) => {
  try {
    const addressId = req.params.userId;
    const session = req.session.user;
    const userData = await users.findOne({ email: session.email });
    console.log(userData, 2);
    const addressDetails = userData.addressDetails.id(addressId);
    if (!addressDetails) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(addressDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
    next(err);
  }
};

module.exports = {
  getCheckout,
  addNewAddress,
  orderSuccess,
  placeOrder,
  verifyPayment,
  paymentFail,
  fetchAddress,
};
