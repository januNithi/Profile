var express = require('express');

var router = express.Router();

var loginManager = require('../config/DB/loginManager');

router.post('/', function (req, res) {
  loginManager.getUserValidity(req.body.user, req.body.password)
    .then(function (results) {
      if (results) {
        req.session.data = results[0];
        res.send(results[0]);
      }
    })
    .fail(function (err) {
      console.error(JSON.stringify(err));
    });
});

module.exports = router;
