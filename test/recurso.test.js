const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Recurso = require('../models/recurso');

describe('Recurso', function() {
  it('should be invalid if descripcion and coste is empty', function(done) {
    var m = new Recurso();

    m.validate(function(err) {
      expect(err.errors.descripcion).to.exist;
      expect(err.errors.coste).to.exist;
      done();
    });
  });
});