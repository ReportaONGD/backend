let mongoose = require('mongoose');
let Etapa = mongoose.model('Etapa');
const utils = require('../../utils/binding');

exports.findAll = function (req, res, next) {
  let etapas = req.proyecto.etapas || [];
  return res.json(etapas);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  let proyecto = req.proyecto;
  let etapa = new Etapa(req.body);
  etapa.proyecto = proyecto.id;

  etapa.save().then(function () {
    return res.json(etapa);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Etapa.findById(req.params.id).then(function (etapa) {
    return res.json(etapa);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  Etapa.findByIdAndUpdate(req.params.id, req.body).then(function (etapa) {
    return res.json(etapa);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Etapa.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.etapa'))
    });
  }).catch(next);
};