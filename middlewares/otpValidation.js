const nodemailer  = require('nodemailer');

module.exports={
    mailTransporter:nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:'shoehub2023@gmail.com',
            pass:'wwoqvozierkfefoz'
        }
    }),
}