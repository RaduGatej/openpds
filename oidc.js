var crypto = require('crypto');
var app = require("./app.js");

var options = {
  login_url: '/login',
  consent_url: '/oauth/consent',
  scopes: {
    foo: 'Access to foo special resource',
    bar: 'Access to bar special resource'
  },
  adapters: {mongo: require("sails-mongo")},
  connections: {def: {adapter: "mongo"}},
  app: app
};

var oidc = require("openid-connect").oidc(options);

module.exports = oidc;