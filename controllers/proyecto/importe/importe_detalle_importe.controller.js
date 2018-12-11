let mongoose = require('mongoose');
let Importe = mongoose.model('Importe');
let DetalleImporte = mongoose.model('DetalleImporte');
const utils = require('../../../utils/binding');
exports.findAll = function (req, res, next) {
    let importe = req.proyecto.importe || {};
    const detalle_importe = importe.detalle_importe;
    return res.json(detalle_importe);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }

    let proyecto = req.proyecto;
    const importe = proyecto.importe;
    let detalle_importe = new DetalleImporte(req.body);
    importe.detalle_importe = detalle_importe;

    proyecto.save().then(function () {
        return res.json(detalle_importe);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    const importe = proyecto.importe;
    let detalle_importe = importe.detalle_importe;

    if (!detalle_importe) { return res.sendStatus(404); }

    return res.json(detalle_importe);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    const importe = proyecto.importe;
    let detalle_importe = importe.detalle_importe;

    if (!req.body && !detalle_importe) { return res.sendStatus(404); }
    utils.bindingObject(req.body, detalle_importe);
    proyecto.save().then(function () {
        return res.json(detalle_importe);
    }).catch(next);
};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;
    const importe = proyecto.importe;
    importe.detalle_importe = null;

    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.detalle_importe')) });
    }).catch(next);
};
