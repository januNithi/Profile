var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  req.session.destroy();
  res.sendfile('./public/views/layout.html', { title: 'Logged Out' });
});

module.exports = router;
