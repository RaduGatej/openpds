var request = require('supertest')
  , express = require('express')
  , chai = require("chai");


request = request("http://localhost:3000");

describe('POST /login', function() {
  it("should login succesfully", function(done) {
    request
      .post("/login")
      .field("inputEmail", "test@test.com")
      .field("inputPassword", "blabla")
      .expect(302, done);
  })

});