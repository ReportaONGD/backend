const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Modificacion = require('../models/modificacion');

describe('Modificacion', function() {
  it('should be invalid if descripcion and fecha is empty', function(done) {
    var m = new Modificacion();

    m.validate(function(err) {
      expect(err.errors.descripcion).to.exist;
      expect(err.errors.fecha).to.exist;
      done();
    });
  });
});