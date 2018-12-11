let mongoose = require('mongoose');
let Objetivo = mongoose.model('Objetivo');
const utils = require('../../../utils/binding')
exports.findAll = function (req, res, next) {
  let objetivos_especificos = req.proyecto.objetivos_especificos || [];

  return res.json(objetivos_especificos);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let objetivo = new Objetivo(req.body);
  objetivo.proyecto = proyecto.id;

  objetivo.save().then(function () {
    return res.json(objetivo);
  }).catch(next);

};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Objetivo.findById(req.params.id).then(function (objetivo) {
    return res.json(objetivo);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;

  Objetivo.findByIdAndUpdate(req.params.id, req.body).then(function (objetivo) {
    return res.json(objetivo);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Objetivo.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.objetivo'))
    });
  }).catch(next);
};