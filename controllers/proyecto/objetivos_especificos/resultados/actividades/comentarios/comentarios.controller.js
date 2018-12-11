let mongoose = require('mongoose');
let Comentario = mongoose.model('Comentario');
let Actividad = mongoose.model('Actividad');
const utils = require('../../../../../../utils/binding');
exports.findAll = function (req, res, next) {
    /* let proyecto = req.proyecto;
    let objetivos_especificos = proyecto.objetivos_especificos;
    let objetivo_especifico = objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let comentarios = actividad.comentarios || [];
    return res.json(comentarios); */
    Actividad.findById(req.params.actividad_id).lean().then(function (Actividad) {
        if (!Actividad) {
            return res.sendStatus(404);
        }

        return res.json(Actividad.comentarios);
    }).catch(next);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.params.resultado_id) { return res.sendStatus(404); }
    /* let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let comentario = new Comentario(req.body);
    if (!comentario._id) {
        comentario._id = mongoose.Types.ObjectId();
    }
    if(!actividad.comentarios)
        actividad.comentarios = [];
    actividad.comentarios.push(comentario);

    proyecto.save().then(function () {
        return res.json(comentario);
    }).catch(next); */
    let comentario = new Comentario(req.body);
    if (!comentario._id) {
        comentario._id = mongoose.Types.ObjectId();
    }
    comentario.actividad = req.params.actividad_id;

    comentario.save().then(function () {
        return res.json(comentario);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) { return res.sendStatus(404); }
    /* let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let comentario = actividad.comentarios.id(req.params.id);
    if (!comentario) { return res.sendStatus(404); }

    return res.json(comentario); */
    Comentario.findById(req.params.id).lean().then(function (comentario) {
        if (!comentario) {
            return res.sendStatus(404);
        }

        return res.json(comentario);
    }).catch(next);
};

exports.update = function (req, res, next) {
    /* let proyecto = req.proyecto;
    if (!req.body) { return res.sendStatus(404); }
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    let comentario = actividad.comentarios.id(req.params.id);
    utils.bindingObject(req.body, comentario);
    // setDates(comentario);
    return proyecto.save().then(function () {
        return res.json(comentario);
    }).catch(next); */
    if (!req.body) {
        return res.sendStatus(404);
    }

    Comentario.findByIdAndUpdate(req.params.id, req.body).then(function (comentario) {
        return res.json(comentario);
    });


};

exports.delete = function (req, res, next) {
    /* let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let actividad = resultado.actividades.id(req.params.actividad_id);
    actividad.comentarios.remove(req.params.id);
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.comentarios')) });
    }).catch(next); */
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    return Comentario.findByIdAndRemove(req.params.id).then(function () {
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.comentario'))
        });
    }).catch(next);
};
