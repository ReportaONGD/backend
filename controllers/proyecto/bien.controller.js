let mongoose = require('mongoose');
let Bien = mongoose.model('Bien');
let Proyecto = mongoose.model('Proyecto');
const utils = require('../../utils/binding')
exports.findAll = function (req, res, next) {
    let bienes = req.proyecto.bienes || [];

    return res.json(bienes);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    let proyecto = req.proyecto
    let bien = new Bien(req.body);
    proyecto.bienes.push(bien);

    proyecto.save().then(function () {
        return res.json(bien);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let bien = proyecto.bienes.id(req.params.id);

    if (!bien) { return res.sendStatus(404); }

    return res.json(bien);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) { return res.sendStatus(404); }
    let bien = proyecto.bienes.id(req.params.id);
    utils.bindingObject(req.body, bien);
    return proyecto.save().then(function () {
        return res.json(bien);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    proyecto.bienes.remove(req.params.id);
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.bien')) });
    }).catch(next);
};

