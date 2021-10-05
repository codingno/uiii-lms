const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
const userRoleService = require('./userRoleService')
const userAuthService = require('./userAuthService')
module.exports = {
  create: async function (data, callback) {
    try {
      const queryString = "INSERT INTO users (firsname, lastname, username) " +
        "VALUES (:firstname, :lastname, :username);"
      const user = await sequelize.query(queryString, {
        type: QueryTypes.INSERT,
        replacements: data
      })
      if (user) {
        callback(null, user)
      } else
        callback('Failed to create users!', null)
    } catch (err) {
      callback(err, null)
    }
  },
  findAll: async function (callback) {
    try {
      const queryString = "SELECT u.*, CONCAT(ur.role_id) role_id, CONCAT(r.name) role_name, ua.email FROM users u, user_role ur, user_auth ua, roles r WHERE u.id = ur.user_id AND ua.id = u.id AND ur.role_id = r.id GROUP BY u.id"
      const users = await sequelize.query(queryString)
      callback(null, users[0])
    } catch (err) {
      callback(err, null)
    }
  },
  findByUserId: async function (user_id, callback) {
    try {
      // const condition = `AND u.id = :user_id`
      const queryString = "SELECT u.*, ur.role_id, r.name role_name, ua.email FROM users u, user_role ur, user_auth ua, roles r WHERE u.id = ur.user_id AND ua.id = u.id AND ur.role_id = r.id AND u.id=:user_id"
      const user = await sequelize.query(queryString, {
        type: QueryTypes.SELECT,
        replacements: {user_id}
      })
      if (user.length > 0) {
        const result = {
          id: user[0].id,
          fistname: user[0].firstname,
          lastname: user[0].lastname,
          username: user[0].username,
          email: user[0].email,
          roles: user.map(data => {
            return {
              id: data.role_id,
              role_name: data.role_name
            }
          })
        }
        callback(null, result)
      } else
        callback(null, null)
    } catch (err) {
      console.log({err});
      callback(err, null)
    }
  },
  delete: async function (user_id, callback) {
    userRoleService.delete(user_id, function (errUserRole, result) {
      if (errUserRole)
        callback(errUserRole)
      else
        userAuthService.delete(user_id, async function (errUserAuth, result) {
          if (errUserAuth)
            callback(errUserAuth)
          else {
            try {
              const queryString = "DELETE FROM user WHERE user_id = " + user_id
              await sequelize.query(queryString, {
                type: QueryTypes.DELETE
              })
              callback(null, {
                message: "successfully deleted data"
              })
            } catch (err) {
              callback(err, null)
            }
          }
        })
    })
  },
  update: async function (data, callback) {
    try {
      const queryString = "UPDATE user_auth SET username =:username, email =: email, emailToken =: emailToken, emailTokenExpired =: emailTokenExpired, password =: password, resetPassword =: resetPassword, resetPasswordExpired =: resetPasswordExpired WHERE user_id =: user_id"
      const user_auth_updated = await sequelize.query(queryString, {
        type: sequelize.UPDATE,
        replacements: data
      })
      if (user_auth_updated) {
        callback(null, user_auth_updated)
      } else
        callback('update user_auth failed', null)
    } catch (err) {
      callback(err, null)
    }
  }
}