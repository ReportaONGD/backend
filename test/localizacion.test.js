const chai = require('chai');
const expect = chai.expect;
const server = require('../app');

const Localizacion = require('../models/localizacion');

describe('Localizacion', function () {
  it('should be invalid if valor and empresa is empty', function (done) {
    var m = new Localizacion();

    m.validate(function (err) {
      expect(err.errors.valor).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });

});