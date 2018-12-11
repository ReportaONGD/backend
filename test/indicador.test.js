const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Indicador = require('../models/indicador');

describe('Indicador', function() {
  it('should be invalid if codigo, descripcion, linea_base and meta is empty', function(done) {
    var m = new Indicador();

    m.validate(function(err) {
      expect(err.errors.codigo).to.exist;
      expect(err.errors.descripcion).to.exist;
      expect(err.errors.linea_base).to.exist;
      expect(err.errors.meta).to.exist;
      done();
    });
  });
});