const sequelize = require('../db/database')
const {
    QueryTypes
} = require('sequelize')
const loginService = require('./loginService')
const bcrypt = require('bcrypt')
const userService = require('./userService')
module.exports = async function (req, res, next) {
    const data = req.body
    userService.findByUserId(data.username, function (err, user) {
        if (err) {
            res.badRequest(err)
        } else if (!user) {
            res.badRequest('username invalid')
        } else if (user && user.email) {
            res.badRequest('you are registered')
        } else {
            bcrypt.hash(data.password, 8, async function (err, hash) {
                if (err)
                    res.severError(err)
                else {
                    try {
                        const queryString = "INSERT INTO user_auth (email, username, user_id, password) " +
                            "VALUES (:email, :username, :user_id, :password);"
                        const user_auth = await sequelize.query(queryString, {
                            type: QueryTypes.INSERT,
                            replacements: {
                                email: data.email,
                                username: data.username,
                                user_id: user.id,
                                password: hash
                            }
                        })
                        if (user_auth) {
                            loginService(req, res, next)                            
                        } else
                            res.badRequest('Failed to register!', null)
                    } catch (err) {
                        res.severError(err)
                    }
                }
            });

        }
    })
}