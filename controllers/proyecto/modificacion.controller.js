let mongoose = require('mongoose');
let Modificacion = mongoose.model('Modificacion');
const utils = require('../../utils/binding');

exports.findAll = function (req, res, next) {
    let modificaciones = req.proyecto.modificaciones || [];
    return res.json(modificaciones);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); } 
    let proyecto = req.proyecto;
    let modificacion = new Modificacion(req.body);
    modificacion.proyecto = proyecto.id;

    modificacion.save().then(function () {
        return res.json(modificacion);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    Modificacion.findById(req.params.id).then(function (modificacion) {
        return res.json(modificacion);
    });
};

exports.update = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }

    Modificacion.findByIdAndUpdate(req.params.id, req.body).then(function (modificacion) {
        return res.json(modificacion);
    });
};

exports.delete = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    return Modificacion.findByIdAndRemove(req.params.id).then(function () {
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.modificacion'))
        });
    }).catch(next);
};