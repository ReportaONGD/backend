let mongoose = require('mongoose');
let Pais = mongoose.model('Pais');

exports.findAll = function (req, res, next) {
  Pais.find({ empresa: req.current_user.empresa }).sort('valor').lean().then(function (paises) {
    if (!paises) { return res.sendStatus(404); }

    return res.json(paises);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var pais = new Pais(req.body);
  pais.empresa = req.current_user.empresa;

  pais.save().then(function () {
    return res.json(pais);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Pais.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (pais) {
    if (!pais) { return res.sendStatus(404); }

    return res.json(pais);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Pais.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (pais) {
    return res.json(pais);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Pais.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (pais) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.pais')) });
  }).catch(next);
};
