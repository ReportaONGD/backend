const chai = require('chai');
const server = require('../app');
const expect = chai.expect;

const Bien = require('../models/bien');

describe('Bien', function () {
  it('should be invalid if proveedor, cantidad and importe is empty', function (done) {
    var m = new Bien();

    m.validate(function (err) {
      expect(err.errors.proveedor).to.exist;
      expect(err.errors.cantidad).to.exist;
      expect(err.errors.importe).to.exist;
      expect(err.errors.fecha).to.not.exist;
      expect(err.errors.descripcion).to.not.exist;
      done();
    });
  });
});