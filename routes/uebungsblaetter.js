const express = require('express');




module.exports = {
    getUebungsblaetter: (req, res) => {
        let query = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "'"; // query database to get all the players
        if (req.params.name != undefined) {
            var name = req.params.name.replace("%20", " ");
            query = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "' AND lecture = '" + name + "'";
            if (req.params.semester != 0) {
                query = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "' AND semester = " + req.params.semester + " AND lecture = '" + name + "'";
            }
        } else if (req.params.semester != 0) {
            query = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "' AND semester = " + req.params.semester;
        }
        if (req.params.semester == undefined) {
            query = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "'";
        }
        // execute query

        sql.query(query, (err, sheets) => {
            if (err) {
                res.redirect('/');

            } else {
                let query = "SELECT DISTINCT lecture FROM usersheet WHERE email = '" + req.user.email + "'"; // query database to get all the players
                // execute query

                sql.query(query, (err, lectures) => {
                    if (err) {
                        res.redirect('/');

                    } else {

                        let query2 = "SELECT DISTINCT semester FROM usersheet WHERE email = '" + req.user.email + "'"; // query database to get all the players
                        // execute query

                        sql.query(query2, (err, semester) => {
                            if (err) {
                                res.redirect('/');

                            } else {


                                res.render('uebungsblaetter.ejs', {
                                    name: req.user.name,
                                    email: req.user.email,
                                    sheets: sheets,
                                    semester: semester,
                                    lectures: lectures,
                                    layout: 'layoutDashboard',
                                })
                            }
                        });

                    }
                });

            }
        });
    },
    addUebungsblattPage: (req, res) => {
        let query = "SELECT DISTINCT vorlesung FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
        // execute query

        sql.query(query, (err, result) => {
            if (err) {
                res.redirect('/');

            } else {

                let query2 = "SELECT DISTINCT semester FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                // execute query

                sql.query(query2, (err, result2) => {
                    if (err) {
                        res.redirect('/');

                    } else {


                        res.render('addUebungsblatt.ejs', {
                            name: req.user.name,
                            email: req.user.email,
                            semester: result2,
                            lectures: result,
                            layout: 'layoutDashboard',
                        })
                    }
                });

            }
        });


    },
    addUebungsblatt: (req, res) => {
        let semester = req.body.semester;
        let vorlesung = req.body.vorlesung;
        let punkte = req.body.punkte;
        let punkteIns = req.body.punkteIns;
        let nummer = req.body.nummer;
        let errors = [];

        let query = "SELECT DISTINCT vorlesung FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
        // execute query
        let usernameQuery = "SELECT * FROM usersheet WHERE email = '" + req.user.email + "' AND lecture = '" + vorlesung + "' AND semester = '" + semester + "' AND number = '" + nummer + "'";

        function loadNew() {
            let query = "SELECT DISTINCT vorlesung FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
            // execute query

            sql.query(query, (err, result) => {
                if (err) {
                    res.redirect('/');

                } else {

                    let query2 = "SELECT DISTINCT semester FROM userlecture WHERE email = '" + req.user.email + "'"; // query database to get all the players
                    // execute query

                    sql.query(query2, (err, result2) => {
                        if (err) {
                            res.redirect('/');

                        } else {


                            res.render('addUebungsblatt.ejs', {
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

        }
        sql.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                errors.push({ msg: 'Noch keine Vorlesung hinzugefügt.' });
                loadNew();
            } else {
                if (!punkte.match([0 - 9][0 - 9])) {
                    errors.push({ msg: 'Erreichte Punkte muss eine ganze Zahl sein.' });
                    loadNew();
                } else if (!punkteIns.match([0 - 9][0 - 9])) {
                    errors.push({ msg: 'Erreichbare Punkte muss eine ganze Zahl sein.' });
                    loadNew();
                } else if (parseInt(punkte) > parseInt(punkte)) {
                    errors.push({ msg: 'Erreichte Punkte können max. so hoch sein wie die erreichbare Punktezahl' });
                    loadNew();
                } else {
                    let query = "INSERT INTO usersheet (email, lecture, number, points, maxPoints, semester) VALUES ('" +
                        req.user.email + "', '" + vorlesung + "', " + nummer + ", " + punkte + ", " + punkteIns + ", " + semester + ")";
                    sql.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/uebungsblaetter');
                    });

                }
            }

        })

    },
    editUebungsblattPage: (req, res) => {
        let semester2 = req.params.semester;
        let name2 = req.params.name.replace("%20", " ");
        let number2 = req.params.number;


        let query = "SELECT * FROM usersheet WHERE semester = " + semester2 + " AND number = " + number2 + " AND lecture = '" + name2 + "' AND email = '" + req.user.email + "'";

        sql.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.render('editUebungsblatt.ejs', {
                sheet: result[0],
                layout: 'layoutDashboard'
            });
        });
    },
    editUebungsblatt: (req, res) => {
        let semester2 = req.params.semester;
        let name2 = req.params.name.replace("%20", " ");
        let number2 = req.params.number;
        let semester = req.body.semester;
        let vorlesung = req.body.vorlesung;
        let punkte = req.body.punkte;
        let punkteIns = req.body.punkteIns;
        let nummer = req.body.nummer;
        let errors = [];

        function loadNew() {
            let query = "SELECT * FROM usersheet WHERE semester = " + semester2 + " AND number = " + number2 + " AND lecture = '" + name2 + "' AND email = '" + req.user.email + "'";

            sql.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.render('editUebungsblatt.ejs', {
                    sheet: result[0],
                    errors: errors,
                    layout: 'layoutDashboard'
                });
            });
        }


        if (!punkte.match([0 - 9][0 - 9])) {
            errors.push({ msg: 'Erreichte Punkte muss eine ganze Zahl sein.' });
            loadNew();
        } else if (!punkteIns.match([0 - 9][0 - 9])) {
            errors.push({ msg: 'Erreichbare Punkte muss eine ganze Zahl sein.' });
            loadNew();
        } else if (parseInt(punkte) > parseInt(punkte)) {
            errors.push({ msg: 'Erreichte Punkte können max. so hoch sein wie die erreichbare Punktezahl-' });
            loadNew();
        } else {

            let query = "UPDATE usersheet SET semester = '" + semester + "', lecture = '" + vorlesung + "', number = '" + nummer + "', points = '" + punkte + "', maxPoints = '" + punkteIns + "' WHERE semester = '" + semester2 + "' AND number = '" + number2 + "' AND lecture = '" + name2 + "' AND email = '" + req.user.email + "'";
            sql.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/uebungsblaetter');
            });
        }


    },
    deleteUebungsblatt: (req, res) => {
        let deleteExamQuery = "DELETE FROM usersheet WHERE semester = '" +
            req.params.semester.replace("%20", " ") + "' AND number = '" +
            req.params.number + "' AND lecture = '" +
            req.params.name + "' AND email = '" + req.user.email + "'";
        sql.query(deleteExamQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/uebungsblaetter');
        });
    },
    showUebungsblaetter: (req, res) => {
        var semester = req.body.semester;
        if (req.body.semester == undefined) {
            semester = 0;
        }
        var name = req.body.name;
        res.redirect('/uebungsblaetter/' + semester + "/" + name);
    }
};