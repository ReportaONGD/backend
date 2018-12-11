let mongoose = require('mongoose');
let CuentaBancaria = mongoose.model('CuentaBancaria');
let Proyecto = mongoose.model('Proyecto');
const utils = require('../../../utils/binding')
exports.findAll = function (req, res, next) {
  // CuentaBancaria.find({ proyecto:  req.proyecto.id }).lean().then(function (cuentas_bancarias) {
  //   if (!cuentas_bancarias) { return res.sendStatus(404); }

  //   return res.json(cuentas_bancarias);
  // }).catch(next);
  let cuentas_bancarias = req.proyecto.cuentas_bancarias || [];
  return res.json(cuentas_bancarias);
};

exports.create = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  let proyecto = req.proyecto;
  //Es importante que no venga este campo por que sino 
  //No lo creara con el valor por defecto
  // delete req.body.operaciones_bancarias;
  let cuenta_bancaria = new CuentaBancaria(req.body);
  cuenta_bancaria.proyecto = proyecto.id;

  cuenta_bancaria.save().then(function () {
    return res.json(cuenta_bancaria);
  }).catch(next);
};

exports.get = function (req, res, next) {
  if (!req.params.id) {
    return res.sendStatus(404);
  }

  CuentaBancaria.findById(req.params.id).then(function (cuenta_bancaria) {
    return res.json(cuenta_bancaria);
  });
};

exports.update = function (req, res, next) {
  if (!req.body) {
    return res.sendStatus(404);
  }
  
  let proyecto = req.proyecto;

  CuentaBancaria.findByIdAndUpdate(req.params.id,req.body).then(function (cuenta_bancaria) {
    return res.json(cuenta_bancaria);
  });

  // let cuenta_bancaria = proyecto.cuentas_bancarias.id();
  // utils.bindingObject(req.body, cuenta_bancaria);
  // return proyecto.save().then(function () {

  //   Proyecto.findById(proyecto._id)
  //     .populate('cuentas_bancarias')
  //     .populate('cuentas_bancarias.pais')
  //     .populate('cuentas_bancarias.moneda')
  //     .populate('cuentas_bancarias.localizacion').then(function (p) {
  //       let cb = p.cuentas_bancarias.id(cuenta_bancaria._id);
  //       return res.json(cb);
  //     });
  // }).catch(next);


};

exports.delete = function (req, res, next) {
  let proyecto = req.proyecto;

  if (!req.params.id) {
    return res.sendStatus(404);
  }

  return CuentaBancaria.findByIdAndRemove(req.params.id).then(function () {
    return res.json({
      message: req.t('% Deleted Correctly', req.t('models.cuenta_bancaria'))
    });
  }).catch(next);

};