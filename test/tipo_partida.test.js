const chai = require('chai');
const expect = chai.expect;
const server = require('../app');

const TipoPartida = require('../models/tipo_partida');

describe('TipoPartida', function () {
  it('should be invalid if nombre, codigo and empresa is empty', function (done) {
    var m = new TipoPartida();

    m.validate(function (err) {
      expect(err.errors.nombre).to.exist;
      expect(err.errors.codigo).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });

});