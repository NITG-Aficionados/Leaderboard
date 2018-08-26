var mongoose=require('mongoose');
// mongoose.connect('mongodb://localhost/leaderboard');
// var db=mongoose.connect;

var ProfileSchema=mongoose.Schema({
	username:{
		type:String,
		index:true
	},

	name:{
		type:String
	},
	email:{
		type:String
	},
	bio:{
		type:String
	},
	interests:{
		type:String
	},
	cfh:{
		type:String
	},
	tch:{
		type:String
	},
	cch:{
		type:String
	},
	hrh:{
		type:String
	},
	heh:{
		type:String
	},
	cfr:{
		type:Number
	},
	tcr:{
		type:Number
	},
	ccr:{
		type:Number
	},
	hrr:{
		type:Number
	},
	her:{
		type:Number
	},
	index:{
		type:Number
	},
	cr:{
		type:Number
	},
	cnr:{
		type:Number
	},
	img:{
		type:String
	}
});

var Profile=module.exports=mongoose.model('Profile',ProfileSchema);

module.exports.getUserByUsername=function(username,callback){
	var query={username:username};
	Profile.findOne(query,callback);
}

module.exports.createProfile=function(newProfile,callback){

		newProfile.save(callback);

}

module.exports.updateProfile=function(username,newProfile,callback){
		var query={username:username};
		Profile.findOne(query,function(err,profile){
			if (err) throw err;
			profile.name=newProfile.name;
			profile.email=newProfile.email;
			profile.username=newProfile.username;
			profile.bio=newProfile.bio;
			profile.interests=newProfile.interests;
			profile.save();

		});

}

module.exports.updateRatings=function(username,rater,callback){
	var query={username:username};
	Profile.findOne(query,function(err,profile){
	 	if (err) throw err;
	 	profile[rater[0]]=rater[1] || 0;
	 	profile.save();
	});
}

module.exports.updateRanking=function(username,rank,callback){
	var query={username:username};
	Profile.findOne(query,function(err,profile){
	 	if (err) throw err;
	 	profile.cr=rank || 200;
	 	profile.save();
	});
}

module.exports.updatehandle=function(username,handle,callback){
	var query={username:username};
	Profile.findOne(query,function(err,profile){
	 	if (err) throw err;
	 	profile[handle[0]]=handle[1] || "----";
	 	profile.save();
	});
}

module.exports.updateImage=function(username,newProfile,callback){
		var query={username:username};
		Profile.findOne(query,function(err,profile){
			if (err) throw err;
			profile.img=newProfile.img+'.jpg';
			profile.save();
		});
}