const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Persona = require('../models/persona');

describe('Persona', function() {
  it('should be invalid if nombre, and residencia is empty', function(done) {
    var m = new Persona();

    m.validate(function(err) {
      expect(err.errors.nombre).to.exist;
      expect(err.errors.categoria).to.not.exist;
      expect(err.errors.tipo_personal).to.not.exist;
      expect(err.errors.residencia).to.exist;
      expect(err.errors.contrato).to.not.exist;
      expect(err.errors.horas_imputadas).to.not.exist;
      expect(err.errors.salario_mensual).to.not.exist;
      expect(err.errors.meses).to.not.exist;
      expect(err.errors.salario_total).to.not.exist;
      done();
    });
  });
});