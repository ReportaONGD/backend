let mongoose = require('mongoose');
let Actividad = mongoose.model('Actividad');
let Proyecto = mongoose.model('Proyecto');
let Etapa = mongoose.model('Etapa');
let Resultado = mongoose.model('Resultado');
const utils = require('../../../utils/binding');
exports.findAll = function (req, res, next) {
    let actividad_global = req.proyecto.actividad_global || null;

    return res.json(actividad_global);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }

    let proyecto = req.proyecto;
    let actividad_global = new Actividad(req.body);
    if (!actividad_global._id) {
        actividad_global._id = mongoose.Types.ObjectId();
    }
    if(!actividad_global.etapa)
        actividad_global.etapa = new Etapa(null);
    if (!actividad_global.resultado)
        actividad_global.resultado = new Resultado(null);

    proyecto.actividad_global = actividad_global;

    proyecto.save().then(function () {
        return res.json(actividad_global);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;

    if (!actividad_global) { return res.sendStatus(404); }

    return res.json(actividad_global);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    let actividad_global = proyecto.actividad_global;

    if (!req.body && !actividad_global) { return res.sendStatus(404); }

    utils.bindingObject(req.body, actividad_global);

    proyecto.save().then(function () {
        return res.json(actividad_global);
    }).catch(next);
};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    proyecto.actividad_global = null;

    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.actividad_global')) });
    }).catch(next);
};
