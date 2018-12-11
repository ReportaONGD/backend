let mongoose = require('mongoose');
let Agente = mongoose.model('Agente');

exports.findAll = function (req, res, next) {
  Agente.find({ empresa: req.current_user.empresa }).populate('pais').lean().then(function (agentes) {
    if (!agentes) { return res.sendStatus(404); }

    return res.json(agentes);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var agente = new Agente(req.body);
  agente.empresa = req.current_user.empresa;
  agente.save().then(function () {
    return res.json(agente);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Agente.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).populate('pais').then(function (agente) {
    if (!agente) { return res.sendStatus(404); }

    return res.json(agente);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Agente.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (agente) {
    return res.json(agente);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Agente.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (agente) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.agente')) });
  }).catch(next);
};
