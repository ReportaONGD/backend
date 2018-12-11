const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Importe = require('../models/importe');

describe('Importe', function() {
  it('should be invalid if subvencion and rendimiento is empty', function(done) {
    var m = new Importe();

    m.validate(function(err) {
      expect(err.errors.subvencion).to.exist;
      expect(err.errors.rendimiento).to.exist;
      done();
    });
  });
});