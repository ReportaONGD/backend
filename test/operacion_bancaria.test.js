const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const OperacionBancaria = require('../models/operacion_bancaria');

describe('OperacionBancaria', function() {
  it('should be invalid if importe_entrada, importe_salida, tasa_cambio_local, tasa_cambio_euro' +
    'financiador, moneda and tipo_movimiento is empty', function(done) {
    var m = new OperacionBancaria();

    m.validate(function(err) {
      expect(err.errors.importe_entrada).to.exist;
      expect(err.errors.importe_salida).to.exist;
      expect(err.errors.tasa_cambio_local).to.exist;
      expect(err.errors.tasa_cambio_euro).to.exist;
      expect(err.errors.financiador).to.exist;
      expect(err.errors.moneda).to.exist;
      expect(err.errors.tipo_movimiento).to.exist;
      done();
    });
  });
});