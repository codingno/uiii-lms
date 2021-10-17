const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicService = require('../services/topicService')
const moment = require('moment')
// const e = require('express')
const getTopicById = async (req, res) => {
	const id = req.params.topic_id

    topicService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getAllTopicByCourseId = async (req, res) => {
	topicService.findByCourseCategory(req.params.course_id || req.query.course_id,function(err, result){
		result.map(item => {
			item.startDate = moment(item.startDate).format('MMMM Do YYYY, h:mm a')
			item.endDate = moment(item.endDate).format('MMMM Do YYYY, h:mm a')
			return item
		})
		console.log({result});
		res.ok({err, data : result})
	})
}

const createTopic = async (req, res) => {
	const topicInfo = {
		course_id: req.body.course_id ? req.body.course_id : '',
		name: req.body.name ? req.body.name : '',
		createdAt: new Date(),
		createdBy: req.user.id,
		updatedAt: null,
		updatedBy: null,
		startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
		endDate: req.body.endDate ? new Date(req.body.endDate) : null
    }
	topicService.create(topicInfo, function(err, result){
		if(err)
			res.badRequest({message: err, data: null})
		else {
			res.ok({err, data: result})
		}

	})
}
const updateTopic = async (req, res) => {
	const topicInfo = {
		id: req.body.id ? req.body.id : '',
		course_category_id: req.body.course_category_id ? req.body.course_category_id : '',
		name: req.body.name ? req.body.name : '',
		updatedAt: new Date(),
		updatedBy: req.user.id,
		startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
		endDate: req.body.endDate ? new Date(req.body.endDate) : null
	}
	topicService.update(topicInfo, function(err, result){
		if(err)	
            res.badRequest({err, data: null})
        else
            res.ok({err, data: result})

	})
}
const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/list', getAllTopicByCourseId )
route.get('/list/:course_id', getAllTopicByCourseId )
route.get('/info/:topic_id', getTopicById )
route.post('/create', isTeacher, createTopic )
route.post('/update', isTeacher, updateTopic )

module.exports = route