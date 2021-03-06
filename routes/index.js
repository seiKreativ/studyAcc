const express = require('express');
const router = express.Router();



module.exports = {
    getDashboard: (req, res) => {
        let query = "SELECT * FROM exams WHERE username = '" + req.user.email + "'"; // query database to get all the players
        // execute query

        sql.query(query, (err, exams) => {
            if (err) {
                res.redirect('/');

            } else {
                query = "SELECT * FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                // execute query

                sql.query(query, (err, lectures) => {
                    if (err) {
                        res.redirect('/');

                    } else {
                        query = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "'"; // query database to get all the players
                        // execute query

                        sql.query(query, (err, sheets) => {
                            if (err) {
                                res.redirect('/');

                            } else {
                                res.render('dashboard.ejs', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    exams: exams,
                                    lectures: lectures,
                                    sheets: sheets,
                                    layout: 'layoutDashboard',

                                });
                            }
                        });
                    }
                });
            }
        });
    },
    getWelcome: (req, res) => {
        res.render('welcome.ejs');
    },
    getProfile: (req, res) => {
        res.render('profile.ejs', {
            name: req.user.name,
            email: req.user.email,
            layout: 'layoutDashboard',

        });
    },
    editProfile: (req, res) => {
        res.render('profile.ejs', {
            name: req.user.name,
            email: req.user.email,
            layout: 'layoutDashboard',

        });
    },
};