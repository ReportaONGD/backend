let mongoose = require('mongoose');
let Categoria = mongoose.model('Categoria');

exports.findAll = function (req, res, next) {
  Categoria.find({ empresa: req.current_user.empresa }).lean().then(function (categorias) {
    if (!categorias) { return res.sendStatus(404); }

    return res.json(categorias);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var categoria = new Categoria(req.body);
  categoria.empresa = req.current_user.empresa;

  categoria.save().then(function () {
    return res.json(categoria);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Categoria.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (categoria) {
    if (!categoria) { return res.sendStatus(404); }

    return res.json(categoria);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Categoria.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (categoria) {
    return res.json(categoria);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Categoria.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (categoria) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.categoria')) });
  }).catch(next);
};
