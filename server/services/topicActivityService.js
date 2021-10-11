const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO topic_activity (topic_id, activity, attachment, createdAt, createdBy, updatedAt, updatedBy) " +
            "VALUES (:topic_id, :activity, :attachment, :createdAt, :createdBy, :updatedAt, :updatedBy);"
            const topic_activity = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(topic_activity){
                callback(null, topic_activity)
            }
            else
                callback('Failed to create topic_activity!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(callback){
        try {
            const queryString = "SELECT * FROM topic_activity"
            const topic_activity = await sequelize.query(queryString)
            callback(null, topic_activity)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(topic_activity_id,callback){
        try {
            const condition = ` id = ${topic_activity_id}`
            const queryString = "SELECT * FROM topic_activity WHERE " + condition
            const topic_activity = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, topic_activity)
        } catch (err) {
            callback(err, null)
        }
    },
    findByTopic: async function(topic_id,callback){
        try {
            const condition = ` topic_id = ${topic_id}`
            const queryString = "SELECT * FROM topic_activity WHERE " + condition
            const topic_activity = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, topic_activity)
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM topic_activity WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE topic_activity SET topic_id=:topic_id, activity=:activity, attachment=:attachment, updatedAt=:updatedAt, updatedBy=:updatedBy, startDate=:startDate, endDate=:endDate WHERE id =:id"
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