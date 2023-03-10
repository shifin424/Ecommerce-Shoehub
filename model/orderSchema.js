const mongoose = require('mongoose');
const Schema   = mongoose.Schema
const ObjectId = Schema.ObjectId

const orderSchema = new Schema(
    {
        userId:{
           type:ObjectId,
           required:true
        },
        name:{
            type:String,
            required:true
        },
        houseName: {
            type: String,
          
          },
      
        area: {
            type: String,
            
            
          },
      
        landMark: {
            type: String,
           
      
          },
        district: {
            type: String,
            
      
          },
        state: {
            type: String,
            
      
          },
         
        postOffice: {
            type: String,
            
      
          },
        pin: {
            type: Number,
            
      
          },
        orderItems:[
            {
                productId:{
                    type:ObjectId,
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                },
                size: {
                    type: Number,
                    required: true,
                },
            }
        ],
        totalAmount:{
            type:Number,
            required:true
        },
        orderStatus:{
            type:String,
            default:"pending"
        },
        paymentMethod:
        {
            type:String,
            required:true
        },
        paymentStatus:{
         type:String,
         default:"not paid"
        },
        orderDate:{
            type:String,
        },
        deliveryDate:{
            type:String
        }
    }, 
    {
        timestamps:true
    }
);

const  order= mongoose.model("order",orderSchema)
module.exports = order;