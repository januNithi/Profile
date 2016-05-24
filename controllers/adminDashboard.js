var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  if (req.session.data || req.session.passport) {
    res.sendfile('./public/views/layout.html', { title: 'Dashboard' });
  }
});

module.exports = router;
