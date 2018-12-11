let mongoose = require('mongoose');
let Localizacion = mongoose.model('Localizacion');

exports.findAll = function (req, res, next) {
  Localizacion.find({ empresa: req.current_user.empresa }).lean().then(function (localizaciones) {
    if (!localizaciones) { return res.sendStatus(404); }

    return res.json(localizaciones);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var localizacion = new Localizacion(req.body);
  localizacion.empresa = req.current_user.empresa;

  localizacion.save().then(function () {
    return res.json(localizacion);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Localizacion.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (localizacion) {
    if (!localizacion) { return res.sendStatus(404); }

    return res.json(localizacion);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Localizacion.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (localizacion) {
    return res.json(localizacion);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Localizacion.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (localizacion) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.localizacion')) });
  }).catch(next);
};
