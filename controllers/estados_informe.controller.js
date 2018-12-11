let mongoose = require('mongoose');
let EstadosInforme = mongoose.model('EstadosInforme');

exports.findAll = function (req, res, next) {
  EstadosInforme.find({ empresa: req.current_user.empresa }).lean().then(function (estados_informes) {
    if (!estados_informes) { return res.sendStatus(404); }

    return res.json(estados_informes);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var estados_informe = new EstadosInforme(req.body);
  estados_informe.empresa = req.current_user.empresa;

  estados_informe.save().then(function () {
    return res.json(estados_informe);
  }).catch(next);
};

exports.get = function (req, res, next) {
  EstadosInforme.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (estados_informe) {
    if (!estados_informe) { return res.sendStatus(404); }

    return res.json(estados_informe);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return EstadosInforme.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (estados_informe) {
    return res.json(estados_informe);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return EstadosInforme.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (estados_informe) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.estados_informe')) });
  }).catch(next);
};
