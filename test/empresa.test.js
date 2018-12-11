const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Empresa = require('../models/empresa');

describe('Empresa', function () {
  it('should be invalid if nombre, cif, direccion_fiscal and tfno is empty', function (done) {
    var m = new Empresa();

    m.validate(function (err) {
      expect(err.errors.nombre).to.exist;
      expect(err.errors.cif).to.exist;
      expect(err.errors.direccion_fiscal).to.exist;
      expect(err.errors.tfno).to.exist;
      done();
    });
  });
});