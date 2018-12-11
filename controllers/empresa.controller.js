let mongoose = require('mongoose');
let Empresa = mongoose.model('Empresa');

exports.findAll = function (req, res, next) {
  Empresa.find().lean().exec(function (err, empresas) {
    return res.json(empresas);
  }).catch(next);
};

exports.create = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  var empresa = new Empresa(req.body);

  empresa.save().then(function () {
    return res.json(empresa);
  }).catch(next);
};

exports.get = function (req, res, next) {
  Empresa.findById(req.params.id).then(function (empresa) {
    if (!empresa) { return res.sendStatus(404); }
    
    return res.json(empresa);
  }).catch(next);
};

exports.update = function (req, res, next) {
  if (!req.body) { return res.sendStatus(404); }

  Empresa.findByIdAndUpdate(req.params.id, req.body,{new: true}).then(function (empresa) {
    return res.json(empresa);
  }).catch(next);
};

exports.delete = function (req, res, next) {
  Empresa.remove(req.params.id).then(function (err, empresa) {
    return res.json({ message: req.t('% Deleted Correctly', req.t('models.empresa')) });
  }).catch(next);
};
