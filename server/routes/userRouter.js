const { Sequelize } = require('sequelize')
const sequelize = require('../db/database')
const express = require('express')
const route = express.Router()
const async = require('async')
const userService = require('../services/userService')
const userRoleService = require('../services/userRoleService')
const userAuthService = require('../services/userAuthService')
// const e = require('express')
const getUserInfo = async (req, res) => {
	const user_id = req.params.user_id
	// const user = await sequelize.query('SELECT * FROM users WHERE id=:user_id', { type : sequelize.SELECT, replacements : {user_id} })
	// if(user.length == 0) {
	// 	return res.sendStatus(404)
	// }
	userService.findByUserId(user_id, function(err, result){
		// console.log({result});
		// if(err){
		// 	res.badRequest(err)
		// }
		// else if(!result)
		// 	res.json({message: 'user not found'})
		// else 
			res.json({err,result})
	})
	// res.json({user})
}
const getAllUser = async (req, res) => {
	userService.findAll(function(err, result){
		res.json({err, result})
	})
}
const createUserRole = async (req, res) => {
	if(!req.body.user_id || !req.body.role_id){
		res.json({err: 'must include parameter user_id and role_id!'})
	}
	else
		userRoleService.create(req.body, function(err, result){
			res.json({err, result})
		})
}

const createUser = async (req, res) => {
	const userInfo = {
		username: req.body.username ? req.body.username : '',
		firstname: req.body.firstname ? req.body.firstname : '',
		lastname: req.body.lastname ? req.body.lastname : ''
	}
	userService.create(userInfo, function(err1, result1){
		if(err1)
			res.json({err: err1, result: result1})
		else {
			userRoleService.create({user_id: result1[0], role_id: req.body.role_id}, function(err, result){
				if(err)
					res.json({err, result})
				else {
					result1.role_id = result.role_id
					res.json({err, result: result1})
				}
			})
		}

	})
	// async.eachSeries(Object.keys(userInfo), async.ensureAsync( function (key, nextInfo) {
	// 	if(key == 'email' || key == 'username') {
	// 		const replacements = {}
	// 		replacements[key] = userInfo[key]
	// 		sequelize.query(`SELECT * FROM users u left join user_auth ua on ua.user_id = u.id WHERE ua.${key}=:${key}`, { type : sequelize.SELECT, replacements })
	// 		.then(user => {
    //   console.log(`🚀 ~ file: userRouter.js ~ line 24 ~ user`, user)
	// 			if(user.length == 0)
	// 				nextInfo(null)
	// 			else
	// 				return res.badRequest(`user with ${key} ${userInfo[key]} already exists.`)
	// 		})
	// 		.catch(error => {
    //   	console.log(`🚀 ~ file: userRouter.js ~ line 32 ~ error`, error)
	// 			nextInfo(error)
	// 		})
	// 	}	
	// 	else {
	// 		nextInfo(null)
	// 	}
	// }), function doneNext(err) {
    // console.log(`🚀 ~ file: userRouter.js ~ line 40 ~ err`, err)
	// 	if(err)
	// 		return res.internalServerError(err)
	// 	res.json({userInfo})
	// })

}
route.get('/:user_id', getUserInfo )
route.get('/', getAllUser )
route.put('/create', createUser )
route.put('/createUserRole', createUserRole )

module.exports = route