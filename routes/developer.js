var express = require('express');
var router = express.Router();
var oidc = require("../oidc.js");
var crypto = require("crypto");

router.get('/', oidc.use("client"), function(req, res, next) {
  req.model.client.find({user: req.session.user}, function(err, clients){
    res.render('developer', {title: "Developer", clients: clients})
  });

});

router.get('/apps/app/:id', oidc.use('client'), function(req, res, next) {
  console.log(req.params.id);
  req.model.client.findOne({user: req.session.user, id: req.params.id}, function (err, client) {
    if (err) {
      next(err);
    } else if (client) {
      res.render("client", {title: "Client", client: client});
    }
  });
});

//client registration form
router.get('/apps/register', oidc.use('user'), function(req, res, next) {
  console.log(req.session.user);
  var key = crypto.createHash('md5').update(req.session.user+'-'+Math.random()).digest('hex');
  var secret = crypto.createHash('md5').update(key+req.session.user+Math.random()).digest('hex');
  res.render("register_client", {title: "Register new client", client_key: key, client_secret: secret});
});

router.post('/apps/register', oidc.use('client'), function(req, res, next) {
  delete req.session.error;
  req.body.user = req.session.user;
  req.body.redirect_uris = req.body.redirect.split(/[, ]+/);
  req.model.client.create(req.body, function(err, client){
    if(!err && client) {
      res.redirect('/developer/apps/app/'+client.id);
    } else {
      req.flash("error", err.message);
      res.redirect(req.baseUrl + req.path);
    }
  });
});

module.exports = router;
