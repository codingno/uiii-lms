const { Sequelize } = require('sequelize')
const express = require('express')
const route = express.Router()
const async = require('async')
const topicActivityStudentService = require('../services/topicActivityStudentService')
const activityService = require('../services/activityService')
const { isStudent } = require('../config/policies')

const createTopicActivity = async (req, res) => {
	const topicActivityInfo = {
		topic_activity_id: req.body.topic_activity_id ? req.body.topic_activity_id : '',
		user_id: req.user.id,
		attachment: req.body.attachment ? req.body.attachment : '',
		createdAt: new Date(),
    }
	topicActivityStudentService.create(topicActivityInfo, function(err, result){
		if(err)
			res.badRequest('System Error')
		else {
			res.ok({err, data: result})
		}

	})
}
const updateTopicActivity = async (req, res) => {
	const courseInfo = {
		// id: req.body.id ? req.body.id : '',
		topic_activity_id: req.body.topic_activity_id ? req.body.topic_activity_id : '',
		user_id: req.user.id,
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

module.exports = route