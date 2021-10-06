
module.exports = {
	isLogin : (req, res, next) => {
		if(req.user)
			next()
		else 
			res.forbidden()
	},
	isAdmin : (req, res, next) => {
		if(req.user && req.user.role_id == 1)
			next()
		else 
			res.forbidden()
	},
	isManager : (req, res, next) => {
		if(req.user && req.user.role_id <= 2)
			next()
		else 
			res.forbidden()
	},
	isCourseCreator : (req, res, next) => {
		if(req.user && req.user.role_id <= 3)
			next()
		else 
			res.forbidden()
	},
	isTeacher : (req, res, next) => {
		if(req.user && req.user.role_id <= 4)
			next()
		else 
			res.forbidden()
	},
	isNonEditTeacher : (req, res, next) => {
		if(req.user && req.user.role_id <= 5)
			next()
		else 
			res.forbidden()
	},
	isStudent : (req, res, next) => {
		if(req.user && req.user.role_id <= 6)
			next()
		else 
			res.forbidden()
	},
	isPublic : (req, res, next) => {
			next()
	},
}