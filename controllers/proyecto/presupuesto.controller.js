let mongoose = require('mongoose');
let Presupuesto = mongoose.model('Presupuesto');
const utils = require('../../utils/binding')
exports.findAll = function (req, res, next) {
    let presupuestos = req.proyecto.presupuestos || [];

    return res.json(presupuestos);
};

exports.create = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }
    let proyecto = req.proyecto;
    let presupuesto = new Presupuesto(req.body);
    presupuesto.proyecto = proyecto.id;

    presupuesto.save().then(function () {
        return res.json(presupuesto);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    Presupuesto.findById(req.params.id).then(function (presupuesto) {
        return res.json(presupuesto);
    });
};

exports.update = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }

    Presupuesto.findByIdAndUpdate(req.params.id, req.body).then(function (presupuesto) {
        return res.json(presupuesto);
    });
};

exports.delete = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    return Presupuesto.findByIdAndRemove(req.params.id).then(function () {
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.presupuesto'))
        });
    }).catch(next);
};

