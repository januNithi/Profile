var express = require('express');

var personaldataManager = require('../config/DB/personaldataManager');

var router = express.Router();

router.get('/', function (req, res) {
  if (req.session.data || req.session.passport) {
    res.sendfile('./public/views/layout.html', { title: 'Profile' });
  }
});

router.get('/getUserDetails', function (req, res) {
  if (req.session.data) {
    personaldataManager.getUserDetails('user')
      .then(function (results) {
        if (results) {
          req.session.userDetails = results;
          res.send(results);
        }
      })
      .fail(function (err) {
        console.error(JSON.stringify(err));
      });
  } else {
    return;
  }
});

module.exports = router;
