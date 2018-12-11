const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Progreso = require('../models/progreso');

describe('Progreso', function() {
  it('should be invalid if porcentaje is empty', function(done) {
    var m = new Progreso();

    m.validate(function(err) {
      expect(err.errors.porcentaje).to.exist;
      done();
    });
  });
});