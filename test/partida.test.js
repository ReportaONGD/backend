const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Partida = require('../models/partida');

describe('Partida', function() {
  it('should be invalid if importe is empty', function(done) {
    var m = new Partida();

    m.validate(function(err) {
      expect(err.errors.importe).to.exist;
      expect(err.errors.tipo_partida).to.not.exist;
      expect(err.errors.aecid).to.not.exist;
      done();
    });
  });
});