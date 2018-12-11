const chai = require('chai');
const server = require('../app');
const expect = chai.expect;

const Aportacion = require('../models/aportacion');

describe('Aportacion', function () {
  it('should be invalid if cuantia is empty', function (done) {
    var m = new Aportacion();

    m.validate(function (err) {
      expect(err.errors.cuantia).to.exist;
      expect(err.errors.entidad).to.not.exist;
      expect(err.errors.publica).to.not.exist;
      expect(err.errors.privada).to.not.exist;
      done();
    });
  });
});