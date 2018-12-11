let mongoose = require('mongoose');
let Objetivo = mongoose.model('Objetivo');
let Indicador = mongoose.model('Indicador');
let Progreso = mongoose.model('Progreso');
const utils = require('../../../../utils/binding');
exports.findAll = function (req, res, next) {
    let objetivos_especificos = req.proyecto.objetivos_especificos || [];
    let objetivo_especifico = objetivos_especificos.id(req.params.objetivo_especifico_id);
    let indicador = objetivo_especifico.indicadores.id(req.params.indicador_id);
    let progreso = indicador.progreso;
    return res.json(progreso);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.params.indicador_id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let indicador = objetivo_especifico.indicadores.id(req.params.indicador_id);
    let progreso = new Progreso(req.body);
    indicador.progreso = progreso;

    proyecto.save().then(function () {
        return res.json(progreso);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let indicador = objetivo_especifico.indicadores.id(req.params.indicador_id);
    let progreso = indicador.progreso;
    if (!progreso) { return res.sendStatus(404); }

    return res.json(progreso);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) { return res.sendStatus(404); }
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let indicador = objetivo_especifico.indicadores.id(req.params.indicador_id);
    let progreso = indicador.progreso;
    utils.bindingObject(req.body, progreso);
    return proyecto.save().then(function () {
        return res.json(progreso);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let indicador = objetivo_especifico.indicadores.id(req.params.indicador_id);
    indicador.progreso = null;
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.progreso')) });
    }).catch(next);
};

