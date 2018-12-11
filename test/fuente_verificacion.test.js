const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const FuenteVerificacion = require('../models/fuente_verificacion');

describe('FuenteVerificacion', function() {
  it('should be invalid if codigo and descripcion is empty', function(done) {
    var m = new FuenteVerificacion();

    m.validate(function(err) {
      expect(err.errors.codigo).to.exist;
      expect(err.errors.descripcion).to.exist;
      done();
    });
  });
});