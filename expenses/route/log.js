const express= require('express')
const path = require('path')
const route = express.Router()
const Login = require('../controller/log')

route.post('/login' , Login.VerifyUser)

  
module.exports = route