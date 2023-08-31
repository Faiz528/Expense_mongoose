require('dotenv').config();
const express = require('express')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const app = express()
const Parser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./model/user')
const Expenses = require('./model/expense')
const Order = require('./model/order')
const forgotPassword = require('./model/forgotpassword')
const Downloaded = require('./model/download')
const helmet = require('helmet')
const compressions = require('compression')
const morgan = require('morgan')

const accessLog = fs.createWriteStream(
  path.join(__dirname,'access.log'),{flags:'a'}
)
app.use(Parser.json({extended:false}))
app.use(cors())
app.use(cors({
  origin: '*'
}));
app.use(express.static('public'));
app.use(helmet())
app.use(compressions())
app.use(morgan('combined',{stream:accessLog}))

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://checkout.razorpay.com/v1/checkout.js","https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js","https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js","https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",]
    ,
    frameSrc:["'self'","https://api.razorpay.com/"],
    connectSrc:["'self'","https://lumberjack-cx.razorpay.com/beacon/v1/batch"]
    // Add other CSP directives as needed
  }
}));

const Signup = require('./expenses/route/sign')
app.use(Signup)
const Login = require('./expenses/route/log')
app.use(Login)
const Expense = require('./expenses/route/expense')
app.use(Expense)
const Password = require('./expenses/route/forgot')
app.use(Password)




/*app.use((req,res)=>{
  console.log('url',req.url)
  res.sendFile(path.join(__dirname, `expenses/${req.url}`))
})*/
mongoose.connect('mongodb+srv://Faiz:Sharpener2023@faizuddin.tyr9tuj.mongodb.net/Faizuddin?retryWrites=true&w=majority').then(result=>{
    console.log("Connected")
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})

