module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		// req.flash('error_msg', 'Please log in to view that resource');
		res.redirect('/login');
	},

	forwardAuthenticated: function (req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/');
	},

	ensureAdmin: function (req, res, next) {
		if (req.user.role == 'admin') {
			return next();
		}
		res.redirect('/');
	}
};