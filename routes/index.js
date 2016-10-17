var express = require('express');
var router = express.Router();
var log = require('./logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  log.info("GET ","/ " , "called at ", new Date().toLocaleString());
  res.render('home');
});

module.exports = router;

