var express = require('express');
var router = express.Router();
var async = require('async')
var loginService = require('../services/loginService')
var registerService = require('../services/registerService');
var userAuthService = require('../services/userAuthService');
var crypto = require('crypto')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.EMAIL,
	  pass: process.env.PASSEMAIL
	}
  });
var BaseUrlClient = process.env.BASE_URL_CLIENT || 'localhost:3031'  
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
});

router.post('/resetPasswordToken', function(req, res){
	async.waterfall([
		function(cb){
			userAuthService.findByEmail(req.body.email, function(err, data) {
				if(err)
					return res.badRequest({err})
				else if(data.length > 0)
					cb(null, data[0])
				else
					return res.badRequest({err: 'email unregistered!'})
			}) 
		},
		function (data,cb) {
			crypto.randomBytes(16, function (err, buffer) {
				var token = buffer.toString('hex');
				var expiredDate = new Date();
	
				expiredDate.setHours(expiredDate.getHours() + 24);
	
				data.resetPasswordToken = token;
				data.resetPasswordExpired = expiredDate;
	
				userAuthService.update(data, function(err, updated) {
					console.log({err, data, updated});
					if(err)
						return res.badRequest(err)
					else
						cb(null, data)
				})
			  });			
		},
		function(data, cb) {
				const html =`
				<!doctype html>
				<html lang="en-US">

				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Reset Password Email Template</title>
					<meta name="description" content="Reset Password Email Template.">
					<style type="text/css">
						a:hover {text-decoration: underline !important;}
					</style>
				</head>

				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
										<a href="uiii-ulms.id" title="logo" target="_blank">
											<img width="60" src="https://disk.mediaindonesia.com/thumbs/600x400/news/2019/07/80f3537bb03b39c08a80fe8229e9bf77.jpg" title="logo" alt="logo">
										</a>
										</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
															requested to reset your password</h1>
														<span
															style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
															We cannot simply send you your old password. A unique link to reset your
															password has been generated for you. To reset your password, click the
															following link and follow the instructions.
														</p>
														<a href="${BaseUrlClient}/resetPassword/${data.resetPasswordToken}"
															style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
															Password</a>
													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
											<p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>uiii-lms.id</strong></p>
										</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
					<!--/100% body table-->
				</body>

				</html>
				`	
			console.log({html});
			var mailOptions = {
				from: 'sendemailtest032@gmail.com',
				to: data.email,
				subject: 'reset password uiii-lsm',
				html
			};
			transporter.sendMail(mailOptions, function(error, info){
				console.log({error, info});
				if (error) {
				  res.badRequest({err: 'failed to send Email'})
				} else {
				  res.ok('success send Email')
				}
			  });
		}
	])
})

router.get('/checkResetToken/:token', function(req, res){
	console.log('kesini lah', req.params.token);
	userAuthService.findByPasswordToken(req.params.token, function(err, data){
		if(err)
			res.badRequest('invalid token')
		else
			res.ok('valid token')
	})
})

router.post('/resetPassword', function(req, res){
	userAuthService.resetPassword(req.body, function(err, data){
		if(err){
			res.badRequest('failed to reset password')
		}
		else
			res.ok('success to reset password')
	})
})

module.exports = router;