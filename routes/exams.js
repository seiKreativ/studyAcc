const fs = require('fs');



module.exports = {
    addExamPage: (req, res) => {
        let errors = [];
        let query = "SELECT DISTINCT vorlesung FROM exams.userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
        // execute query

        sql.query(query, (err, result) => {
            if (err) {
                res.redirect('/');

            } else {

                let query2 = "SELECT DISTINCT semester FROM exams.userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                // execute query

                sql.query(query2, (err, result2) => {
                    if (err) {
                        res.redirect('/');

                    } else {


                        res.render('addExam.ejs', {
                            name: req.user.name,
                            email: req.user.email,
                            semester: result2,
                            lectures: result,
                            errors: errors,
                            layout: 'layoutDashboard',
                        })
                    }
                });

            }
        });
    },
    addExam: (req, res) => {
        let semester = req.body.semester;
        let vorlesung = req.body.vorlesung;
        let lp;
        let note = req.body.note;
        let errors = [];

        let leistungspunkteQuery = "SELECT leistungspunkte FROM userlecture WHERE email = '" + req.user.email + "' AND vorlesung = '" + vorlesung + "' AND semester = " + semester;
        sql.query(leistungspunkteQuery, (err, result) => {
            if (err || !(result.length > 0)) {
                errors.push({ msg: 'Es existiert keine Vorlesung mit diesem Namen in diesem Semester' });
                let query = "SELECT DISTINCT vorlesung FROM exams.userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                // execute query

                sql.query(query, (err, result) => {
                    if (err) {
                        res.redirect('/');

                    } else {

                        let query2 = "SELECT DISTINCT semester FROM exams.userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                        // execute query

                        sql.query(query2, (err, result2) => {
                            if (err) {
                                res.redirect('/');

                            } else {
                                res.render('addExam.ejs', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    semester: result2,
                                    lectures: result,
                                    errors: errors,
                                    layout: 'layoutDashboard',
                                })
                            }
                        });

                    }
                });
            } else {
                lp = result[0].leistungspunkte;
                let usernameQuery = "SELECT * FROM exams WHERE username = '" + req.user.email + "' AND name = '" + vorlesung + "' AND semester = '" + semester + "'";

                sql.query(usernameQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (result.length > 0) {
                        errors.push({ msg: 'Exam already exists' });
                        let query = "SELECT DISTINCT vorlesung FROM exams.userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                        // execute query

                        sql.query(query, (err, result) => {
                            if (err) {
                                res.redirect('/');

                            } else {

                                let query2 = "SELECT DISTINCT semester FROM exams.userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                                // execute query

                                sql.query(query2, (err, result2) => {
                                    if (err) {
                                        res.redirect('/');

                                    } else {


                                        res.render('addExam.ejs', {
                                            name: req.user.name,
                                            email: req.user.email,
                                            semester: result2,
                                            lectures: result,
                                            errors: errors,
                                            layout: 'layoutDashboard',
                                        })
                                    }
                                });

                            }
                        });
                    } else {
                        // send the player's details to the database
                        let query = "INSERT INTO exams.exams (semester, name, leistungspunkte, note, username) VALUES ('" +
                            semester + "', '" + vorlesung + "', '" + lp + "', '" + note + "', '" + req.user.email + "')";
                        sql.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/dashboard');
                        });

                    }

                })
            }
        });
    },
    editExamPage: (req, res) => {
        if (req.user.email == undefined) {
            res.redirect('/');
        }
        let semester2 = req.params.semester;
        let name2 = req.params.name.replace("%20", " ");


        let query = "SELECT * FROM exams.exams WHERE semester = " + semester2 + " AND name = '" + name2 + "' AND username = '" + req.user.email + "'";

        sql.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.render('editExam.ejs', {
                title: 'Edit Exam',
                exam: result[0],
                message: '',
                layout: 'layoutDashboard'
            });
        });
    },
    editExam: (req, res) => {
        if (req.user.email == undefined) {
            res.redirect('/');
        }
        let semester2 = req.params.semester;
        let name2 = req.params.name.replace("%20", " ");
        let semester = req.body.semester;
        let name = req.body.name;
        let note = req.body.note;
        let errors = [];


        let query = "UPDATE exams.exams SET note = '" + note + "' WHERE exams.semester = '" + semester2 + "' AND exams.name = '" + name2 + "' AND exams.username = '" + req.user.email + "'";
        sql.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/dashboard');
        });

    },
    deleteExam: (req, res) => {
        let deleteExamQuery = "DELETE FROM exams WHERE exams.semester = '" +
            req.params.semester + "' AND exams.name = '" +
            req.params.name.replace("%20", " ") + "' AND exams.username = '" + req.user.email + "'";
        sql.query(deleteExamQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/dashboard');
        });
    },
    getExams: (req, res) => {
        let query = "SELECT * FROM exams.exams WHERE username = '" + req.user.email + "'"; // query database to get all the players
        // execute query

        sql.query(query, (err, result) => {
            if (err) {
                res.redirect('/');

            } else {
                res.render('exams.ejs', {
                    name: req.user.name,
                    email: req.user.email,
                    exams: result,
                    layout: 'layoutDashboard',

                })
            }
        });

    }
};