const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Gasto = require('../models/gasto');

describe('Gasto', function() {
  it('should be invalid if numero_orden, emisor, concepto, importe_local and moneda is empty', function(done) {
    var m = new Gasto();

    m.validate(function(err) {
      expect(err.errors.numero_orden).to.exist;
      expect(err.errors.emisor).to.exist;
      expect(err.errors.concepto).to.exist;
      expect(err.errors.importe_local).to.exist;
      expect(err.errors.importe_local).to.exist;
      done();
    });
  });
});