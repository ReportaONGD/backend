const chai = require('chai');
const expect = chai.expect;
const server = require('../app');

const TipoMovimiento = require('../models/tipo_movimiento');

describe('TipoMovimiento', function () {
  it('should be invalid if valor and empresa is empty', function (done) {
    var m = new TipoMovimiento();

    m.validate(function (err) {
      expect(err.errors.valor).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });

});