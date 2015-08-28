var express = require('express');
var router = express.Router();
var oidc = require("../oidc.js");

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

module.exports = router;