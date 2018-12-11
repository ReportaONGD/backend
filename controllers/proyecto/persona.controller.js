let mongoose = require('mongoose');
let Persona = mongoose.model('Persona');
let Proyecto = mongoose.model('Proyecto');
const utils = require('../../utils/binding');

exports.findAll = function (req, res, next) {
    let personas = req.proyecto.personal || [];

    return res.json(personas);
};

exports.create = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }
    let proyecto = req.proyecto;
    let persona = new Persona(req.body);
    persona.proyecto = proyecto.id;

    persona.save().then(function () {
        return res.json(persona);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }
    Persona.findById(req.params.id).then(function (persona) {
        return res.json(persona);
    });
};

exports.update = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }
    Persona.findByIdAndUpdate(req.params.id, req.body).then(function (persona) {
        return res.json(persona);
    });
};

exports.delete = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    Persona.findByIdAndRemove(req.params.id).then(function () {
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.persona'))
        });
    }).catch(next);
};

