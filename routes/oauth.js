var express = require('express');
var router = express.Router();
var oidc = require("../oidc.js");
var crypto = require("crypto");

//authorization endpoint
router.get('/authorize', oidc.auth());

//token endpoint
router.post('/token', oidc.token());

//TODO: move this somewhere else
router.get('/userInfo', oidc.userInfo());

//user consent form
router.get('/consent', oidc.use("client"), function (req, res, next) {
  req.model.client.findOne({key: req.session.client_key}, function (err, client) {
    if (err) {
      req.session.error = err.message;
    } else if (!client) {
      req.session.error = "No client found"
    }
    if (req.session.error) {
      req.flash("error", req.session.error);
      res.redirect(req.baseUrl + req.path);
    }
    else {
      res.render("consent", {title: "Consent", scopes: req.session.scopes, client_name: client.name});
    }
  });
});

router.post('/consent', oidc.consent());

//client register form
router.get('/register_client', oidc.use("user"), function(req, res, next) {
  console.log(req.session.user);
  var key = crypto.createHash('md5').update(req.session.user+'-'+Math.random()).digest('hex');
  var secret = crypto.createHash('md5').update(key+req.session.user+Math.random()).digest('hex');
  res.render("register_client", {title: "Register new client", client_key: key, client_secret: secret});
});

router.post('/register_client', oidc.use('client'), function(req, res, next) {
  delete req.session.error;
  req.body.user = req.session.user;
  req.body.redirect_uris = req.body.redirect.split(/[, ]+/);
  req.model.client.create(req.body, function(err, client){
    if(!err && client) {
      res.redirect('/users/client/'+client.id);
    } else {
      req.flash("error", err.message);
      res.redirect(req.baseUrl + req.path);
    }
  });
});

module.exports = router;