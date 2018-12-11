const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const CuentaBancaria = require('../models/cuenta_bancaria');

describe('CuentaBancaria', function() {
  it('should be invalid if pais, entidad, ncuenta, moneda and localizacion is empty', function(done) {
    var m = new CuentaBancaria();

    m.validate(function(err) {
      expect(err.errors.pais).to.exist;
      expect(err.errors.entidad).to.exist;
      expect(err.errors.ncuenta).to.exist;
      expect(err.errors.moneda).to.exist;
      expect(err.errors.localizacion).to.exist;
      done();
    });
  });
});