let mongoose = require('mongoose');
let Indicador = mongoose.model('Indicador');

exports.findAll = function (req, res, next) {
  Indicador.find({
    objetivo: req.params.objetivo_id
  }).lean().then(function (indicadores) {
    if (!indicadores) {
      return res.sendStatus(404);
    }

    return res.json(indicadores);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let indicador = new Indicador(req.body);
  indicador.objetivo = req.params.objetivo_id;

  indicador.save().then(function () {
    return res.json(indicador);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  Indicador.findById(req.params.id).then(function (indicador) {
    return res.json(indicador);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  Indicador.findByIdAndUpdate(req.params.id, req.body).then(function (indicador) {
    return res.json(indicador);
  });


};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return Indicador.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.indicador'))
    });
  }).catch(next);
};