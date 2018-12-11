const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Entidad = require('../models/entidad');

describe('Entidad', function() {
  it('should be invalid if nombre and empresa is empty', function(done) {
    var m = new Entidad();

    m.validate(function(err) {
      expect(err.errors.nombre).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });
});