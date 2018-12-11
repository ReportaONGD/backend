let mongoose = require('mongoose');
let Medida = mongoose.model('Medida');
let Indicador = mongoose.model('Indicador');


exports.findAll = function (req, res, next) {
  Indicador.findById(req.params.indicador_id).lean().then(function (indicador) {
    if (!indicador) {
      return res.sendStatus(404);
    }

    return res.json(indicador.medida);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body || !req.params.indicador_id) {
    return res.sendStatus(404);
  }

  let medida = new Medida(req.body);
  medida.indicador = req.params.indicador_id;
  
  medida.save().then(function () {
    return res.json(medida);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Medida.findById(req.params.id).lean().then(function (medida) {
    if (!medida) {
      return res.sendStatus(404);
    }

    return res.json(medida);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  Medida.findByIdAndUpdate(req.params.id, req.body).then(function (medida) {
    return res.json(medida);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Medida.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.medida'))
    });
  }).catch(next);
};