let mongoose = require('mongoose');
let TipoActividad = mongoose.model('TipoActividad');

exports.findAll = function (req, res, next) {
  TipoActividad.find({ empresa: req.current_user.empresa }).lean().then(function (tipo_actividades) {
    if (!tipo_actividades) { return res.sendStatus(404); }

    return res.json(tipo_actividades);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var tipo_actividad = new TipoActividad(req.body);
  tipo_actividad.empresa = req.current_user.empresa;

  tipo_actividad.save().then(function () {
    return res.json(tipo_actividad);
  }).catch(next);
};

exports.get = function (req, res, next) {
  TipoActividad.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_actividad) {
    if (!tipo_actividad) { return res.sendStatus(404); }

    return res.json(tipo_actividad);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return TipoActividad.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (tipo_actividad) {
    return res.json(tipo_actividad);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return TipoActividad.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_actividad) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.tipo_actividad')) });
  }).catch(next);
};
