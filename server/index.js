const sequelize = require('./db/database')
const express = require('express')
const app = express()
const route = require('./routes/route')
const morgan = require('morgan')
const resStatus = require('express-res-status')

async function run() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

run();
app.use(morgan('combined'))
// app.use(morgan('tiny'))
app.use(express.json())
app.use(resStatus())
app.use('/api', route)

app.get('/', (req, res) => res.json({ message : "ok"}))

app.listen(PORT, () => console.log("server starting on PORT:", PORT))