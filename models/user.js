var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

//AbbosSchema
var AbbonementenSchema = mongoose.Schema({
	coachnaam: {
		type: String,
		index:true
	},
	choachemail: {
		type:String
	},
	soortabbo: {
		type: Number
	},
});

//MachineSchema
var MachineSchema = mongoose.Schema({
	machinenaam: {
		type: String,
		index:true
	},
	time: {
		type: Number, default:(new Date()).getTime()
	},
});

//BankSchema
var BankSchema = mongoose.Schema({
	bankname: {
		type: String,
		index:true
	},
	accountnummer: {
		type: String
	},
	naamhouder: {
		type: String
	}
});

var Bank = module.exports = mongoose.model('Bank', BankSchema);
var Machine = module.exports = mongoose.model('Machine', MachineSchema);
var Abbonementen = module.exports = mongoose.model('Abbo', AbbonementenSchema);
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUsersubmit = function(newUserSubmition, callback){
	var query = {username : naamhouder};
	User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}


module.exports.getTimebyMachineId = function(time, id, callback){
	var query = {time:time};
	User.findById(id, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
