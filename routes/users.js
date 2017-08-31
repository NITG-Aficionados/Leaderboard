var express = require('express');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var router = express.Router();
var User=require('../models/user.js')
var Profile=require('../models/profile.js');
var noodle=require('noodlejs');
var request=require('request');
var path = require('path')
var multer = require('multer')



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Why the fuck ur playing with URLs :| ');
});

router.get('/register',function(req,res,next){
	res.render('register');
});


router.get('/login',function(req,res,next){
	res.render('login');
});



router.post('/register',function(req,res,next){
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;
	/*for (var i=0;i<100;i++)
	request.post({
  		url:     'https://blog-dipen.appspot.com/signup',
  		form:    { 			
  			username:name,
			email:email,
			password:i,
			verify:i}
	}, function(error, response, body){
  		console.log(response);
	});*/

	req.checkBody('name','Name field is required.').notEmpty();
	req.checkBody('email','Email field is required.').notEmpty();
	req.checkBody('email','Email is Invalid.').isEmail();
	req.checkBody('username','Username field is required.').notEmpty();
	req.checkBody('password','Password field is required.').notEmpty();
	req.checkBody('password2','Passwords do not match.').equals(req.body.password);

	var errors=req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors,
			name:name,
			email:email,
			username:username,
			password:password,
			password2:password2
		});
	}else{

		var newUser=new User({
			name:name,
			email:email,
			username:username,
			password:password,

		});

		var newProfile=new Profile({
			username:username,
			name:name,
			email:email,
			bio:"Fill It",
			interests:"Fill It",
			cfh:"----",
			tch:"----",
			cch:"----",
			hrh:"----",
			heh:"----",				
			cfr:0,
			tcr:0,
			ccr:0,
			hrr:0,
			her:0,
			index:0,
			cr:200,
			cnr:200,
			img:"noimage.jpg"
		});

		User.createUser(newUser,function(err,user){
			if(err)throw err;
			console.log(user);
		});

		Profile.createProfile(newProfile,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});


		req.flash('succes','You are now registered.Please login.');
		res.location('/');
		res.redirect('/');

	}



});


passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err,user){
		done(err,user);
	})
});


passport.use(new LocalStrategy(
	function(username,password,done){
		User.getUserByUsername(username,function(err,user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				return done(null,false,{message:'Unknown User'});
			}
			User.comparePassword(password,user.password,function(err,isMatch){

				if(err)throw err;
				if(isMatch){
					return done(null,user);
				}else{
					console.log('Invalid Password.');
					return done(null,false,{message:'Invalid• Password'});
				}

			});
		});
	}
));

router.get('/:username',Authenticated,function(req,res){
	var username=req.params.username;
	Profile.getUserByUsername(username,function(err,profile){
		if(err) throw err;
		console.log(profile);
		res.render("profile",profile);		
	});	
});

router.get('/:username/edit',ensureAuthenticated,function(req,res){
	var username=req.params.username;
	Profile.getUserByUsername(username,function(err,profile){
		if(err) throw err;
		console.log("---------------editing ----------\n "+profile);
		res.render("edit",profile);		
	});	
});

router.post('/:username/edit',ensureAuthenticated,function(req,res){

	var name=req.body.name;
	var email=req.body.email;
	var bio=req.body.bio;
	var interests=req.body.interests;
	var username=req.params.username;
	var newusername=req.body.username;
	console.log(name)
	req.checkBody('name','Name field is required.').notEmpty();
	req.checkBody('username','Username field is required.').notEmpty();	
	req.checkBody('email','Email field is required.').notEmpty();
	req.checkBody('email','Email is Invalid.').isEmail();
	req.checkBody('bio','Bio field is required.').notEmpty();
	req.checkBody('interests','interests field is required.').notEmpty();	

	var errors=req.validationErrors();

	if(errors){
		res.render('edit',{
			errors:errors,
		});
	}else{


		var newProfile=new Profile({
			username:newusername,
			name:name,
			email:email,
			bio:bio,
			interests:interests,
			cfh:"----",
			tch:"----",
			cch:"----",
			hrh:"----",
			heh:"----",			
			cfr:0,
			tcr:0,
			ccr:0,
			hrr:0,
			her:0,
			index:0,
			cr:200,
			cnr:200,
			img:"noimage.jpg"
		});

		User.updateUsername(username,newusername,function(err,user){
			if(err)throw err;
			console.log(user);
		});

		Profile.updateProfile(username,newProfile,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});



		req.flash('succes','Changes have been saved');
		res.location('/users/'+newusername);
		res.redirect('/users/'+newusername);

	}

});

function ensureAuthenticated(req,res,next){
	if (req.isAuthenticated()) {
		return next();
	};
	console.log("invalid access.")
	res.redirect('/users/login');
}

function Authenticated(req,res,next){
	if (req.isAuthenticated() &&req.user.username==req.params.username) {
		return next();
	};
	var username=req.params.username;
	Profile.getUserByUsername(username,function(err,profile){
		if(err) throw err;
		console.log(profile);
		res.render("non_login_profile",profile);		
	});	
}



router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'*Invalid Username or password'}),function(req,res){
	var username=req.user.username;
	console.log('Authentication Succesful of user:'+username);
	req.flash('succes','*You are logged in');
	res.redirect('/users/'+username);
});



router.get('/:username/cf/:handle',function(req,res){
	var handle =req.params.handle;
	var username=req.params.username;
	var rating=0;
	var handler=['cfh',handle];
		Profile.updatehandle(username,handler,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});	

	request("http://codeforces.com/api/user.rating?handle="+handle, function(error, response, body) {
  		body=JSON.parse(body);
  		console.log(body.result[body.result.length-1].newRating);
  		var rater=["cfr",body.result[body.result.length-1].newRating];
  		
  		Profile.updateRatings(req.params.username,rater,function(err,profile){
			if (err) throw err;
			console.log(profile);
		});
	
		res.send(body.result[body.result.length-1].newRating.toString());
	});

	

});


router.get('/:username/tc/:handle',function(req,res){
	var handle =req.params.handle;
	var username=req.params.username;
	var rating=0;
	var handler=['tch',handle];
		Profile.updatehandle(username,handler,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});	


	request("http://api.topcoder.com/v2/users/"+handle, function(error, response, body) {
  		body=JSON.parse(body);
  		console.log(body.ratingSummary[0].rating);
  		var rater=["tcr",body.ratingSummary[0].rating];
  		
  		Profile.updateRatings(req.params.username,rater,function(err,profile){
			if (err) throw err;
			console.log(profile);
		});
	
  		
		res.send(body.ratingSummary[0].rating.toString());
	});	

});

router.get('/:username/cc/:handle',function(req,res){
	var handle =req.params.handle;
	var username=req.params.username;
	var rating=0;
	var handler=['cch',handle];
		Profile.updatehandle(username,handler,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});	

 
	noodle.query({  
  		url: 'https://www.codechef.com/users/'+handle,
  		type: 'html',
  		selector: 'aside',
  		extract: 'text'
	})
	.then(function (results) {
  		console.log(results.results[0].results[1].split(' ')[0]);
  		var rater=["ccr",results.results[0].results[1].split(' ')[0]];
  		
  		Profile.updateRatings(req.params.username,rater,function(err,profile){
			if (err) throw err;
			console.log(profile);
		});
	
  		
  		res.send(results.results[0].results[1].split(' ')[0].toString());
	});
});


router.get('/:username/hr/:handle',function(req,res){
	var handle =req.params.handle;
	var username=req.params.username;
	var rating=0;
	var handler=['hrh',handle];
		Profile.updatehandle(username,handler,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});	


	noodle.query({  
  		url: 'https://www.hackerrank.com/leaderboard?hacker='+handle+'&page=1',
  		type: 'html',
  		selector: 'div',
  		extract: 'text'
	})
	.then(function (results) {
  		console.log(results.results[0].results[65]);
  		var rater=["hrr",results.results[0].results[65]];
  		
  		Profile.updateRatings(req.params.username,rater,function(err,profile){
			if (err) throw err;
			console.log(profile);
		});

  		res.send(results.results[0].results[65].toString());
  		
	});

});

router.get('/:username/he/:handle',function(req,res){
	var handle =req.params.handle;
	var username=req.params.username;
	var rating=0;

	var handler=['heh',handle];
		Profile.updatehandle(username,handler,function(err,profile){
			if(err)throw err;
			console.log(profile);
		});	


	var noodle = require('noodlejs');
 
	noodle.query({  
  		url: 'https://www.hackerearth.com/@'+handle,
  		type: 'html',
  		selector: 'div.left',
  		extract: 'text'
	})
	.then(function (results) {
  		console.log(results.results[0].results[1].split(' ')[399]);
  		var rater=["her",results.results[0].results[1].split(' ')[399]];
  		
  		Profile.updateRatings(req.params.username,rater,function(err,profile){
			if (err) throw err;
			console.log(profile);
		});

  		res.send(results.results[0].results[1].split(' ')[399].toString());
	});

});

router.get('/:username/refresh',function(req,res){


  		var rater=["index",req.query.ind];
  		
  		Profile.updateRatings(req.params.username,rater,function(err,profile){
			if (err) throw err;
			console.log(profile);
		});


	Profile.find({},function(err,p){
		if(err) throw err;
		console.log(p);
		p.sort(function(a,b){
			return -(parseFloat(a.index)-parseFloat(b.index));
		});

		for(var i=0;i<p.length;++i){
			console.log(p[i].username);
			Profile.updateRanking(p[i].username,i+1,function(err,profile){

				if(err) throw err;
				console.log(profile);
			});
		}
	});

	/*Profile.findOne(req.params.username,function(err,profile){
	 	if (err) throw err;
	 	res.send({"ind":profile.ind,"cr":profile.cr});

	});*/	

//	res.redirect('/users/'+username);
		res.location('/users/'+req.params.username,);
		res.redirect('/users/'+req.params.username,);

});





module.exports = router;
