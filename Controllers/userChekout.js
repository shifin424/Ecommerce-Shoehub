

const getCheckout = async (req,res,next)=>{

    try{
        res.render('user/checkout')
    }catch(err){
        next(err)
    }
}

module.exports ={
    getCheckout,
}