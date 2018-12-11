let mongoose = require('mongoose');
let Agente = mongoose.model('Agente');

exports.findAll = function (req, res, next) {
  Agente.find({ empresa: req.current_user.empresa,financiador: true }).populate('pais').lean().then(function (financiadores) {
    if (!financiadores) { return res.sendStatus(404); }

    return res.json(financiadores);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var financiador = new Agente(req.body);
  financiador.empresa = req.current_user.empresa;
  financiador.financiador = true;
  financiador.save().then(function () {
    return res.json(financiador);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Agente.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).populate('pais').then(function (financiador) {
    if (!financiador) { return res.sendStatus(404); }

    return res.json(financiador);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Agente.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (financiador) {
    return res.json(financiador);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Agente.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (financiador) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.financiador')) });
  }).catch(next);
};
