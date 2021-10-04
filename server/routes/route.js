const express = require('express')

const route = express.Router()

const userRouter = require('./userRouter')
const authRouter = require('./auth')

route.use('/user', userRouter)
route.use('/', authRouter)
module.exports = route