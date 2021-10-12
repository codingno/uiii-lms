const sequelize = require('../db/database')
const { QueryTypes } = require('sequelize')
module.exports = {
    create: async function(data, callback){
        try {
            const queryString = "INSERT INTO categories (code, name, description, parent, position, status) " +
            "VALUES (:code, :name, :description, :parent, :position, :status);"
            const category = await sequelize.query(queryString,{type: QueryTypes.INSERT, replacements: data})
            if(category){
                callback(null, category)
            }
            else
                callback('Failed to create category!', null)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findAll: async function(req, callback){
        try {
            let queryString = "SELECT * FROM categories"
						if(req.params.category_code && req.main_categories)
							queryString += ` where parent = '${req.params.category_code}'`
						else if(req.main_categories)
							queryString += " where parent is null"
            const categories = await sequelize.query(queryString, {type: QueryTypes.SELECT})
            callback(null, categories)
        }
        catch(err) {
            callback(err, null)
        }
    },
    findById: async function(id,callback){
        try {
            const condition = isNaN(parseInt(id)) ? ` code = "${id}" ` : ` id = ${id}`
            const queryString = "SELECT * FROM categories WHERE " + condition
            const categories = await sequelize.query(queryString, {type: QueryTypes.SELECT})
						if(categories.length === 0)
							return callback("No Category found.", null)
            callback(null, categories[0])
        } catch (err) {
            callback(err, null)
        }
    },
    delete: async function(id, callback){
        try {
            const queryString = "DELETE FROM categories WHERE id = " + id
            await sequelize.query(queryString, {type: QueryTypes.DELETE})
            callback(null, {message: "successfully deleted data"})
        }
        catch(err) {
            callback(err, null)
        }
    },
    update: async function(data, callback){
        try {
           const queryString = "UPDATE categories SET code=:code, name=:name, description=:description, parent=:parent, position=:position, status=:status WHERE id=:id"
           const categorie_updated = await sequelize.query(queryString, {type: QueryTypes.UPDATE, replacements: data})
           if (categorie_updated){
               callback(null, categorie_updated)
           }
           else
                callback('update categorie failed', null)
        } catch (err) {
                callback(err, null)
        }
    }
}