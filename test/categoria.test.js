const chai = require('chai');
const server = require('../app');
const expect = chai.expect;

const Categoria = require('../models/categoria');

describe('Categoria', function () {
  it('should be invalid if valor and empresa is empty', function (done) {
    var m = new Categoria();

    m.validate(function (err) {
      expect(err.errors.valor).to.exist;
      expect(err.errors.empresa).to.exist;
      done();
    });
  });
}); 