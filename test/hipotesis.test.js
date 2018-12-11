const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Hipotesis = require('../models/hipotesis');

describe('Hipotesis', function() {
  it('should be invalid if descripcion is empty', function(done) {
    var m = new Hipotesis();

    m.validate(function(err) {
      expect(err.errors.descripcion).to.exist;
      done();
    });
  });
});