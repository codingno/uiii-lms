const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicActivityService = require('../services/topicActivityService')
// const e = require('express')
const getTopicById = async (req, res) => {
	const id = req.params.id

    topicActivityService.findById(id, function(err, result){
		res.json({err, data : result})
	})
}
const getAllActivityByTopicId = async (req, res) => {
	topicActivityService.findByTopic(req.body.topic_id,function(err, result){
		res.ok({err, data : result})
	})
}

const createTopicActivity = async (req, res) => {
	const topicActivityInfo = {
		topic_id: req.body.course_category_id ? req.body.course_category_id : '',
		activity: req.body.activity ? req.body.activity : '',
		attachment: req.body.attachment ? req.body.attachment : '',
		createdAt: new Date(),
		createdBy: req.user.id,
		updatedAt: null,
		updatedBy: null,
    }
	topicActivityService.create(topicActivityInfo, function(err, result){
    console.log(`🚀 ~ file: courseRouter.js ~ line 41 ~ courseService.create ~ result1`, result, err)
		if(err)
			res.badRequest({message: err, data: null})
		else {
			res.ok({err, data: result})
		}

	})
}
const updateTopicActivity = async (req, res) => {
	const courseInfo = {
		id: req.body.id ? req.body.id : '',
		topic_id: req.body.course_category_id ? req.body.course_category_id : '',
		activity: req.body.activity ? req.body.activity : '',
		attachment: req.body.attachment ? req.body.attachment : '',
		updatedAt: new Date(),
		updatedBy: req.user.id,
	}
	topicActivityService.update(courseInfo, function(err, result){
		if(err)	
            res.badRequest({err, data: null})
        else
            res.ok({err, data: result})

	})
}
const { isAdmin, isLogin, isTeacher, isNonEditTeacher } = require('../config/policies')
route.get('/list', getAllActivityByTopicId )
route.get('/info/:id', getTopicById )
route.post('/create', isTeacher, createTopicActivity )
route.post('/update', isTeacher, updateTopicActivity )

module.exports = route