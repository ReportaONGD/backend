let mongoose = require('mongoose');
let TipoPersonal = mongoose.model('TipoPersonal');

exports.findAll = function (req, res, next) {
  TipoPersonal.find({ empresa: req.current_user.empresa }).lean().then(function (tipo_personales) {
    if (!tipo_personales) { return res.sendStatus(404); }

    return res.json(tipo_personales);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var tipo_personal = new TipoPersonal(req.body);
  tipo_personal.empresa = req.current_user.empresa;

  tipo_personal.save().then(function () {
    return res.json(tipo_personal);
  }).catch(next);
};

exports.get = function (req, res, next) {
  TipoPersonal.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_personal) {
    if (!tipo_personal) { return res.sendStatus(404); }

    return res.json(tipo_personal);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return TipoPersonal.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (tipo_personal) {
    return res.json(tipo_personal);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return TipoPersonal.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_personal) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.tipo_personal')) });
  }).catch(next);
};
