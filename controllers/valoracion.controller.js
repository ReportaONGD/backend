let mongoose = require('mongoose');
let Valoracion = mongoose.model('Valoracion');
let TipoValoracion = mongoose.model('TipoValoracion');

exports.findAll = function (req, res, next) {
  Valoracion.find().lean().exec(function (err, valoracion) {
    return res.json(valoracion);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var valoracion = new Valoracion(req.body);

  valoracion.save().then(function () {
    return res.json(valoracion);
  }).catch(next);
};

exports.get = function (req, res, next) {
  return Valoracion.findById(req.params.id).then(function (valoracion) {
    if (!valoracion) { return res.sendStatus(404); }

    return res.json(valoracion);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Valoracion.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(function (valoracion) {
    return res.json(valoracion);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  valoracion.remove(req.params.id).then(function (err, valoracion) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.valoracion')) });
  }).catch(next);
};