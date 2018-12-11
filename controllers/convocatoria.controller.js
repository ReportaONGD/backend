let mongoose = require('mongoose');
let Convocatoria = mongoose.model('Convocatoria');

exports.findAll = function (req, res, next) {
  Convocatoria.find({ empresa: req.current_user.empresa }).lean().then(function (convocatorias) {
    if (!convocatorias) { return res.sendStatus(404); }

    return res.json(convocatorias);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var convocatoria = new Convocatoria(req.body);
  convocatoria.empresa = req.current_user.empresa;

  convocatoria.save().then(function () {
    return res.json(convocatoria);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Convocatoria.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (convocatoria) {
    if (!convocatoria) { return res.sendStatus(404); }

    return res.json(convocatoria);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Convocatoria.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (convocatoria) {
    return res.json(convocatoria);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Convocatoria.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (convocatoria) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.convocatoria')) });
  }).catch(next);
};
