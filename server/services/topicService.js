const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO topic (course_id, name, createdAt, createdBy, updatedAt, updatedBy, startDate, endDate) " +
            "VALUES (:course_id, :name, :createdAt, :createdBy, :updatedAt, :updatedBy, :startDate, :endDate);"
            const topic = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(topic){
                callback(null, topic)
            }
            else
                callback('Failed to create topic!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM topic"
            const topic = await sequelize.query(queryString)
            callback(null, topic)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(topic_id,callback){
        try {
            // const condition = ` id = ${topic_id}`
            const condition = ` id = :topic_id`
            const queryString = "SELECT * FROM topic WHERE " + condition
            const topic = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {topic_id}})
            callback(null, topic)
        } catch (err) {
            callback(err, null)
        }
    },
    findByCourseCategory: async function(course_id,callback){
        console.log(`🚀 ~ file: topicService.js ~ line 40 ~ findByCourseCategory:function ~ course_id`, course_id)
        try {
            const condition = ` t.course_id = :course_id || c.code = :course_id`
            const queryString = "SELECT t.* FROM topic t LEFT JOIN courses c ON c.id = t.course_id WHERE " + condition
            const topic = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements: {course_id}})
            callback(null, topic)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM topic WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE topic SET course_category_id=:course_category_id, name=:name, updatedAt=:updatedAt, updatedBy=:updatedBy WHERE id =:id"
           const topic_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (topic_updated){
               callback(null, topic_updated)
           }
           else
                callback('update topic failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}