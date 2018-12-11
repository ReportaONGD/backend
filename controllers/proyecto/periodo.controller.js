let mongoose = require('mongoose');
let Periodo = mongoose.model('Periodo');
const utils = require('../../utils/binding');

exports.findAll = function (req, res, next) {
  let periodos = req.proyecto.periodos || [];
  return res.json(periodos);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  let proyecto = req.proyecto;
  let periodo = new Periodo(req.body);
  periodo.proyecto = proyecto.id;

  periodo.save().then(function () {
    return res.json(periodo);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Periodo.findById(req.params.id).then(function (periodo) {
    return res.json(periodo);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  Periodo.findByIdAndUpdate(req.params.id, req.body).then(function (periodo) {
    return res.json(periodo);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Periodo.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.periodo'))
    });
  }).catch(next);
};