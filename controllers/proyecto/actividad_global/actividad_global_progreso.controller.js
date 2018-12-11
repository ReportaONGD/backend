let mongoose = require('mongoose');
let Actividad = mongoose.model('Actividad');
let Progreso = mongoose.model('Progreso');
const utils = require('../../../utils/binding');
exports.findAll = function (req, res, next) {
    let actividad_global = req.proyecto.actividad_global || {};
    let progreso = actividad_global.progreso;
    return res.json(progreso);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }

    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    let progreso = new Progreso(req.body);
    actividad_global.progreso = progreso;
    proyecto.save().then(function () {
        return res.json(progreso);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    let progreso = actividad_global.progreso;
    if (!progreso) { return res.sendStatus(404); }

    return res.json(progreso);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    let progreso = actividad_global.progreso;
    if (!req.body && !progreso) { return res.sendStatus(404); }

    utils.bindingObject(req.body, progreso);

    proyecto.save().then(function () {
        return res.json(progreso);
    }).catch(next);
};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    actividad_global.progreso = null;

    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.progreso')) });
    }).catch(next);
};
