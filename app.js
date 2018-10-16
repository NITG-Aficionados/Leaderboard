let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let expressValidator = require('express-validator');
let cookieParser = require('cookie-parser');
let nodemailer = require('nodemailer');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let bodyParser = require('body-parser');
let multer = require('multer');
let flash = require('connect-flash');
let mongo = require('mongodb');
let mongoose = require('mongoose');
let db = mongoose.connection;
let User = require('./models/user');
let nev = require('email-verification')(mongoose);
let index = require('./routes/index');
let users = require('./routes/users');


let app = express();


let url = "mongodb://127.0.0.1:27017/leaderboard";


mongoose.connect(url);


//Connection Events
mongoose.connection.on("connected" , function()
{
    console.log("Database connected;")
});
mongoose.connection.on("error" , function()
{
    console.log("Database connected;")
});

// Configuration for email verification module

nev.configure({
    verificationURL: 'http://localhost:3000/users/user-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'unverifiedUsers',

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'dipenbhatt12@gmail.com',
            pass: 'dragonforce98064'
        }
    },

    verifyMailOptions: {
        from: 'Do Not Reply <dipenbhatt12@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    }

}, function (error, options) {
    
});

nev.generateTempUserModel(User, function (res, tempUser) {
    // console.log(res, tempUser);
});

// Email verification module configuraytion ends here



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(multer({dest:'./uploads'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }

}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    //res.locals.profile=req.profile || null;
    next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports.app = app;
module.exports.nev = nev;

