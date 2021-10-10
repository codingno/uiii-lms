const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const courseService = require('../services/courseService')
const courseCategoryService = require('../services/courseCategoryService')
const categoryService = require('../services/categoryService')
// const e = require('express')
const getCourseInfo = async (req, res) => {
	const id = req.params.course_id

    courseService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getAllCourse = async (req, res) => {
	courseService.findAll(function(err, result){
		res.ok({err, data : result})
	})
}
const createCourseCategory = async (req, res) => {
	if(!req.body.course || !req.body.category){
		res.json({err: 'must include parameter course and category!'})
	}
	else
		courseCategoryService.create(req.body, function(err, result){
			res.json({err, result})
		})
}

const createCourse = async (req, res) => {
	const courseInfo = {
		code: req.body.code ? req.body.code : '',
		name: req.body.name ? req.body.name : '',
		shortname: req.body.shortname ? req.body.shortname : '',
		description: req.body.description ? req.body.description : '',
		position: req.body.position ? req.body.position : '',
		status: req.body.status ? req.body.status : ''
	}
	courseService.create(courseInfo, function(err1, result1){
    console.log(`🚀 ~ file: courseRouter.js ~ line 41 ~ courseService.create ~ result1`, result1, err1)
		if(err1)
			res.badRequest({message: err1, result: result1})
		else {
            const data = {
                course: result1[0],
                category: req.body.category,
                createdAt: new Date(),
                createdBy: req.user.id,
                updatedAt: null,
                updatedBy: null,
                startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
                endDate: req.body.endDate ? new Date(req.body.endDate) : new Date(),
                status: 1
            }
            console.log(`🚀 ~ file: courseRouter.js ~ line 55 ~ courseService.create ~ data`, data)
			courseCategoryService.create(data, function(err, result){
				if(err)
					res.json({err, result})
				else {
					result1.role_id = result.role_id
					res.ok({err, data: result1})
				}
			})
		}

	})
}
const updateCourse = async (req, res) => {
	const courseInfo = {
		id: req.body.id ? req.body.id : '',
		code: req.body.code ? req.body.code : '',
		name: req.body.name ? req.body.name : '',
		shortname: req.body.shortname ? req.body.shortname : '',
		description: req.body.description ? req.body.description : '',
		status: req.body.status ? req.body.status : ''
	}
	courseService.update(courseInfo, function(err1, result1){
		if(err1)
			res.json({err: err1, result: result1})
		else {
            const data = {
				id: req.body.course_category_id ? req.body.course_category_id : '',
                course: courseInfo.id,
                category: req.body.category,
                updatedAt: new Date(),
                updatedBy: req.user.id,
                startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
                endDate: req.body.endDate ? new Date(req.body.endDate) : new Date(),
                status: 1
            }
			courseCategoryService.update(data, function(err, result){
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
const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/', getAllCourse )
route.get('/info/:course_id', getCourseInfo )
route.post('/create', isTeacher, createCourse )
route.post('/createCourseCategory', createCourseCategory )

module.exports = route