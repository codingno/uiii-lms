var express = require('express');
var router = express.Router();
var loginService = require('../services/loginService')

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

module.exports = router;