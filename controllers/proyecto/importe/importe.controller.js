let mongoose = require('mongoose');
let Importe = mongoose.model('Importe');
let Proyecto = mongoose.model('Proyecto');
const utils = require('../../../utils/binding');
exports.findAll = function (req, res, next) {
    let importe = req.proyecto.importe || {};

    return res.json(importe);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }

    let proyecto = req.proyecto;
    let importe = new Importe(req.body);
    proyecto.importe = importe;

    proyecto.save().then(function () {
        return res.json(importe);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let importe = proyecto.importe;

    if (!importe) { return res.sendStatus(404); }

    return res.json(importe);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    let importe = proyecto.importe;

    if (!req.body && !importe) { return res.sendStatus(404); }

    utils.bindingObject(req.body, importe);

    proyecto.save().then(function () {
        return res.json(importe);
    }).catch(next);
};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    proyecto.importe = null;

    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.importe')) });
    }).catch(next);
};
