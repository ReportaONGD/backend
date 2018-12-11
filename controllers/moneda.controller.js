let mongoose = require('mongoose');
let Moneda = mongoose.model('Moneda');

exports.findAll = function (req, res, next) {
  Moneda.find({ empresa: req.current_user.empresa }).sort('valor').lean().then(function (monedas) {
    if (!monedas) { return res.sendStatus(404); }

    return res.json(monedas);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var moneda = new Moneda(req.body);
  moneda.empresa = req.current_user.empresa;

  moneda.save().then(function () {
    return res.json(moneda);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Moneda.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (moneda) {
    if (!moneda) { return res.sendStatus(404); }

    return res.json(moneda);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Moneda.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (moneda) {
    return res.json(moneda);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Moneda.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (moneda) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.moneda')) });
  }).catch(next);
};