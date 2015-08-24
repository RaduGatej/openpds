var express = require('express');
var router = express.Router();
var oidc = require("../oidc.js");

router.get('/home', oidc.check(), function(req, res, next) {
   res.render('home', {title: 'Welcome!', username: req.session.user});
});


module.exports = router;
