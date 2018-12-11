var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('Usuario');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function (email, password, done) {
  User.findOne({ email: email }).then(function (user) {
    if (!user || !user.validPassword(password)) {
      return done(null, false, { errors: { 'email_or_password': 'is invalid' } });
    } else if (!user.activo) {
      return done(null, false, { errors: { 'user': 'blocked' } });
    }

    return done(null, user);
  }).catch(done);
}));

