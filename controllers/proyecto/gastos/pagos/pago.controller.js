let mongoose = require('mongoose');
let Pago = mongoose.model('Pago');
const utils = require('../../../../utils/binding');

exports.findAll = function (req, res, next) {
    Pago.find({
        gasto: req.params.gasto_id
    }).lean().then(function (gastos) {
        if (!gastos) {
            return res.sendStatus(404);
        }
        return res.json(gastos);
    }).catch(next);

};

exports.create = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }

    let proyecto = req.proyecto;
    let pago = new Pago(req.body);
    pago.gasto = req.params.gasto_id;

    pago.save().then(function () {
        return res.json(pago);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    Pago.findById(req.params.id).then(function (pago) {
        return res.json(pago);
    });
};

exports.update = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }

    Pago.findByIdAndUpdate(req.params.id, req.body).then(function (pago) {
        return res.json(pago);
    });
};

exports.delete = function (req, res, next) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    return Pago.findByIdAndRemove(req.params.id).then(function () {
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.pago'))
        });
    }).catch(next);
};