let mongoose = require('mongoose');
let Aportacion = mongoose.model('Aportacion');
let Cofinanciador = mongoose.model('Cofinanciador');
const utils = require('../../utils/binding')
exports.findAll = function (req, res, next) {
  let aportaciones = req.proyecto.aportaciones || [];

  return res.json(aportaciones);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  let proyecto = req.proyecto
  let aportacion = new Aportacion(req.body);
  if (!aportacion._id) {
    aportacion._id =  mongoose.Types.ObjectId();
  }
  aportacion.cofinanciador = new Cofinanciador(aportacion.cofinanciador);
  if (!aportacion.cofinanciador._id) {
    aportacion.cofinanciador._id =  mongoose.Types.ObjectId();
  }
  aportacion.cofinanciador.empresa = req.current_user.empresa;
  proyecto.aportaciones.push(aportacion);

  proyecto.save().then(function () {
    return res.json(aportacion);
  }).catch(next);
};

exports.get = function (req, res, next) {
  let proyecto = req.proyecto;
  let aportacion = proyecto.aportaciones.id(req.params.id);

  if (!aportacion) {
    return res.sendStatus(404);
  }

  return res.json(aportacion);
};

exports.update = function (req, res, next) {
  let proyecto = req.proyecto;
  if (!req.body) {
    return res.sendStatus(404);
  }
  let aportacion = proyecto.aportaciones.id(req.params.id);
  utils.bindingObject(req.body, aportacion);
  return proyecto.save().then(function () {
    return res.json(aportacion);
  }).catch(next);


};

exports.delete = function (req, res, next) {
  let proyecto = req.proyecto;

  if (!req.params.id) {
    return res.sendStatus(404);
  }

  proyecto.aportaciones.remove(req.params.id);
  proyecto.save().then(function () {
    return res.json({message: req.t('% Deleted Correctly', req.t('models.aportacion'))});
  }).catch(next);
};

