const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const server = require('../app');
const EstadosInforme = require('../models/estados_informe');

describe('EstadosInforme', function () {
  it('should be invalid if nombre is empty', function (done) {
    var m = new EstadosInforme();

    m.validate(function (err) {
      expect(err.errors.nombre).to.exist;
      expect(err.errors.estado_siguiente).to.not.exist;
      expect(err.errors.final).to.not.exist;
      done();
    });
  });

});