const chai = require('chai');
const expect = chai.expect;
const server = require('../app');

const Pais = require('../models/pais');

describe('Pais', function () {
  it('should be invalid if valor is empty', function (done) {
    var m = new Pais();

    m.validate(function (err) {
      expect(err.errors.valor).to.exist;
      done();
    });
  });

});