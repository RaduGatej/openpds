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
  var return_url = req.session.return_url;
  req.session.return_url = null;
  res.redirect(return_url || "/users/home");
};

var loginError = function (err, req, res, next) {
  req.flash('error', err.message);
  res.redirect(req.path);
};

router.post('/login', oidc.login(validateUser), afterLogin, loginError);

router.get('/login', function (req, res, next) {
  req.session.return_url = req.query.return_url;
  res.render('index', {title: 'Login'});
});

var afterLogout = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

router.all('/logout', oidc.removetokens(), afterLogout);



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Login'});
});

router.get('/register', function (req, res, next) {
  res.render('register', {title: 'Register'});
});

router.post('/register', oidc.use({policies: {loggedIn: false}, models: 'user'}), function (req, res, next) {
  delete req.session.error;
  req.model.user.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      req.session.error = err.message;
    } else if (user) {
      req.session.error = 'User already exists.';
    }
    if (req.session.error) {
      req.flash('error', req.session.error);
      res.redirect(req.path);
    } else {
      req.body.name = req.body.given_name + " " + req.body.family_name;
      req.model.user.create(req.body, function (err, user) {
        if (err || !user) {
          req.session.error = err ? err.message : 'User could not be created.';
          req.flash('error', req.session.error);
          res.redirect(req.path);
        } else {
          req.session.user = user.id;
          res.redirect('/users/home');
        }
      });
    }
  });
});
module.exports = router;
