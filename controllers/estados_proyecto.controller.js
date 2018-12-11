let mongoose = require('mongoose');
let EstadosProyecto = mongoose.model('EstadosProyecto');

exports.findAll = function (req, res, next) {
  EstadosProyecto.find({ empresa: req.current_user.empresa }).lean().then(function (estados_proyecto) {
    if (!estados_proyecto) { return res.sendStatus(404); }

    return res.json(estados_proyecto);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var estado_proyecto = new EstadosProyecto(req.body);
  estado_proyecto.empresa = req.current_user.empresa;

  estado_proyecto.save().then(function () {
    return res.json(estado_proyecto);
  }).catch(next);
};

exports.get = function (req, res, next) {
  EstadosProyecto.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (estado_proyecto) {
    if (!estado_proyecto) { return res.sendStatus(404); }

    return res.json(estado_proyecto);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return EstadosProyecto.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(function (estado_proyecto) {
    return res.json(estado_proyecto);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return EstadosProyecto.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (estado_proyecto) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.estado_proyecto')) });
  }).catch(next);
};
