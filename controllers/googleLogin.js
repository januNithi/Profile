var express = require('express');

var passport = require('passport');

var configAuth = require('../config/auth');

var router = express.Router();

var googleStrategy = require('passport-google-oauth2').Strategy;

var personaldataManager = require('../config/DB/personaldataManager');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get('/', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

router.get('/callback',
  passport.authenticate('google', { successRedirect: '/profile',
  failureRedirect: '/' }));

passport.use(new googleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
},
  function (accessToken, refreshToken, profile, done) {
    personaldataManager.updateGooglePersonalData(null, profile, accessToken)
      .then(function (results) {
        if (results) {
          return done(null, results);
        } else {
          return done(null);
        }
      })
      .fail(function (err) {
        console.error(JSON.stringify(err));
        return done(null);
      });
  }

));

module.exports = router;
