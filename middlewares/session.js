
  const verifyLoginAdmin = (req, res, next) => {
    if (req.session.admin) {
      next();
    } else {
      res.redirect("/admin");
    }
  };

 const verifyLoginUser = (req, res, next) => {
    if (req.session?.user) {
      res.redirect('/')
    } else {
      next();
    }
  };

 const  userLogin = (req,res,next)=>{
    if(req.session?.user){
      next()
    }
    else{
      res.redirect('/')
    }
  };

 const loginSession = (req,res,next)=>{
    if(req.session.admin){
      res.redirect('/admin')
    }else{
    next();
    }
  };



module.exports = {

  verifyLoginAdmin,
  verifyLoginUser,
  userLogin,
  loginSession,

}