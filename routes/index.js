var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (_, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/ping', function (_, res) {
  res.send('pong');
});

module.exports = router;
