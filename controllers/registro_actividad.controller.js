let mongoose = require('mongoose');
let RegistroActividad = mongoose.model('RegistroActividad');

exports.findAll = function (req, res, next) {
  RegistroActividad.find().lean().exec(function (err, registro_actividad) {
    return res.json(registro_actividad);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
  
  var registro_actividad = new RegistroActividad(req.body);
  
  registro_actividad.save().then(function () {
    return res.json(registro_actividad);
  }).catch(next);
};

exports.get = function (req, res, next) {
  return RegistroActividad.findById(req.params.id).then(function (registro_actividad) {
    if (!registro_actividad) { return res.sendStatus(404); }

    return res.json(registro_actividad);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }
 
  return RegistroActividad.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(function (registro_actividad) {
    return res.json(registro_actividad);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  RegistroActividad.remove(req.params.id).then(function (err, registro_actividad) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.registro_actividad')) });
  }).catch(next);
};
