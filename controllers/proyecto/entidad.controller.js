let mongoose = require('mongoose');
let Entidad = mongoose.model('Entidad');
const utils = require('../../utils/binding');

exports.findAll = function (req, res, next) {
    let entidades = req.proyecto.entidades || [];

    return res.json(entidades);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.body._id || req.body._id === '') {
      req.body._id =  mongoose.Types.ObjectId();
    }
    let proyecto = req.proyecto;
    let entidad = new Entidad(req.body);

    if (!proyecto.entidades) {
        proyecto.entidades = [];
    }
        
    proyecto.entidades.push(entidad);

    proyecto.save().then(function () {
        return res.json(entidad);
    }).catch(next);
};

exports.get = function (req, res, next) {
    let proyecto = req.proyecto;
    let entidad = proyecto.entidades.id(req.params.id);

    if (!entidad) { return res.sendStatus(404); }

    return res.json(entidad);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.body) { return res.sendStatus(404); }

    let entidad = proyecto.entidades.id(req.params.id);

    utils.bindingObject(req.body, entidad);
    return proyecto.save().then(function () {
        return res.json(entidad);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    proyecto.entidades.remove(req.params.id);
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.entidad')) });
    }).catch(next);
};

