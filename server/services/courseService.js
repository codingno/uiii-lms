const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO courses (code, name, shortname, description, position, status) " +
            "VALUES (:code ,:name, :shortname, :description, :position, :status);"
            const course = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(course){
                callback(null, course)
            }
            else
                callback('Failed to create course!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT c.*, ct.code as category_code FROM courses c LEFT JOIN course_categories cc ON cc.course = c.id LEFT JOIN categories ct ON ct.id = cc.category ORDER BY c.position ASC"
            const courses = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            console.log(`🚀 ~ file: courseService.js ~ line 23 ~ findAll:function ~ courses`, courses)
            callback(null, courses)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(course_id, callback){
        try {
            let condition = isNaN(parseInt(course_id)) ? ` c.code = "${course_id}" ` : ` c.id = ${course_id}`
            const queryString = "SELECT c.*, ct.id as category FROM courses c LEFT JOIN course_categories cc ON cc.course = c.id LEFT JOIN categories ct ON ct.id = cc.category WHERE " + condition
            const courses = await sequelize.query(queryString, {type: QueryTypes.SELECT})
						if(courses.length === 0)
							return callback("No Courses found.", null)
            callback(null, courses[0])
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM courses WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE courses SET code =:code, name =:name, shortname=:shortname, description=:description, position=:position, status=:status WHERE id =:id"
           const course_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (course_updated){
               callback(null, course_updated)
           }
           else
                callback('update course failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}