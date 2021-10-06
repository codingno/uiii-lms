const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO course_categories (course, category, status, createdAt, createdBy, updatedAt, updatedBy, startDate, endDate) " +
            "VALUES (:course, :category, :status, :createdAt, :createdBy, :updatedAt, :updatedBy, :startDate, :endDate);"
            const course_category = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(course_category){
                callback(null, course_category)
            }
            else
                callback('Failed to create course_category!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM course_categories"
            const course_categories = await sequelize.query(queryString)
            callback(null, course_categories)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(course_categorie_id,callback){
        try {
            const condition = ` id = ${course_categorie_id}`
            const queryString = "SELECT * FROM course_categories WHERE " + condition
            const course_categories = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, course_categories)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM course_categories WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE course_categories SET course=:course, category=:category, status=:status, updatedAt=:updatedAt, updatedBy=:updatedBy, startDate=:startDate, endDate=:endDate WHERE id =: id"
           const course_categorie_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (course_categorie_updated){
               callback(null, course_categorie_updated)
           }
           else
                callback('update course_categorie failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}