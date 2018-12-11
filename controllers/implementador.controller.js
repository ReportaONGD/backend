let mongoose = require('mongoose');
let Agente = mongoose.model('Agente');

exports.findAll = function (req, res, next) {
  Agente.find({ empresa: req.current_user.empresa,implementador: true }).populate('pais').lean().then(function (implementadores) {
    if (!implementadores) { return res.sendStatus(404); }

    return res.json(implementadores);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var implementador = new Agente(req.body);
  implementador.empresa = req.current_user.empresa;
  implementador.implementador = true;
  implementador.save().then(function () {
    return res.json(implementador);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Agente.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).populate('pais').then(function (implementador) {
    if (!implementador) { return res.sendStatus(404); }

    return res.json(implementador);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Agente.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (implementador) {
    return res.json(implementador);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Agente.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (implementador) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.implementador')) });
  }).catch(next);
};
