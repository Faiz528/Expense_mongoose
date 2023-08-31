const express= require('express')
const path = require('path')
const route = express.Router()
const Forgot = require('../controller/forgot')


  route.post('/forgotPassword',Forgot.ForgotPassword)
  route.get('/resetpassword/:id',Forgot.resetpassword)
  route.get('/password/updatepassword/:resetpasswordid',Forgot.updatepassword)
module.exports = route