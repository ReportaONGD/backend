let mongoose = require('mongoose');
let TipoPeriodo = mongoose.model('TipoPeriodo');

exports.findAll = function (req, res, next) {
  TipoPeriodo.find({ empresa: req.current_user.empresa }).lean().then(function (tipo_periodos) {
    if (!tipo_periodos) { return res.sendStatus(404); }

    return res.json(tipo_periodos);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var tipo_periodo = new TipoPeriodo(req.body);
  tipo_periodo.empresa = req.current_user.empresa;

  tipo_periodo.save().then(function () {
    return res.json(tipo_periodo);
  }).catch(next);
};

exports.get = function (req, res, next) {
  TipoPeriodo.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_periodo) {
    if (!tipo_periodo) { return res.sendStatus(404); }

    return res.json(tipo_periodo);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return TipoPeriodo.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (tipo_periodo) {
    return res.json(tipo_periodo);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return TipoPeriodo.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_periodo) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.tipo_periodo')) });
  }).catch(next);
};
