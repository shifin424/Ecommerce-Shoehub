const mongoose = require('mongoose');
const dotenv      = require("dotenv");
const mailer = require("../middlewares/otpValidation");
const otp = require('../model/otpSchema');
const user = require('../model/userSchema')  
const bcrypt = require('bcrypt')

function mailsender(User) {
    return new Promise((resolve) => {

const OTP = `${Math.floor(1000 + Math.random() * 9000)}`

console.log(OTP+' otp Created')

const mailDetails = {
    from : process.env.MAILER_EMAIL,
    to : User.email,
    subject : 'Otp for ShoeHub',
     html: `
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Shoehub</a>
    </div>
    <p style="font-size:1.1em">Hi ${User.userName},</p>
    <p>Thank you for choosing Shoehub. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Shoehub</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Shoehub</p>
    </div>
  </div>
</div>`,
}

mailer.mailTransporter.sendMail(mailDetails, async function(err){
    if(err){
        console.log(err);
    }else{

   const userFound = await otp.findOne({email:User.email})

   if(userFound){

    otp.deleteOne({email:User.email}).then(()=>{

      otp.create({
        email:User.email,
        otp:OTP
      }).then(()=>{
        resolve (true)
       
      })

    })
   }else{

    otp.create({
      email:User.email,
      otp:OTP
    }).then(()=>{
        resolve (true)
    })
    
    resolve (true)
   }
    }

    })

    })


}
module.exports = mailsender;