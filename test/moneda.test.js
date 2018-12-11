const chai = require('chai');
const expect = chai.expect;
const server = require('../app');

const Moneda = require('../models/moneda');

describe('Moneda', function () {
  it('should be invalid if codigo and descripcion is empty', function (done) {
    var m = new Moneda();

    m.validate(function (err) {
      expect(err.errors.codigo).to.exist;
      expect(err.errors.descripcion).to.exist;
      done();
    });
  });

});