var express = require('express');
var router = express.Router();
var Profile=require('../models/profile.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/logout',function(req,res){

	req.logout();
	req.flash('succes','*You are logged out');
	res.redirect('/users/login');

});

router.get('/leaderboard',function(req,res){
	var list={};

	Profile.find({},function(err,p){
		if(err) throw err;
		console.log(p);
		p.sort(function(a,b){
			return -(parseFloat(a.index)-parseFloat(b.index));
		});

		res.render('leaderboard',{profiles:p});
	});


});





function ensureAuthenticated(req,res,next){
	if (req.isAuthenticated()) {
		return next();
	};
	res.redirect('/users/login');
}




module.exports = router;
