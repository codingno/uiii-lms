var express = require('express');
var router = express.Router();
var loginService = require('../services/loginService')
var registerService = require('../services/registerService')
/* GET users listing. */
router.post('/login', function(req, res, next) {
    if(!req.body.email || !req.body.password){
		return res.badRequest({message: 'Parameter tidak lengkap'});
	  }

	  if(req.user) {
		req.logout();
	  }
  
	  loginService(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.post('/register', function(req, res, next) {
    if(!req.body.email || !req.body.password || !req.body.username){
		return res.badRequest({message: 'Parameter tidak lengkap'});
	  }

	  if(req.user) {
		req.logout();
	  }
  
	  registerService(req, res, next);
});

router.get('/auth/info', (req, res) => {
	if(req.user)
		res.ok({user : req.user})
	else res.ok(null)
})

module.exports = router;