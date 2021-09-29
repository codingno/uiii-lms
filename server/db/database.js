require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize');

DB_HOST=process.env.DB_HOST
DB_USER=process.env.DB_USER
DB_PASS=process.env.DB_PASS
DB_NAME=process.env.DB_NAME
PORT=process.env.PORT

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
	// disable logging; default: console.log
  logging: false,
});

sequelize.SELECT = QueryTypes.SELECT
sequelize.INSERT = QueryTypes.INSERT
sequelize.UPDATE = QueryTypes.UPDATE
sequelize.DELETE = QueryTypes.DELETE

module.exports = sequelize