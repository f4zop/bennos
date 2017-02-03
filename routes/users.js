var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

//abboneer user
router.get('/registerabbo', function(req, res){
	res.render('registerabbo');
});

router.post('/registerabbo', function(req, res){
	var banknaam = req.body.banknaam;
	var naamhouder = req.body.naamhouder;
	var accountnummer = req.body.accountnummer;
	var soortabbonement = req.body.soortabbonement.value;

	// Validation
	req.checkBody('banknaam', 'Name is required').notEmpty();
	req.checkBody('naamhouder', 'Email is required').notEmpty();
	req.checkBody('accountnummer', 'Account number is required').notEmpty();
	req.checkBody('soortabbonement', 'submition type is required').notEmpty();

var errors = req.validationErrors();

if(errors){
	res.render('registerabbo',{
		errors:errors
	});
} else {
	var newUserSubmition = new Bank({
		bankname: banknaam,
		naamhouder: naamhouder,
		accountnummer: accountnummer,
		soortabbonement: soortabbonement
	}, new Abbo({
		choachemail: '',
	}));

	User.createUsersubmit(newUserSubmition, function(err, user){
		if(err) throw err;
		console.log(user);
	});

	req.flash('success_msg', 'You are submitted and can now see your progress');

	res.redirect('/users/login');
}
});

// Register User
// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var lastname = req.body.lastname;
	var woonplaats = req.body.woonplaats;
	var postcode = req.body.postcode;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('lastname', 'lastname is required').notEmpty();
	req.checkBody('woonplaats', 'lastname is required').notEmpty();
	req.checkBody('postcode', 'lastname is required').notEmpty();

	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			lastname : lastname,
			woonplaats: woonplaats,
			postcode: postcode,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
