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
const Votes = require('../models/vote');

//y
function createVote(bywho, forwho) {
	var voteData = {
		bywho: bywho,
		forwho: forwho,
		time: new Date(),
	}
	Votes.create(voteData, (error, log) => {
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
		Votes.find().then(votes => {
			return res.render('dashboard', { votes })
		})
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

router.get('/success/h', ensureAuthenticated, async (req, res) => {
	if (req.user.voted) {
		req.flash('success_msg', "You've already voted.");
		return res.redirect('/dashboard')
	}
	User.findById(req.user.id, function (err, user) {

		createVote(req.user.name, 'hitarth')

		user.voted = 1;

		user.save();

		return res.render('success', { votedfor: 'Hitarth Khurana' })

	})
});

router.get('/success/i', ensureAuthenticated, async (req, res) => {
	console.log(req.user)
	if (req.user.voted) {
		req.flash('success_msg', "You've already voted.");
		return res.redirect('/dashboard')
	}
	User.findById(req.user.id, function (err, user) {

		createVote(req.user.username, 'inesh')

		user.voted = 1;

		user.save();

		return res.render('success', { votedfor: 'Inesh Tickoo' })

	})
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
	return res.render('login')
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
	return res.render('register')
});

router.get('/edit', ensureAuthenticated, (req, res) => {
	return res.render('edit')
});

router.post('/edit', (req, res) => {
	User.findById(req.user.id, function (err, user) {
		user.email = req.body.email
		user.username = req.body.username
		user.save()
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
				password: req.body.password,
				email: req.body.email
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