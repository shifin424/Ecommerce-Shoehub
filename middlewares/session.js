module.exports = {
  verifyLoginAdmin: (req, res, next) => {
    if (req.session.admin) {
      next();
    } else {
      res.redirect("/admin");
    }
  },
  verifyLoginUser: (req, res, next) => {
    if (req.session?.user) {
      res.redirect('/')
    } else {
      next();
    }
  },

  loginSession:(req,res,next)=>{
    if(req.session.admin){
      res.redirect('/admin')
    }else{
    next();
    }
  }

}; 