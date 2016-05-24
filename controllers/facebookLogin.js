var express = require('express');

var passport = require('passport');

var configAuth = require('../config/auth');

var facebookStrategy = require('passport-facebook').Strategy;

var router = express.Router();

var personaldataManager = require('../config/DB/personaldataManager');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get('/', passport.authenticate('facebook', {scope: ['email', 'user_friends', 'manage_pages', 'user_hometown']}));

router.get('/callback',
  passport.authenticate('facebook', { successRedirect: '/profile',
  failureRedirect: '/' }));

passport.use(new facebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  function (accessToken, refreshToken, profile, done) {
    personaldataManager.updateFacebookPersonalData(null, profile, accessToken)
      .then(function (results) {
        if (results) {
          return done(null, results);
        }
      })
      .fail(function (err) {
        console.error(JSON.stringify(err));
      });
  }

));

module.exports = router;
