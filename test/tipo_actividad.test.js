const chai = require('chai');
const expect = chai.expect;
const server = require('../app');

const TipoActividad = require('../models/tipo_actividad');

describe('TipoActividad', function () {
  it('should be invalid if valor and empresa is empty', function (done) {
    var m = new TipoActividad();

    m.validate(function (err) {
      expect(err.errors.valor).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });

});