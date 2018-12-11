let mongoose = require('mongoose');
let PlanificacionActividad = mongoose.model('PlanificacionActividad');
const utils = require('../../../../../utils/binding');
exports.findAll = function (req, res, next) {
    let proyecto = req.proyecto;
    let objetivos_especificos = proyecto.objetivos_especificos;
    let objetivo_especifico = objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let planificacion_actividad = actividad.planificacion_actividad;
    return res.json(planificacion_actividad);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.params.actividad_id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let planificacion_actividad = new PlanificacionActividad(req.body);
    actividad.planificacion_actividad = planificacion_actividad;

    proyecto.save().then(function () {
        return res.json(planificacion_actividad);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let planificacion_actividad = actividad.planificacion_actividad;
    if (!planificacion_actividad) { return res.sendStatus(404); }

    return res.json(planificacion_actividad);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) { return res.sendStatus(404); }
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let planificacion_actividad = actividad.planificacion_actividad;
    utils.bindingObject(req.body, planificacion_actividad);
    return proyecto.save().then(function () {
        return res.json(planificacion_actividad);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    actividad.planificacion_actividad = null;
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.planificacion_actividad')) });
    }).catch(next);
};

