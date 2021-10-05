const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO user_auth (user_id, username, email, emailToken, emailTokenExpired, password, resetPassword, resetPasswordExpired) " +
            "VALUES (:user_id, :username, :email, :emailToken, :emailTokenExpired, :password, :resetPassword, :resetPasswordExpired);"
            const user_auth = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(user_auth){
                callback(null, user_auth)
            }
            else
                callback('Failed to create user_auth!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM user_auth"
            const user_auths = await sequelize.query(queryString)
            callback(null, user_auths)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findByUserId: async function(user_id,callback){
        try {
            const condition = `user_id = ${user_id}`
            const queryString = "SELECT * FROM user_auth WHERE " + condition
            const user_auths = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, user_auths)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(user_id, callback){
        try {
            const queryString = "DELETE FROM user_auth WHERE user_id = " + user_id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE user_auth SET username =:username, email =: email, emailToken =: emailToken, emailTokenExpired =: emailTokenExpired, password =: password, resetPassword =: resetPassword, resetPasswordExpired =: resetPasswordExpired WHERE user_id =: user_id"
           const user_auth_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (user_auth_updated){
               callback(null, user_auth_updated)
           }
           else
                callback('update user_auth failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}