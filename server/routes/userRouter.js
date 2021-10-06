const { Sequelize } = require('sequelize')
const sequelize = require('../db/database')
const express = require('express')
const route = express.Router()
// const async = require('async')
const userService = require('../services/userService')
const userRoleService = require('../services/userRoleService')
// const userAuthService = require('../services/userAuthService')

const getUserInfo = async (req, res) => {
	const user_id = req.params.user_id
	
	userService.findByUserId(user_id, function(err, result){
			res.json({err,result})
	})
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
}

const { isAdmin, isLogin, isNonEditTeacher } = require('../config/policies')

route.get('/:user_id', isLogin, getUserInfo )
route.get('/', isNonEditTeacher, getAllUser )
route.put('/create', isAdmin, createUser )
route.put('/createUserRole', isAdmin, createUserRole )

module.exports = route