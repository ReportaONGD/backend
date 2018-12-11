let mongoose = require('mongoose');
let Rol = mongoose.model('Rol');

exports.findAll = function (req, res, next) {
  Rol.find({ empresa: req.current_user.empresa }).lean().then(function (roles) {
    if (!roles) { return res.sendStatus(404); }

    return res.json(roles);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var rol = new Rol(req.body);
  rol.empresa = req.current_user.empresa;

  rol.save().then(function () {
    return res.json(rol);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Rol.findOne({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (rol) {
    if (!rol) { return res.sendStatus(404); }

    return res.json(rol);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  return Rol.findOneAndUpdate({ empresa: req.current_user.empresa, _id: req.params.id }, req.body, { new: true }).then(function (rol) {
    return res.json(rol);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  return Rol.findOneAndRemove({ empresa: req.current_user.empresa, _id: req.params.id }).then(function (rol) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.rol')) });
  }).catch(next);
};
