const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, ensureAdmin } = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const request = require('request');
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
// Load models
const User = require('../models/user');
// const School = require('../models/schools');
const Logs = require('../models/logs');

//y
function createLog(action, category, username) {
	var logData = {
		username: username,
		action: action,
		time: new Date(),
		category: category
	}
	Logs.create(logData, (error, log) => {
		if (error) {
			return next(error);
		}
	});
}

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
	if (!req.user.accountSet) {
		return res.render('set')
	} else {
		return res.render('dashboard')
	}
});

router.get('/', (req, res) => {
	return res.render('index')
});

router.get('/candidates', (req, res) => {
	return res.render('candidates')
});

router.get('/centres', (req, res) => {
	return res.render('centres')
});

router.post('/set', ensureAuthenticated, async (req, res) =>
	User.findById(req.user.id, function (err, user) {

		user.address = req.body.address;
		user.age = req.body.age;
		user.socialSecurity = req.body.socialSecurity;

		user.accountSet = 1;

		user.save();

		req.flash('success_msg', "Account details set.");
		return res.redirect('/dashboard')
	})
);

router.get('/success/h', ensureAuthenticated, async (req, res) =>
	User.findById(req.user.id, function (err, user) {

		user.address = req.body.address;
		user.age = req.body.age;
		user.socialSecurity = req.body.socialSecurity;

		user.accountSet = 1;

		user.save();

		req.flash('success_msg', "Account details set.");
		return res.redirect('/dashboard')

	})
);

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
	return res.render('login')
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
	return res.render('register')
});

router.get('/rsvp', forwardAuthenticated, (req, res) => res.render('rsvp'));

router.post('/rsvp', (req, res) => {
	User.findOne({ accessCode: req.body.code }).exec(function (err, team) {
		if (!team) {
			req.flash('success_msg', "That access code is invalid.");
			return res.redirect('/rsvp')
		} else {
			console.log(team.name)
			if (team.confirmed == 1) {
				return res.render('rsvp', { msg: "That access code has been redeemed." })
			} else {
				// console.log(team)
				return res.render('register', { team: team })
			}
		}

	})
});

// Register Post
router.post('/register', (req, res) => {

	User.findOne({ username: req.body.username }).then(user => {

		if (user) {
			return res.render('register', {
				msg: "This user is not available.",
				username: req.body.username,
				name: req.body.name,
				password: req.body.password
			});
		} else {

			var userData = {
				name: req.body.name,
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			}

			User.create(userData, (error, user) => {
				if (error) {
					console.log(error);
					return res.send('error occured');
				}
			});

		}
	})

	req.flash('success_msg', "Account creation successful.");
	return res.redirect('/login')

});

// Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err)
		}
		if (!user) {
			return res.render('login', { message: info.message })
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/dashboard');
		});
	})(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/login');
});


module.exports = router;