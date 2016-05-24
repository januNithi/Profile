var express = require('express');
var router = express.Router();

var personaldataManager = require('../config/DB/personaldataManager');

router.get('/', function(req, res) {
  if ((req.session.data && req.session.data.id) || (req.session.passport)) {
    res.sendfile('./public/views/layout.html', {title: 'Profile'});
  }
});

router.get('/getPersonalData', function(req, res) {
  if ((req.session.data && req.session.data.id) || (req.session.passport)) {
    if (req.session.passport) {
      req.session.data = [];

      req.session.data.id = req.session.passport.user[0].id;
    }

    personaldataManager.getPersonalData(req.session.data.id)
      .then(function(results) {
        if (results) {
          req.session.data = results[0];
          res.send(results[0]);
        }
      })
      .fail(function(err) {
        console.error(JSON.stringify(err));
      });
  } else {
    return;
  }
});

router.post('/updatePersonalData', function(req, res) {
  if (req.session.data && req.session.data.id) {
    personaldataManager.updatePersonalData(req.body)
      .then(function(results) {
        if (results) {
          res.send(results);
        }
      })
      .fail(function(err) {
        console.error(JSON.stringify(err));
      });
  } else {
    return;
  }
});

module.exports = router;
