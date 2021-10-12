const express = require('express')

const route = express.Router()

const userRouter = require('./userRouter')
const authRouter = require('./auth')
const courseRouter = require('./courseRouter')
const topicRouter = require('./topicRouter')
const categoryRouter = require('./categoryRouter')

route.use('/user', userRouter)
route.use('/', authRouter)
route.use('/category', categoryRouter)
route.use('/course', courseRouter)
route.use('/topic', topicRouter)
module.exports = route