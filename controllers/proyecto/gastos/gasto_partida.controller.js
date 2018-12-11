let mongoose = require('mongoose');
let Gasto = mongoose.model('Gasto');
let Partida = mongoose.model('Partida');
const utils = require('../../../utils/binding')
exports.findAll = function (req, res, next) {
    const proyecto = req.proyecto;
    const gasto = proyecto.gastos.id(req.params.gasto_id);
    const partida = gasto.partida;
    return res.json(partida);
};

exports.create = function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(404);
    }
    let proyecto = req.proyecto;
    const gasto = proyecto.gastos.id(req.params.gasto_id);
    let partida = new Partida(req.body);
    gasto.partida = partida;

    proyecto.save().then(function () {
        return res.json(partida);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let gasto = proyecto.gastos.id(req.params.gasto_id);
    let partida = gasto.partida;
    if (!partida) {
        return res.sendStatus(404);
    }

    return res.json(partida);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) {
        return res.sendStatus(404);
    }
    let gasto = proyecto.gastos.id(req.params.gasto_id);
    let partida = gasto.partida;
    utils.bindingObject(req.body, partida);
    return proyecto.save().then(function () {
        return res.json(partida);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) {
        return res.sendStatus(404);
    }
    let gasto = proyecto.gastos.id(req.params.gasto_id);
    gasto.partida = null;
    proyecto.save().then(function () {
        return res.json({message: req.t('% Deleted Correctly', req.t('models.partida'))});
    }).catch(next);
};

