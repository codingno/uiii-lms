const sequelize = require('../db/database')
const {
    QueryTypes
} = require('sequelize')
const loginService = require('./loginService')
const bcrypt = require('bcrypt')
const userService = require('./userService')
module.exports = async function (req, res, next) {
    // const data = req.body
    const data = {
        firstname: req.body.firstName ? req.body.firstName : null,
        lastname: req.body.lastName ? req.body.lastName : '',
        username: '',
        code: null
    }
    userService.findByUserId(req.body.email, function (err, user) {
        if (err) {
            res.send(500,{message:"Sistem Error"})
        } else if (user && user.email) {
            res.badRequest({message: 'Your email is already registered'})
        } else {
            userService.create(data, function(err, user_create){
                if(err)
                    res.badRequest({message: "Sistem Error"})
                else {
                    bcrypt.hash(req.body.password, 8, async function (err, hash) {
                        if (err)
                            res.badRequest({messsage: err})
                        else {
                            try {
                                const queryString = "INSERT INTO user_auth (email, username, user_id, password) " +
                                    "VALUES (:email, :username, :user_id, :password);"
                                const user_auth = await sequelize.query(queryString, {
                                    type: QueryTypes.INSERT,
                                    replacements: {
                                        email: req.body.email,
                                        username: data.username,
                                        user_id: user_create[0],
                                        password: hash
                                    }
                                })
                                if (user_auth) {
                                    res.ok('Register Successed')                            
                                } else
                                    res.badRequest('Failed to register!', null)
                            } catch (err) {
                                res.send(500,{message: "System error"})
                            }
                        }
                    });
                }
            })

        }
    })
}