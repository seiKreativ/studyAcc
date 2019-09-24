const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User').Users;

/*
//Login Page
router.get('/login', (req, res) => res.render('login'));

//Login Page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Checl required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //Checl passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exitrs
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errrors,
                        name,
                        email,
                        password,
                        passowrd2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (error, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // set Password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then((user) => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }));
                }
            });
    }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}); */

module.exports = {
    getRegister: (req, res) => { res.render('register.ejs') },
    getLogin: (req, res) => { res.render('login.ejs') },
    postRegister: (req, res) => {
        const { name, email, password, password2 } = req.body;
        let errors = [];

        // Checl required fields
        if (!name || !email || !password || !password2) {
            errors.push({ msg: 'Please fill in all fields' });
        }

        //Checl passwords match
        if (password !== password2) {
            errors.push({ msg: 'Passwords do not match' });
        }

        // check pass length
        if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters' });
        }

        if (errors.length > 0) {
            res.render('register.ejs', {
                errors,
                name,
                email,
                password,
                password2
            });
        } else {
            // Validation passed
            User.findOne({
                    where: {
                        email: req.body.email
                    }
                })
                .then(user => {

                    if (user) {
                        // User exitrs
                        errors.push({ msg: 'Email is already registered' });
                        res.render('register.ejs', {
                            errors,
                            name,
                            email,
                            password,
                            password2
                        })
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password,

                        });
                        console.log('new user');
                        // Hash Password
                        bcrypt.genSalt(10, (error, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // set Password to hashed
                            newUser.password = hash;
                            // Save user
                            console.log('new userpassword hashed');
                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');

                                })
                                .catch(err => console.log(err));
                        }));
                    }
                });
        }
    },
    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    },
    getLogout: (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    }
}