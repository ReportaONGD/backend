const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Usuario = require('../models/user');

describe('Usuario', function() {
  it('should be invalid if username and email is empty', function(done) {
    var m = new Usuario();

    m.validate(function(err) {
      expect(err.errors.username).to.exist;
      expect(err.errors.email).to.exist;
      done();
    });
  });
});