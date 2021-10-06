const express = require('express')
const route = express.Router()
const async = require('async')
const categoryService = require('../services/categoryService')
// const e = require('express')
const getCategory = async (req, res) => {
    const id = req.params.category_id
    // const user = await sequelize.query('SELECT * FROM users WHERE id=:user_id', { type : sequelize.SELECT, replacements : {user_id} })
    // if(user.length == 0) {
    // 	return res.sendStatus(404)
    // }
    categoryService.findById(id, function (err, result) {
        // console.log({result});
        // if(err){
        // 	res.badRequest(err)
        // }
        // else if(!result)
        // 	res.json({message: 'user not found'})
        // else 
        res.json({
            err,
            result
        })
    })
    // res.json({user})
}
const getAllCategory = async (req, res) => {
    categoryService.findAll(function (err, result) {
        res.json({
            err,
            result
        })
    })
}
const createCategory = async (req, res) => {
    const data = {
        code: req.body.code ? req.body.code : '',
        name: req.body.name ? req.body.name : '',
        parent: req.body.parent ? req.body.parent : 1,
        position: req.body.position ? req.body.position : 1,
        description: req.body.description ? req.body.description : '',
        status: req.body.status ? req.body.status : 1
    }
    categoryService.create(data, function (err, result) {
        res.json({
            err,
            result
        })
    })
}
const updateCategory = async (req, res) => {
    const data = {
        id: req.body.id,
        code: req.body.code ? req.body.code : '',
        name: req.body.name ? req.body.name : '',
        parent: req.body.parent ? req.body.parent : 1,
        position: req.body.position ? req.body.position : 1,
        description: req.body.description ? req.body.description : '',
        status: req.body.status ? req.body.status : 1
    }
    categoryService.update(data, function (err, result) {
        res.json({
            err,
            result
        })
    })
}
const deleteCategory = async (req, res) => {
    const data = {
        id: req.body.id
    }
    categoryService.delete(data, function (err, result) {
        res.json({
            err,
            result
        })
    })
}
route.get('/:category_id', getCategory)
route.get('/', getAllCategory)
route.put('/create', createCategory)
route.patch('/update', updateCategory)
route.delete('/delete', deleteCategory)

module.exports = route