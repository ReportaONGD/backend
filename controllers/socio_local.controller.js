let mongoose = require('mongoose');
let Agente = mongoose.model('Agente');

exports.findAll = function (req, res, next) {
  Agente.find({ empresa: req.current_user.empresa,socio_local: true }).populate('pais').lean().then(function (socio_locales) {
    if (!socio_locales) { return res.sendStatus(404); }

    return res.json(socio_locales);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var socio_local = new Agente(req.body);
  socio_local.empresa = req.current_user.empresa;
  socio_local.socio_local = true;
  socio_local.save().then(function () {
    return res.json(socio_local);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Agente.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).populate('pais').then(function (socio_local) {
    if (!socio_local) { return res.sendStatus(404); }

    return res.json(socio_local);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Agente.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (socio_local) {
    return res.json(socio_local);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Agente.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (socio_local) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.socio_local')) });
  }).catch(next);
};
