const express = require('express')
const route = express.Router()
const async = require('async')
const enrollmentService = require('../services/enrollmentService')

const getAllEnrollment = async (req, res) => {
    if(req.user.role !== 'admin')
    enrollmentService.findByUserId(req.user.id,function (err, result) {
        res.json({
            err: err,
            data : result
        })
    })
    else
    enrollmentService.findAll(function (err, result) {
        res.json({
            err: err,
            data : result
        })
    })
}
const getAllEnrollmentByCourse = async (req, res) => {
    enrollmentService.findByCourseId(req.param.course_id,function (err, result) {
        res.json({
            data : result
        })
    })
}
const createEnrollment = async (req, res) => {
    const data = {
        course_id: req.body.course_id ? req.body.course_id : '',
        user_id: req.body.user_id ? req.body.user_id : '',
    }
    enrollmentService.create(data, function (err, result) {
        res.json({
            err,
            data : result
        })
    })
}
const updateEnrollment = async (req, res) => {
    const data = {
        id: req.body.id,
        course_id: req.body.course_id ? req.body.course_id : '',
        user_id: req.body.user_id ? req.body.user_id : '',
    }
    enrollmentService.update(data, function (err, result) {
        res.json({
            err,
            data : result
        })
    })
}
const deleteEnrollment = async (req, res) => {
    const data = {
        id: req.body.id
    }
    enrollmentService.delete(data, function (err, result) {
        res.json({
            err,
            result
        })
    })
}
route.get('/', getAllEnrollment)
route.get('/course/:course_id', getAllEnrollmentByCourse)
route.post('/create', createEnrollment)
route.patch('/update', updateEnrollment)
route.delete('/delete', deleteEnrollment)

module.exports = route