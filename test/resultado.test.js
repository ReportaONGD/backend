const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Resultado = require('../models/resultado');

describe('Resultado', function() {
  it('should be invalid if descripcion and codigo is empty', function(done) {
    var m = new Resultado();

    m.validate(function(err) {
      expect(err.errors.descripcion).to.exist;
      expect(err.errors.codigo).to.exist;
      done();
    });
  });
});