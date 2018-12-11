let mongoose = require('mongoose');
let Comentario = mongoose.model('Comentario');
let Indicador = mongoose.model('Indicador');
const utils = require('../../../../../utils/binding');
exports.findAll = function (req, res, next) {
    /* let proyecto = req.proyecto;
    let objetivo = proyecto.objetivo;
    let indicador = objetivo.indicadores.filter(i => i._id == req.params.indicador_id);
    //let indicador = objetivo.indicadores.id(req.params.indicador_id);
    let comentarios = indicador[0].comentarios || [];
    return res.json(comentarios); */
    Indicador.findById(req.params.indicador_id).lean().then(function (indicador) {
        if (!indicador) {
            return res.sendStatus(404);
        }

        return res.json(indicador.comentarios);
    }).catch(next);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.params.indicador_id) { return res.sendStatus(404); }
    /* let proyecto = req.proyecto;
    let objetivo = proyecto.objetivo;
    let indicador = objetivo.indicadores.filter(i => i._id == req.params.indicador_id);
    let comentario = new Comentario(req.body);
    if (!comentario._id) {
        comentario._id = mongoose.Types.ObjectId();
    }
    if(!indicador[0].comentarios)
        indicador[0].comentarios = [];
    indicador[0].comentarios.push(comentario);

    proyecto.save().then(function () {
        return res.json(comentario);
    }).catch(next); */

    let comentario = new Comentario(req.body);
    if (!comentario._id) {
        comentario._id = mongoose.Types.ObjectId();
    }
    comentario.indicador = req.params.indicador_id;

    comentario.save().then(function () {
        return res.json(comentario);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) { return res.sendStatus(404); }
    /* let proyecto = req.proyecto;
    let objetivo = proyecto.objetivo;
    let indicador = objetivo.indicadores.filter(i => i._id == req.params.indicador_id);
    let comentario = indicador[0].comentarios.id(req.params.id);
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
    let objetivo = proyecto.objetivo;
    let indicador = objetivo.indicadores.filter(i => i._id == req.params.indicador_id);
    let comentario = indicador[0].comentarios.id(req.params.id);
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

    let objetivo = proyecto.objetivo;
    let indicador = objetivo.indicadores.filter(i => i._id == req.params.indicador_id);
    indicador[0].comentarios.remove(req.params.id);
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
