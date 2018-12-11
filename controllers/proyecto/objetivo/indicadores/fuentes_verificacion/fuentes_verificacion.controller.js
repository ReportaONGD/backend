let mongoose = require('mongoose');
let FuenteVerificacion = mongoose.model('FuenteVerificacion');

exports.findAll = function (req, res, next) {
  FuenteVerificacion.find({
    indicador: req.params.indicador_id
  }).lean().then(function (fuentes_verificacion) {
    if (!fuentes_verificacion) {
      return res.sendStatus(404);
    }

    return res.json(fuentes_verificacion);
  }).catch(next);

};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  let proyecto = req.proyecto;
  let fuente_verificacion = new FuenteVerificacion(req.body);
  fuente_verificacion.indicador = req.params.indicador_id;

  fuente_verificacion.save().then(function () {
    return res.json(fuente_verificacion);
  }).catch(next);


};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  FuenteVerificacion.findById(req.params.id).then(function (fuente_verificacion) {
    return res.json(fuente_verificacion);
  });

};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }

  FuenteVerificacion.findByIdAndUpdate(req.params.id, req.body).then(function (fuente_verificacion) {
    return res.json(fuente_verificacion);
  });
};

exports.delete = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return FuenteVerificacion.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.fuente_verificacion'))
    });
  }).catch(next);
};