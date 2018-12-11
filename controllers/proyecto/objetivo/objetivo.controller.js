let mongoose = require('mongoose');
let Objetivo = mongoose.model('Objetivo');
const util = require('../../../utils/binding');

exports.findAll = function (req, res, next) {
  let objetivo = req.proyecto.objetivo  || null;
  
  return res.json(objetivo);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let objetivo = new Objetivo(req.body);
  objetivo.proyecto = proyecto.id;
  objetivo.general = true;
  
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
