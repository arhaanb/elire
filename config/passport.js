const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
			// Match user
			User.findOne({
				username: username
			}).then(user => {
				if (!user) {
					console.log('bruh')
					return done(null, false, { message: 'Username or password incorrect.' });
				}
				
				
				// Match password
				if (password == user.password) {
					return done(null, user);
				} else {
					console.log('wrong pw')
					return done(null, false, { message: 'Username or password incorrect.' });
				}
			});
		})
	);

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};