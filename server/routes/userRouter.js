const { Sequelize } = require('sequelize')
const sequelize = require('../db/database')
const express = require('express')
const route = express.Router()
const async = require('async')

const getUserInfo = async (req, res) => {
	const user_id = req.params.user_id
	const user = await sequelize.query('SELECT * FROM users WHERE id=:user_id', { type : sequelize.SELECT, replacements : {user_id} })
	if(user.length == 0) {
		return res.sendStatus(404)
	}
	res.json({user})
}

const createUser = async (req, res) => {
	const userInfo = req.body

	async.eachSeries(Object.keys(userInfo), async.ensureAsync( function (key, nextInfo) {
		if(key == 'email' || key == 'username') {
			const replacements = {}
			replacements[key] = userInfo[key]
			sequelize.query(`SELECT * FROM users u left join user_auth ua on ua.user_id = u.id WHERE ua.${key}=:${key}`, { type : sequelize.SELECT, replacements })
			.then(user => {
      console.log(`🚀 ~ file: userRouter.js ~ line 24 ~ user`, user)
				if(user.length == 0)
					nextInfo(null)
				else
					return res.badRequest(`user with ${key} ${userInfo[key]} already exists.`)
			})
			.catch(error => {
      	console.log(`🚀 ~ file: userRouter.js ~ line 32 ~ error`, error)
				nextInfo(error)
			})
		}	
		else {
			nextInfo(null)
		}
	}), function doneNext(err) {
    console.log(`🚀 ~ file: userRouter.js ~ line 40 ~ err`, err)
		if(err)
			return res.internalServerError(err)
		res.json({userInfo})
	})
}
route.get('/:user_id', getUserInfo )
route.put('/create', createUser )

module.exports = route