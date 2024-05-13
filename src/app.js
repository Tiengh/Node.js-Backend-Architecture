require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require('./dbs/init.mongodb.js');
const {checkOverload} = require('./helpers/check.connect');
checkOverload()

//init routerX
app.get('/',(req,res,next) => {
    const strCompress = "Hehe boi!"
    return res.status(200).json({
        message: 'welcome'
    })
})

//handle error
module.exports = app;
