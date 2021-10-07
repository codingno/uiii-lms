const { Sequelize } = require('sequelize')
const sequelize = require('../db/database')
const express = require('express')
const route = express.Router()
// const async = require('async')
const userService = require('../services/userService')
const userRoleService = require('../services/userRoleService')
const roleService = require('../services/roleService')
// const userAuthService = require('../services/userAuthService')

const getUserInfo = async (req, res) => {
	const user_id = req.params.user_id
	
	userService.findByUserId(user_id, function(err, data){
			res.ok({err, data})
	})
}
const getAllUser = async (req, res) => {
	userService.findAll(function(err, data){
		res.json({err, data})
	})
}

const getAllRoles = (req, res) => {
	roleService.findAll((err, data) => {
		res.ok({err, data})
	})
}

const createUserRole = async (req, res) => {
	if(!req.body.user_id || !req.body.role_id){
		res.json({err: 'must include parameter user_id and role_id!'})
	}
	else
		userRoleService.create(req.body, function(err, data){
			res.json({err, data})
		})
}

const createUser = async (req, res) => {
	const userInfo = {
		username: req.body.username ? req.body.username : '',
		firstname: req.body.firstname ? req.body.firstname : '',
		lastname: req.body.lastname ? req.body.lastname : ''
	}
	userService.create(userInfo, function(err1, data1){
		if(err1)
			res.json({err: err1, data: data1})
		else {
			userRoleService.create({user_id: data1[0], role_id: req.body.role_id}, function(err, data){
				if(err)
					res.json({err, data})
				else {
					data1.role_id = data.role_id
					res.json({err, data: data1})
				}
			})
		}
	})
}

const { isAdmin, isLogin, isNonEditTeacher } = require('../config/policies')

route.get('/', isNonEditTeacher, getAllUser )
route.get('/info/:user_id', isLogin, getUserInfo )
route.get('/roles', isNonEditTeacher, getAllRoles )
route.put('/create', isAdmin, createUser )
route.put('/createUserRole', isAdmin, createUserRole )

module.exports = route