let mongoose = require('mongoose');
let Gasto = mongoose.model('Gasto');
let Proyecto = mongoose.model('Proyecto');
const utils = require('../../../utils/binding')
exports.findAll = function (req, res, next) {
  let gastos = req.proyecto.gastos || [];

  return res.json(gastos);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  
  let proyecto = req.proyecto;
  let gasto = new Gasto(req.body);
  gasto.proyecto = proyecto.id;

  gasto.save().then(function () {
    return res.json(gasto);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }
  Gasto.findById(req.params.id).then(function (gasto) {
    return res.json(gasto);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  Gasto.findByIdAndUpdate(req.params.id,req.body).then(function (gasto) {
    return res.json(gasto);
  });

};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Gasto.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.gasto'))
    });
  }).catch(next);
};