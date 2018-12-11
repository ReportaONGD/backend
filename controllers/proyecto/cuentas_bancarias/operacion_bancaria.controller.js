let mongoose = require('mongoose');
let OperacionBancaria = mongoose.model('OperacionBancaria');
const utils = require('../../../utils/binding')

exports.findAll = function (req, res, next) {
 
  let operaciones_bancarias = req.proyecto.operaciones_bancarias || [];
  return res.json(operaciones_bancarias);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let operacion_bancaria = new OperacionBancaria(req.body);

  operacion_bancaria.proyecto = proyecto.id;

  operacion_bancaria.save().then(function () {
    return res.json(operacion_bancaria);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  OperacionBancaria.findById(req.params.id).then(function (operacion_bancaria) {
    return res.json(operacion_bancaria);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  OperacionBancaria.findByIdAndUpdate(req.params.id, req.body).then(function (operacion_bancaria) {
    return res.json(operacion_bancaria);
  });
};

exports.delete = function (req, res, next) {

  let proyecto = req.proyecto;

  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return OperacionBancaria.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.operacion_bancaria'))
    });
  }).catch(next);
};