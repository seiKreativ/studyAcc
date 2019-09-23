const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User').Users;
const bcrypt = require('bcryptjs');

//Load User Model 
//const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //match User
            User.findOne({
                    where: {
                        email: email
                    }
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {

                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
                .catch(err => console.log(err));

        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    // passport.deserializeUser((email, done) => {
    //     User.findByPk(email, function(err, user) {
    //         done(err, user);
    //     });
    // });

    passport.deserializeUser(function(email, done) {

        User.findByPk(email).then((users) => {
            return done(null, users);
        });
    })

}