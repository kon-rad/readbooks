var bodyParser 			= require('body-parser'),
	mongoose			= require('mongoose'),
	express				= require('express'),
	session 			= require('express-session'),
	methodOverride		= require('method-override'),
	app					= express(),
	Book 				= require('./models/book'),
	Comment				= require('./models/comment'),
	seedDB				= require('./seeds'),
	User				= require('./models/user'),
	passport			= require('passport'),
	LocalStrategy		= require('passport-local'),
	morgan 				= require('morgan'),
	flash 				= require('connect-flash');

// ROUTES
var indexRoutes 	= require('./routes/index'),
	bookRoutes		= require('./routes/books'),
	commentRoutes	= require('./routes/comments');

// CONNECT DATABASE

// mongoose.Promise = require('bluebird');
// mongoose.connect("mongodb://localhost/booksread");

mongoose.connect("mongodb://bookreader:lovesMuir@ds157971.mlab.com:57971/booksread");

require('./config/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", "ejs");

app.use(session({
  secret: 'omtaretutaretoresoha',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use(methodOverride("_method"));
seedDB();

app.use('/', indexRoutes);
app.use('/books',  bookRoutes);
app.use('/books/:id/comments', commentRoutes);


// app.listen(process.env.PORT, process.env.IP);
app.listen(process.env.PORT, function(){
	console.log("server on 8080");
});
