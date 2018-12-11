let mongoose = require('mongoose');
let TipoMovimiento = mongoose.model('TipoMovimiento');

exports.findAll = function (req, res, next) {
  TipoMovimiento.find({ empresa: req.current_user.empresa }).lean().then(function (tipo_movimientos) {
    if (!tipo_movimientos) { return res.sendStatus(404); }

    return res.json(tipo_movimientos);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var tipo_movimiento = new TipoMovimiento(req.body);
  tipo_movimiento.empresa = req.current_user.empresa;

  tipo_movimiento.save().then(function () {
    return res.json(tipo_movimiento);
  }).catch(next);
};

exports.get = function (req, res, next) {
  TipoMovimiento.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_movimiento) {
    if (!tipo_movimiento) { return res.sendStatus(404); }

    return res.json(tipo_movimiento);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return TipoMovimiento.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (tipo_movimiento) {
    return res.json(tipo_movimiento);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return TipoMovimiento.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (tipo_movimiento) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.tipo_movimiento')) });
  }).catch(next);
};
