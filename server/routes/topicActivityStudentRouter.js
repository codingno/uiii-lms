const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicActivityStudentService = require('../services/topicActivityStudentService')
const activityService = require('../services/activityService')
const { isStudent } = require('../config/policies')

const createTopicActivity = async (req, res) => {
	const topicActivityInfo = {
		topic_id: req.body.topic_id ? req.body.topic_id : '',
		activity_id: req.body.activity_id ? req.body.activity_id : '',
		attachment: req.body.attachment ? req.body.attachment : '',
		createdAt: new Date(),
		createdBy: req.user.id,
		updatedAt: null,
		updatedBy: null,
    }
	topicActivityStudentService.create(topicActivityInfo, function(err, result){
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
		topic_activity_id: req.body.topic_activity_id ? req.body.topic_activity_id : '',
		user_id: req.body.user_id ? req.body.user_id : '',
		attachment: req.body.attachment ? req.body.attachment : '',
	}
	topicActivityStudentService.update(courseInfo, function(err, result){
		if(err)	
            res.badRequest({err, data: null})
        else
            res.ok({err, data: result})

	})
}

route.post('/create', isStudent, createTopicActivity )
route.post('/update', isStudent, updateTopicActivity )