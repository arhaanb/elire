const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, ensureAdmin } = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const request = require('request');
// Load models
const User = require('../models/user');
const Votes = require('../models/vote');

function createLog(bywho, forwho) {
	var voteData = {
		forwho: forwho,
		bywho: bywho,
		time: new Date(),
	}
	Votes.create(voteData, (error, log) => {
		if (error) {
			return next(error);
		}
	});
}

router.get('/dashboard', (req, res) => {
	return res.redirect('/')
})

// Admin
router.get('/', ensureAuthenticated, ensureAdmin, (req, res) => {
	User.find().then(users => {
		return res.render('./admin/index')
	})
});

// Register teams
router.get('/register', ensureAuthenticated, ensureAdmin, (req, res) => {
	return res.render('./admin/register')
});

router.post('/school', ensureAuthenticated, ensureAdmin, (req, res) => {

	User.findOne({ accessCode: req.body.code }).then(school => {
		if (school) {
			return res.render('school', {
				msg: "This access code is already in use",
				name: req.body.name,
				accessCode: req.body.code
			});
		} else {

			var schoolData = {
				school: req.body.name,
				accessCode: req.body.code
			}

			User.create(schoolData, (error, school) => {
				if (error) {
					console.log(error);
					return res.send('error occured');
				}
			});

		}
	})
	req.flash('success_msg', "Team registered successfully.");
	return res.redirect('/admin/register')
});

// Teams
router.get('/teams', ensureAuthenticated, ensureAdmin, (req, res) => {
	User.find().then(users => {
		return res.render('./admin/info', { users: users })
	})
});


//Disqualify

router.get('/disqualify', ensureAdmin, ensureAuthenticated, (req, res) => {
	User.find().exec(function (err, users) {
		if (err) {
			return res.redirect('/error')
		}
		return res.render('./admin/disqualify', { users: users })
	})
})

router.post('/disqualify', ensureAuthenticated, ensureAdmin, (req, res) => {
	User.findOne({ username: req.body.school }).exec(function (err, user) {
		if (err) {
			return res.redirect('/error')
		}
		user.disqualified = 1
		user.save();
		createLog('Team was disqualified.', 'update', req.body.username)
		req.flash('success_msg', "Team disqualified.");
		return res.redirect('/admin/disqualify')
	})
})


//Funds
router.get('/funds', ensureAuthenticated, ensureAdmin, (req, res) => {
	User.find().exec(function (err, users) {
		if (err) {
			return res.redirect('/error')
		}
		return res.render('./admin/funds', { users: users })
	})
});


router.post('/funds', ensureAuthenticated, ensureAdmin, (req, res) => {
	User.findOne({ username: req.body.school }).exec(function (err, user) {
		if (err) {
			return res.redirect('/error')
		}
		var init = user.funds
		var newfunds = parseInt(req.body.funds)
		user.funds = init + newfunds
		user.save();
		createLog(req.body.reason, 'update', req.body.username)
		req.flash('success_msg', "Funds added succesfully.");
		return res.redirect('/admin/funds')
	})
})


// Individual Team page to view info
router.get('/teams/:username', ensureAuthenticated, ensureAdmin, (req, res) => {
	User.find({ username: req.params.username }).exec(function (err, users) {
		if (err) {
			console.log(err)
			return res.send({ msg: "some error ocurred" })
		} else {
			if (users.length > 0) {
				return res.render('./admin/indi', { users: users });
			} else {
				return res.send({ msg: "Account doesn't exist." })
			}
		}
	})
})

module.exports = router;