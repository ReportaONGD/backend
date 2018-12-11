const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Documento = require('../models/documento');

describe('Documento', function() {
  it('should be invalid if hash1, nombre and ruta is empty', function(done) {
    var m = new Documento();

    m.validate(function(err) {
      expect(err.errors.hash1).to.exist;
      // expect(err.errors.hash2).to.exist;
      expect(err.errors.nombre).to.exist;
      expect(err.errors.ruta).to.exist;
      // expect(err.errors.fecha).to.exist;
      done();
    });
  });
});