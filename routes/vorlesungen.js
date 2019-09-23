const express = require('express');


module.exports = {
    getVorlesungen: (req, res) => {
        let query = "SELECT * FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
        // execute query

        sql.query(query, (err, result) => {
            if (err) {
                res.redirect('/');

            } else {
                res.render('vorlesungen.ejs', {
                    name: req.user.name,
                    email: req.user.email,
                    lectures: result,
                    layout: 'layoutDashboard',

                })
            }
        });
    },
    addVorlesungPage: (req, res) => {
        res.render('addVorlesung.ejs', {
            layout: 'layoutDashboard'
        });

    },
    addVorlesung: (req, res) => {
        let semester = req.body.semester;
        let name = req.body.name;
        let leistungspunkte = req.body.leistungspunkte;
        let errors = [];


        let usernameQuery = "SELECT * FROM userlecture WHERE email = '" + req.user.email + "' AND vorlesung = '" + name + "' AND semester = '" + semester + "'";

        sql.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                errors.push({ msg: 'Vorlesung already exists' });
                res.render('addVorlesung.ejs', {
                    layout: 'layoutDashboard',
                    errors: errors
                });
            } else {
                // send the player's details to the database
                let query = "INSERT INTO userlecture (email, vorlesung, semester, leistungspunkte) VALUES ('" +
                    req.user.email + "', '" + name + "', '" + semester + "', '" + leistungspunkte + "')";
                sql.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/vorlesungen');
                });

            }

        })
    },
    editVorlesungPage: (req, res) => {
        if (req.user.email == undefined) {
            res.redirect('/');
        }
        let semester2 = req.params.semester;
        let name2 = req.params.name.replace("%20", " ");


        let query = "SELECT * FROM userlecture WHERE semester = " + semester2 + " AND vorlesung = '" + name2 + "' AND email = '" + req.user.email + "'";

        sql.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.render('editVorlesung.ejs', {
                vorlesung: result[0],
                layout: 'layoutDashboard'
            });
        });
    },
    editVorlesung: (req, res) => {
        if (req.user.email == undefined) {
            res.redirect('/');
        }
        let semester2 = req.params.semester;
        let name2 = req.params.name.replace("%20", " ");
        let semester = req.body.semester;
        let name = req.body.name;
        let leistungspunkte = req.body.leistungspunkte;
        let errors = [];

        if (name.length == 0) {
            errors.push({ msg: 'Name nicht zulässig.' });
            res.render('addVorlesung.ejs', {
                layout: 'layoutDashboard',
                errors: errors
            });
        } else {
            let query = "UPDATE userlecture SET semester = " + semester + ", vorlesung = '" + name + "', leistungspunkte = " + leistungspunkte + " WHERE semester = " + semester2 + " AND vorlesung = '" + name2 + "' AND email = '" + req.user.email + "'";
            sql.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                let query = "UPDATE sheet SET semester = " + semester + ", lecture = '" + name + " WHERE semester = " + semester2 + " AND lecture = '" + name2 + "' AND email = '" + req.user.email + "'";
                sql.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    let query = "UPDATE exams SET semester = " + semester + ", name = '" + name + "', leistungspunkte = " + leistungspunkte + " WHERE semester = " + semester2 + " AND name = '" + name2 + "' AND username = '" + req.user.email + "'";
                    sql.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/vorlesungen');
                    });
                });
            });


        }
    },
    deleteVorlesung: (req, res) => {
        let deleteExamQuery = "DELETE FROM userlecture WHERE semester = " +
            req.params.semester + " AND vorlesung = '" +
            req.params.name.replace("%20", " ") + "' AND email = '" + req.user.email + "'";
        sql.query(deleteExamQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/vorlesungen');
        });
    }


};