let mongoose = require('mongoose');
let Actividad = mongoose.model('Actividad');
let Recurso = mongoose.model('Recurso');
const utils = require('../../../../utils/binding');
exports.findAll = function (req, res, next) {
    let actividad_global = req.proyecto.actividad_global || {};
    let recursos = actividad_global.recurso;
    return res.json(recursos);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }

    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    let recurso = new Recurso(req.body);
    if(!actividad_global.recurso)
        actividad_global.recurso = [];
    actividad_global.recurso.push(recurso);
    proyecto.save().then(function () {
        return res.json(recurso);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    let recurso = actividad_global.recurso.id(req.params.id);
    if (!recurso) { return res.sendStatus(404); }

    return res.json(recurso);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    let recurso = actividad_global.recurso.id(req.params.id);
    if (!req.body && !recurso) { return res.sendStatus(404); }

    utils.bindingObject(req.body, recurso);

    proyecto.save().then(function () {
        return res.json(recurso);
    }).catch(next);
};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;
    actividad_global.recurso.remove(req.params.id);

    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.recurso')) });
    }).catch(next);
};
