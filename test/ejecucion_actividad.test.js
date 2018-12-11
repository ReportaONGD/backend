const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const EjecucionActividad = require('../models/ejecucion_actividad');

describe('EjecucionActividad', function() {
  it('should be invalid if mes_inicio, anio_inicio, mes_fin, anio_fin, fecha_inicio and fecha_fin is empty', function(done) {
    var m = new EjecucionActividad();

    m.validate(function(err) {
      expect(err.errors.mes_inicio).to.exist;
      expect(err.errors.anio_inicio).to.exist;
      expect(err.errors.mes_fin).to.exist;
      expect(err.errors.anio_fin).to.exist;
      expect(err.errors.fecha_inicio).to.exist;
      expect(err.errors.fecha_fin).to.exist;
      done();
    });
  });
});