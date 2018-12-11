const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Actividad = require('../models/actividad');

describe('Actividad', function() {
  it('should be invalid if descripcion and codigo is empty', function(done) {
    var m = new Actividad();

    m.validate(function(err) {
      expect(err.errors.descripcion).to.exist;
      expect(err.errors.codigo).to.exist;
      done();
    });
  });
});