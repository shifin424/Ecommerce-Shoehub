const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const users = require('../model/userSchema')
const cart = require('../model/cartSchema')
const order = require('../model/orderSchema')
const mongoose = require("mongoose");
const instance = require("../middlewares/razorpay");
const coupon = require('../model/couponSchema')
const crypto = require('crypto')
const dotenv = require("dotenv");
const moment = require("moment");



moment().format();
dotenv .config(); 


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

const getCheckout = async (req,res,next)=>{

    try{
        let session = req.session.user; 
        const userData = await users.findOne({ email: session.email });
        const userId = userData._id.toString()
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
                productSize:"$Product.size"
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
                productSize:1,
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
    
        const query = req.query
        res.render("user/checkout", { productData, sum, userData });
    }catch(err){
        next(err)
    }
};


const addNewAddress = async (req,res,next)=>{
    try{
        const session = req.session.user
        const emilSession = session.email
        const addressObject = {
            housename: req.body.housename,
            area: req.body.area,
            landMark: req.body.landmark,
            district: req.body.district,
            state: req.body.state,
            postoffice: req.body.postoffice,
            pin: req.body.pin
        }
        
      await users.updateOne({ email: emilSession }, { $push: { addressDetails: addressObject } })
      res.redirect('/checkout')

    }catch(err){
        next(err)
    }
};



const orderSuccess = async (req,res,next)=>{
    try{
      const query= req.query
      console.log(query);
      const orderId = query.orderId
      await order.updateOne({_id:orderId},{$set:{orderStatus:'placed',paymentStatus:'paid'}})
      await cart.deleteOne({ userId: query.cartId });
        res.render('user/orderSuccess')
    }catch(err){
        next(err)
    }
};

const placeOrder = async(req,res,next)=>{
    try{

      let invalid;
      let couponDeleted;
      const data = req.body
      console.log(data+"1st log");
      const session = req.session.user;
      console.log(session+"2nd log");
      const userData = await users.findOne({ email: session.email })
      console.log(userData+"3rd log");
      const objId = mongoose.Types.ObjectId(userData._id);
      console.log(objId+"4rth log");
      const cartData = await cart.findOne({ userId: userData._id });
      console.log(cartData + "cart data");

      if (data.coupon) {
        invalid = await coupon.findOne({ couponName: data.coupon });
        if (invalid?.delete == true) {
          couponDeleted = true
        }
      } else {
        invalid = 0;
      }



      if (invalid == null) {

        res.json({ invalid: true });

      } else if (couponDeleted) {

        res.json({ couponDeleted: true })
      }
      else {

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
                      $multiply: ["$productQuantity", "$productDetail.price"]
                    }
                  }
                }
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

            const orderData = await order.create({

              userId: userData._id,
              name: userData.username,
              phoneNumber: userData.phonenumber,
              address: req.body.address,
              orderItems: cartData.product,
              totalAmount: total,
              paymentMethod: req.body.paymentMethod,
              orderDate: moment().format("MMM Do YY"),
              deliveryDate: moment().add(3, "days").format("MMM Do YY")

            })
            const amount = orderData.totalAmount * 100
            const orderId = orderData._id
            console.log(orderId+"hey this is my order id");
            await cart.deleteOne({ userId: userData._id });

            if (req.body.paymentMethod === "COD") {
              await order.updateOne({ _id: orderId }, { $set: { orderStatus: 'placed' } })

              res.json({ success: true });
              coupon.updateOne(
                { couponName: data.coupon },
                { $push: { users: { userId: objId } } }
              ).then((updated) => {
                console.log(updated + "hey this process modified");
              });


            } else {
            
              let options = {
                amount: amount,
                currency: "INR",
                receipt: "" + orderId,
              };
               instance.orders.create(options, function (err, order) {

                if (err) {
                  console.log(err);
                } else {
                  console.log('online payyyyyyyyyyyyy')
                  res.json({order:order});

                  coupon.updateOne(
                    { couponName: data.coupon },
                    { $push: { users: { userId: objId } } }
                  ).then((updated) => {
                    console.log(updated);
                  });
                }
              })

            }

          } else {

            res.redirect("/viewCart");
          }
        }

      }
    }catch(err){
      console.log(err)
        
    }
};

const verifyPayment = async (req,res,next)=>{
try{
  const details = req.body;
    let hmac = crypto.createHmac("SHA256",process.env.KETSECRET);
    hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
    hmac = hmac.digest("hex");

    if (hmac == details.payment.razorpay_signature) {
      const objId = mongoose.Types.ObjectId(details.order.receipt);
      order.updateOne({ _id: objId }, { $set: { paymentStatus: "paid", orderStatus: 'placed' } }).then(() => {

        res.json({ success: true });

      }).catch((err) => {
        console.log(err);
        res.json({ status: false, err_message: "payment failed" });
      })

    } else {
      console.log(err);
      res.json({ status: false, err_message: "payment failed" });
    }
  

}catch(err){
  next(err)
}
}

const paymentFail = async(req,res,next)=>{
  try{

  }catch(err){
    next(err)
  }
}

module.exports ={
    getCheckout,
    addNewAddress,
    orderSuccess,
    placeOrder,
    verifyPayment,
    paymentFail
}