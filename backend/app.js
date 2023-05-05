const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes/user-routes');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);

mongoose.connect("mongodb+srv://only4mytest2:wbcHL6jP5lcucB37@cluster0.qgwdvhd.mongodb.net/auth?retryWrites=true&w=majority").then(()=>{
    app.listen(5000);
    console.log("Database is connected! Listening 5000")
}).catch((err)=>{console.log(err)});


