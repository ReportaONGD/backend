let mongoose = require('mongoose');
let Partida = mongoose.model('Partida');
const utils = require('../../utils/binding');

exports.findAll = function (req, res, next) {
    let partida = req.proyecto.partida || [];

    return res.json(partida);
};

exports.create = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }
    let proyecto = req.proyecto;
    let partida = new Partida(req.body);
    partida.proyecto = proyecto.id;

    partida.save().then(function () {
        return res.json(partida);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    Partida.findById(req.params.id).then(function (partida) {
        return res.json(partida);
    });
};

exports.update = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }

    Partida.findByIdAndUpdate(req.params.id, req.body).then(function (partida) {
        return res.json(partida);
    });
};

exports.delete = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    return Partida.findByIdAndRemove(req.params.id).then(function () {
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.partida'))
        });
    }).catch(next);
};
