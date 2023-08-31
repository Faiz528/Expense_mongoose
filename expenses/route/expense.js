const express = require('express')
const authenticates = require('../../middleware/auth.js')
const route = express.Router()

const Control = require('../controller/expense')
const Premium = require('../controller/purchase')
route.post('/add',Control.PostExpense)
route.get('/leaderlist',Control.Getleader)
route.get('/premium',authenticates.authenticate, Premium.Premium)
route.post('/updatetransactionstatus',authenticates.authenticate, Premium.updateTransaction)
route.get('/user/download',authenticates.authenticate,Control.Download)
route.get('/user/downloadFile',authenticates.authenticate,Control.downloadFile)
route.post('/edits/:id',Control.UpdateExpense)
route.get('/user/expense/page',authenticates.authenticate,Control.getpage)
route.get('/add' ,authenticates.authenticate ,Control.GetExpense )

route.get('/edit/:id',Control.EditExpense)

route.delete('/delete/:id',Control.DeleteExpense)
route.get('/totals/:sum',authenticates.authenticate,Control.Gettotal)

module.exports = route