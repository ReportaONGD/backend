const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const Cofinanciador = require('../models/cofinanciador');

describe('Cofinanciador', function() {
  it('should be invalid if valor and empresa is empty', function(done) {
    var m = new Cofinanciador();

    m.validate(function(err) {
      expect(err.errors.valor).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });
});