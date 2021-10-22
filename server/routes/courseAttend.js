const express = require('express')
const route = express.Router()
const async = require('async')
const courseService = require('../services/courseService')
const courseCategoryService = require('../services/courseCategoryService')
const topicService= require('../services/topicService')
const topicActivityService= require('../services/topicActivityService')
const courseAttendService = require('../services/courseAttendService')
const moment = require('moment')
// const e = require('express')
const getCourseInfo = async (req, res) => {
	const id = req.params.course_id

    courseService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getAllCourse = async (req, res) => {
	courseService.findAll(req, function(err, result){
		res.ok({err, data : result})
	})
}
const getCourseUser = async (req, res) => {
	courseService.findByUserId(req.user.id, function(err, result){
		if(err)
			res.badRequest({err, data: null})
		else
		res.ok({err, data : result})
	})
}

const createCourseAttend = async (req, res) => {
	if(!req.body.course_id || !req.body.topic_id){
		res.json({err: 'must include parameter course and category!'})
	}
	else if(!req.user){
		res.badRequest("You must login!")
	}
	else
		topicService.findById(req.body.topic_id, function(err, topic){
			if(err){
				res.badRequest({err: "Server Error"})		
			}
			else{
				const timeNow = moment()
				const duration = moment.duration(timeNow.diff(topic.startDate));
				const hours = duration.hours()
				const minutes = duration.minutes()
				const data ={
					user_id: req.user.id,
					course_id: req.body.course_id,
					topic_id: req.body.topic_id,
					attendAt: new Date(),
					status: 1,
					description: hours > 0 || minutes > 0 ? 'Late ' + (hours > 0 ? hours + ' hours ' : '') + (minutes > 0 ? minutes + ' minutes' : '') : null
				}
				courseAttendService.create(data, function(err, result){
					res.json({err, result})
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
		status: req.body.status ? req.body.status : '',
		position: req.body.position ? req.body.position : '',
		image_url: req.body.image_url? req.body.image_url: '',
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
route.get('/user', getCourseUser )
route.get('/info/:course_id', getCourseInfo )
route.post('/create',isLogin, createCourseAttend )
route.patch('/update', isTeacher, updateCourse )
// route.post('/createCourseCategory', createCourseCategory )

module.exports = route