const sequelize = require('./db/database')
const express = require('express')
const app = express()
const route = require('./routes/route')
const morgan = require('morgan')
const resStatus = require('express-res-status')
const passport = require('passport')
var cookieParser = require('cookie-parser');

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
app.use(express.static("public"));
app.use(express.json())
app.use(resStatus())
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/pasport-local').passport();

// app.use(passport.authenticate('session'));
app.use('/api', route)

app.get('/', (req, res) => res.json({ message : "ok"}))

// eslint-disable-next-line no-undef
app.listen(PORT, () => console.log("server starting on PORT:", PORT))