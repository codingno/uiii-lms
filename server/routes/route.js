const express = require('express')

const route = express.Router()

const imageRouter = require('./imageRouter')
const fileRouter = require('./fileRouter')
const userRouter = require('./userRouter')
const authRouter = require('./auth')
const courseRouter = require('./courseRouter')
const topicRouter = require('./topicRouter')
const activityRouter = require('./activityRouter')
const categoryRouter = require('./categoryRouter')

route.use('/image', imageRouter)
route.use('/file', fileRouter)
route.use('/user', userRouter)
route.use('/', authRouter)
route.use('/category', categoryRouter)
route.use('/course', courseRouter)
route.use('/activity', activityRouter)
route.use('/topic', topicRouter)
module.exports = route