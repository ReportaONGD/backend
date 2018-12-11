const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const DetalleImporte = require('../models/detalle_importe');

describe('DetalleImporte', function() {
  it('should be invalid if ongd is empty', function(done) {
    var m = new DetalleImporte();

    m.validate(function(err) {
      expect(err.errors.ongd).to.exist;
      done();
    });
  });
});