const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mysql = require('mysql');
const User = require('./models/User');
const app = express();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('./config/auth');




const { getDashboard, getWelcome, getProfile } = require('./routes/index');
const { addExamPage, addExam, deleteExam, editExam, editExamPage, getExams } = require('./routes/exams');
const { getLogin, postLogin, getRegister, postRegister, getLogout } = require('./routes/users');
const { getUebungsblaetter, showUebungsblaetter, addUebungsblattPage, addUebungsblatt, deleteUebungsblatt, editUebungsblatt, editUebungsblattPage } = require('./routes/uebungsblaetter');
const { getVorlesungen, addVorlesung, addVorlesungPage, editVorlesung, editVorlesungPage, deleteVorlesung } = require('./routes/vorlesungen');

// Passport config
require('./config/passport')(passport);






// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));





// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//SQL-Verbindung
var sql = mysql.createConnection({
    host: "remotemysql.com",
    user: "oUyCsXhXyi",
    password: "IzgttKiqZr",
    database: "oUyCsXhXyi"
});

sql.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.sql = sql;

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', getWelcome);
app.get('/users/login', getLogin);
app.get('/users/register', getRegister);
app.get('/users/logout', ensureAuthenticated, getLogout);
app.get('/dashboard', ensureAuthenticated, getDashboard);
app.get('/exams/addExam', ensureAuthenticated, addExamPage);
app.get('/exams/editExam/:semester/:name', ensureAuthenticated, editExamPage);
app.get('/exams/deleteExam/:semester/:name', ensureAuthenticated, deleteExam);
app.get('/profile', ensureAuthenticated, getProfile);
app.get('/exams', ensureAuthenticated, getExams);
app.get('/uebungsblaetter', ensureAuthenticated, getUebungsblaetter);
app.get('/uebungsblaetter/:semester/:name', ensureAuthenticated, getUebungsblaetter);
app.get('/uebungsblaetter/addUebungsblatt', ensureAuthenticated, addUebungsblattPage);
app.get('/uebungsblaetter/editUebungsblatt/:semester/:name/:number', ensureAuthenticated, editUebungsblattPage);
app.get('/uebungsblaetter/deleteUebungsblatt/:semester/:name/:number', ensureAuthenticated, deleteUebungsblatt);
app.get('/vorlesungen', ensureAuthenticated, getVorlesungen);
app.get('/vorlesungen/addVorlesung', ensureAuthenticated, addVorlesungPage);
app.get('/vorlesungen/deleteVorlesung/:semester/:name', ensureAuthenticated, deleteVorlesung);
app.get('/vorlesungen/editVorlesung/:semester/:name', ensureAuthenticated, editVorlesungPage);


app.post('/users/login', postLogin);
app.post('/users/register', postRegister);
app.post('/exams/addExam', ensureAuthenticated, addExam);
app.post('/exams/editExam/:semester/:name', ensureAuthenticated, editExam);
app.post('/uebungsblaetter', ensureAuthenticated, showUebungsblaetter);
app.post('/uebungsblaetter/addUebungsblatt', ensureAuthenticated, addUebungsblatt);
app.post('/uebungsblaetter/editUebungsblatt/:semester/:name/:number', ensureAuthenticated, editUebungsblatt);
app.post('/vorlesungen/addVorlesung', ensureAuthenticated, addVorlesung);
app.post('/vorlesungen/editVorlesung/:semester/:name', ensureAuthenticated, editVorlesung);




const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));