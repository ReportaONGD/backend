let mongoose = require('mongoose');
let Recurso = mongoose.model('Recurso');
const utils = require('../../../../../../utils/binding');
exports.findAll = function (req, res, next) {
    let proyecto = req.proyecto;
    let objetivos_especificos = proyecto.objetivos_especificos;
    let objetivo_especifico = objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let recursos = actividad.recurso;
    return res.json(recursos);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.params.actividad_id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let recurso = new Recurso(req.body);
    if(!actividad.recurso)
        actividad.recurso = [];
    actividad.recurso.push(recurso);

    proyecto.save().then(function () {
        return res.json(recurso);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let recurso = actividad.recurso.id(req.params.id);
    if (!recurso) { return res.sendStatus(404); }

    return res.json(recurso);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) { return res.sendStatus(404); }
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let recurso = actividad.recurso.id(req.params.id);
    utils.bindingObject(req.body, recurso);
    return proyecto.save().then(function () {
        return res.json(recurso);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    actividad.recurso.remove(req.params.id);
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.recurso')) });
    }).catch(next);
};

