const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Objetivo = require('../models/objetivos');

describe('Objetivo', function() {
  it('should be invalid if codigo is empty', function(done) {
    var m = new Objetivo();

    m.validate(function(err) {
      expect(err.errors.codigo).to.exist;
      done();
    });
  });
});