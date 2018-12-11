let mongoose = require('mongoose');
let TipoValoracion = mongoose.model('TipoValoracion');

exports.findAll = function (req, res, next) {
  TipoValoracion.find({ empresa: req.current_user.empresa }).lean().then(function (tipo_valoraciones) {
    if (!tipo_valoraciones) { return res.sendStatus(404); }

    return res.json(tipo_valoraciones);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var tipo_valoracion = new TipoValoracion(req.body);
  tipo_valoracion.empresa = req.current_user.empresa;

  tipo_valoracion.save().then(function () {
    return res.json(tipo_valoracion);
  }).catch(next);
};

exports.get = function (req, res, next) {
  TipoValoracion.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_valoracion) {
    if (!tipo_valoracion) { return res.sendStatus(404); }

    return res.json(tipo_valoracion);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return TipoValoracion.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (tipo_valoracion) {
    return res.json(tipo_valoracion);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return TipoValoracion.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_valoracion) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.tipo_valoracion')) });
  }).catch(next);
};
