const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Proyecto = require('../models/proyecto');

describe('Proyecto', function() {
  it('should be invalid if nombre, ' +
    'codigo,' +
    'titulo,' +
    'gestor,' +
    'ong_agrupacion,' +
    'provincia_municipio,' +
    'socio_local,' +
    'coste_total,' +
    'aportacion_financiador,' +
    'aportacion_ong' +
    ' and empresa is empty', function(done) {
    var m = new Proyecto();

    m.validate(function(err) {
      expect(err.errors.nombre).to.exist;
      expect(err.errors.codigo).to.exist;
      expect(err.errors.titulo).to.exist;
      expect(err.errors.gestor).to.exist;
      expect(err.errors.ong_agrupacion).to.exist;
      expect(err.errors.provincia_municipio).to.exist;
      expect(err.errors.socio_local).to.exist;
      expect(err.errors.coste_total).to.exist;
      expect(err.errors.aportacion_financiador).to.exist;
      expect(err.errors.aportacion_ong).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });
});