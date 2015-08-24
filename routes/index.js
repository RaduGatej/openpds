var express = require('express');
var router = express.Router();
var oidc = require("../oidc.js");

var validateUser = function (req, next) {
  delete req.session.error;
  req.model.user.findOne({email: req.body.inputEmail}, function (err, user) {
    if (!err && user && user.samePassword(req.body.inputPassword)) {
      return next(null, user);
    } else {
      var error = new Error('Username or password incorrect.');
      return next(error);
    }
  });
};

var afterLogin = function (req, res, next) {
  res.redirect(req.param('return_url') || '/users/home');
};

var loginError = function (err, req, res, next) {
  req.flash('error', err.message);
  res.redirect(req.path);
};

router.post('/login', oidc.login(validateUser), afterLogin, loginError);

var afterLogout = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

router.all('/logout', oidc.removetokens(), afterLogout);

router.get('/login', function (req, res, next) {
  res.render('index', {title: 'Login'});
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Login'});
});

module.exports = router;
