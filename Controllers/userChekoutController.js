const users = require('../model/userSchema')
const cart = require('../model/cartSchema')
const order = require('../model/orderSchema')
const mongoose = require("mongoose");
const moment = require("moment");
moment().format();


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
    
        const query = req.query
        // await order.deleteOne({_id:query.orderId})
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
            landmark: req.body.landmark,
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
        res.render('user/orderSuccess')
    }catch(err){
        next(err)
    }
};

const placeOrder = async(req,res,next)=>{
    try{
        
        const data = req.body
        console.log(data);
        const session = req.session.user;

        const userData = await users.findOne({ email: session.email })
        const objId = mongoose.Types.ObjectId(userData._id);
        const cartData = await cart.findOne({ userId: userData._id });
  
      
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
              
  
              const orderData = await order.create({
  
                userId: userData._id,
                name: userData.username,
                phoneNumber: userData.phonenumber,
                address: req.body.address,
                orderItems: cartData.product,
                totalAmount: sum,
                paymentMethod: req.body.paymentMethod,
                orderDate: moment().format("MMM Do YY"),
                deliveryDate: moment().add(3, "days").format("MMM Do YY")
  
              })
              const orderId = orderData._id
              await cart.deleteOne({ userId: userData._id });
  
              if (req.body.paymentMethod === "COD") {
                await order.updateOne({ _id: orderId }, { $set: { orderStatus: 'placed' } })
  
              res.redirect('/success')
                
  
  
              } 
            
  
              }
  
            
          
  
        
    }catch(err){
        next(err)
    }
};

module.exports ={
    getCheckout,
    addNewAddress,
    orderSuccess,
    placeOrder
}