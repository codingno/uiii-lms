const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO topic_activity_student (topic_activity_id, user_id, attachment, createdAt) " +
            "VALUES (:topic_activity_id, :user_id, :attachment, :createdAt);"
            const topic_activity = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(topic_activity){
                callback(null, topic_activity)
            }
            else
                callback('Failed to create topic_activity_student!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM topic_activity_student"
            const topic_activity = await sequelize.query(queryString)
            callback(null, topic_activity)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(topic_activity_id,callback){
        try {
            const condition = ` ta.id = :topic_activity_id`
            const queryString = "SELECT ta.*, a.name activity_name, a.id activity_id FROM topic_activity ta LEFT JOIN activity a ON ta.activity_id = a.id WHERE " + condition
            const topic_activity = await sequelize.query(queryString, {type: QueryTypes.SELECT, replacements : {topic_activity_id}})
						if(topic_activity.length === 0)
							return callback("No Topic Activity found.", null)
            callback(null, topic_activity[0])
        } catch (err) {
            callback(err, null)
        }
    },
    findByTopic: async function(topic_id,callback){
        try {
            const condition = ` ta.topic_id = ${topic_id}`
            const queryString = "SELECT ta.*, a.name activity_name FROM topic_activity ta LEFT JOIN activity a ON ta.activity_id = a.id WHERE " + condition
            const topic_activity = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, topic_activity)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM topic_activity_student WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE topic_activity_student SET attachment=:attachment, createdAt = NOW() WHERE topic_activity_id=:topic_activity_id AND user_id=:user_id"
           const topic_activity_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (topic_activity_updated){
               callback(null, topic_activity_updated)
           }
           else
                callback('update topic_activity failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}