const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var cors = require('cors')

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = 'mongodb+srv://arhaanb:mujhseshaadikarogi@passport-qsvlu.mongodb.net/core?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
	.connect(
		db,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

//Setting view engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

//Setting public directory
app.use(express.static('public'))

// Sessions
app.use(session({
	secret: 'KissyKissyAnus',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});


// Routes
app.use('/', require('./routes/index.js'));
// app.use('/admin', require('./routes/admin.js'));

//404
app.use((res, req, next) => {
	var err = new Error('File not found!');
	err.status = 404;
	next(err);
});

//Error Handler
app.use((error, req, res, next) => {
	res.status(500);
	res.render('error');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));