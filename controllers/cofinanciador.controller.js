let mongoose = require('mongoose');
let Cofinanciador = mongoose.model('Cofinanciador');

exports.findAll = function (req, res, next) {
  Cofinanciador.find({ empresa: req.current_user.empresa }).lean().then(function (cofinanciadores) {
    if (!cofinanciadores) { return res.sendStatus(404); }

    return res.json(cofinanciadores);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var cofinanciador = new Cofinanciador(req.body);
  cofinanciador.empresa = req.current_user.empresa;

  cofinanciador.save().then(function () {
    return res.json(cofinanciador);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Cofinanciador.findOne({ empresa: req.current_user.empresa, _id: req.params.id })
  .then(function (cofinanciador) {
    if (!cofinanciador) { return res.sendStatus(404); }

    return res.json(cofinanciador);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Cofinanciador.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (cofinanciador) {
    return res.json(cofinanciador);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Cofinanciador.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (cofinanciador) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.cofinanciador')) });
  }).catch(next);
};
