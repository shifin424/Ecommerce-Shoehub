
const order = require('../model/orderSchema')




const getOrders = async(req,res,next)=>{
    try{
    order.aggregate([
        {
            $lookup:{
                from:"products",
                localField:"orderItems.productId",
                foreignField:"_id",
                as:"product"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"users"
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        } 
    ]).then((orderDetails)=>{
        res.render("admin/orders",{orderDetails});
    })

}catch(err){
    next(err)
}
};


const orderStatusChanging = async (req,res,next)=>{
    try{
    const id = req.params.id;
    const data = req.body;
    await order.updateOne(
        {_id:id},
        {
            $set:{
                orderStatus:data.orderStatus,
                paymentStatus:data.paymentStatus,
            }
        }
    )
    res.redirect("/admin/order");
    }catch(err){
        next(err)
    }
};

module.exports = {
    getOrders ,
    orderStatusChanging
}