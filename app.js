const express = require('express');
const app = express();
const userRouter  = require('./routes/user');
const adminRouter = require('./routes/admin')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path        =  require('path');
const dbconnect   = require('./config/Connection');
const cookieParser = require('cookie-parser')
const { urlencoded } = require('body-parser');
const session     = require('express-session');

 //const noCache = require("nocache");


dotenv.config();
dbconnect.dbconnect();


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


//session
const oneHour=1000*60*60
app.use(session({
    secret:"thisismysecretkey",
    saveUninitialized:true,
    cookie:{maxAge:oneHour},
    resave:false
}))

 //to prevent storing cache
app.use((req, res, next) =>{
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate",
    );
    next();
  })



//Routes
app.use('/', (userRouter));
app.use('/admin',(adminRouter));




app.listen(process.env.PORT,()=>{
    console.log("server started listening to port ");
});

