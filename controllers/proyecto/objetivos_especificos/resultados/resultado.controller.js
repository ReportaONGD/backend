let mongoose = require('mongoose');
let Resultado = mongoose.model('Resultado');

exports.findAll = function (req, res, next) {
  Resultado.find({
    objetivo: req.params.objetivo_especifico_id
  }).lean().then(function (resultados) {
    if (!resultados) {
      return res.sendStatus(404);
    }

    return res.json(resultados);
  }).catch(next);

};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let resultado = new Resultado(req.body);
  resultado.objetivo = req.params.objetivo_especifico_id;

  resultado.save().then(function () {
    return res.json(resultado);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Resultado.findById(req.params.id).then(function (resultado) {
    return res.json(resultado);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  Resultado.findByIdAndUpdate(req.params.id, req.body).then(function (resultado) {
    return res.json(resultado);
  });


};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Resultado.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.resultado'))
    });
  }).catch(next);
};