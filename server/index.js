require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize');

DB_HOST=process.env.DB_HOST
DB_USER=process.env.DB_USER
DB_PASS=process.env.DB_PASS
DB_NAME=process.env.DB_NAME
PORT=process.env.PORT

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql'
});

const SELECT = QueryTypes.SELECT

async function run() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

run();

const express = require('express')
const app = express()

app.get('/api/user/:user_id', async (req, res) => {
	const user_id = req.params.user_id
	const user = await sequelize.query('SELECT * FROM users WHERE id=:user_id', { type : SELECT, replacements : {user_id} })
	if(user.length == 0) {
		return res.sendStatus(404)
	}
	console.log({user})
	res.json({user})
})

app.listen(PORT, () => console.log("server starting on PORT:", PORT))