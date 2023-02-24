
const user = require('../model/userSchema')
const bcrypt = require('bcrypt');

const viewProfile = async (req, res, next) => {
  try {
    const session = req.session.user
    const email = session.email
    const userData = await user.findOne({ email: email })
    console.log(userData);
    res.render('user/profile', { userData })
  }
  catch (err) {
    next(err)
  };
}


const editProfile = async (req, res, next) => {
  try {
    const session = req.session.user
    const email = session.email
    const userData = await user.findOne({ email: email })
    console.log(userData);
    res.render('user/editProfile', { userData })
  } catch (err) {
    next(err)
  }

};

const postEditProfile = async (req, res, next) => {
  try {


    const session = req.session.user
    await user.updateOne(
      { email: session.email },
      {
        $set: {

          username: req.body.name,
          phonenumber: req.body.phone,
          email: req.body.email,
          addressDetails: [
            {
              housename: req.body?.housename,
              area: req.body?.area,
              landMark: req.body?.landmark,
              district: req.body?.district,
              state: req.body?.state,
              postoffice: req.body?.postoffice,
              pin: req.body?.pin,
            },
          ],
        },
      },
    )
    res.redirect('/profile')
  } catch (err) {
    next(err)
  }

}
const getPasswordPage = async (req, res, next) => {
  try {
    res.render('user/profilePassword')
  } catch (err) {
    console.log(err);
    next(err)
  }
};

const postChangePassword = async (req, res, next) => {
  try {

    const data = req.body
    const session = req.session.user

    if (data.newPassword === data.conNewPassword) {

      const userData = await user.findOne({ email: session.email })
      const passwordMatch = await bcrypt.compare(data.currentPassword, userData.password)

      if (passwordMatch) {

        const hashPassword = await bcrypt.hash(data.newPassword, 10)

        user.updateOne({ email: session.email }, { $set: { password: hashPassword } }).then(() => {

          req.session.user = null;
          res.redirect('/')
        })

      } else {
        res.render('user/profilePassword', { invalid: "Incorrect password" })
      }

    } else {
      res.render('user/profilePassword', { invalid: "Password must be same" })
    }



  } catch (err) {
    console.log(err);
  }
};


module.exports = {
  editProfile,
  viewProfile,
  postEditProfile,
  getPasswordPage,
  postChangePassword

}