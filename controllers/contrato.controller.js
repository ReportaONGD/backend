let mongoose = require('mongoose');
let Contrato = mongoose.model('Contrato');

exports.findAll = function (req, res, next) {
  Contrato.find({ empresa: req.current_user.empresa }).lean().then(function (contratos) {
    if (!contratos) { return res.sendStatus(404); }

    return res.json(contratos);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var contrato = new Contrato(req.body);
  contrato.empresa = req.current_user.empresa;

  contrato.save().then(function () {
    return res.json(contrato);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Contrato.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (contrato) {
    if (!contrato) { return res.sendStatus(404); }

    return res.json(contrato);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Contrato.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (contrato) {
    return res.json(contrato);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Contrato.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (contrato) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.contrato')) });
  }).catch(next);
};
