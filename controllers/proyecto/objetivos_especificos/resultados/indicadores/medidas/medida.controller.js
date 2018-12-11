let mongoose = require('mongoose');
let Medida = mongoose.model('Medida');
const utils = require('../../../../../../utils/binding');

exports.findAll = function (req, res, next) {
    let proyecto = req.proyecto;
    let objetivos_especificos = proyecto.objetivos_especificos;
    let objetivo_especifico = objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let indicador = resultado.indicadores.id(req.params.indicador_id);
    return res.json(indicador.medida);
};

exports.create = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    if (!req.params.resultado_id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let indicador = resultado.indicadores.id(req.params.indicador_id);
    let medida = new Medida(req.body);
    if(!indicador.medida)
        indicador.medida = [];
    indicador.medida.push(medida);
    proyecto.save().then(function () {
        return res.json(medida);
    }).catch(next);
};

exports.get = function (req, res, next) {
    if (!req.params.id) { return res.sendStatus(404); }
    let proyecto = req.proyecto;
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let indicador = resultado.indicadores.id(req.params.indicador_id);
    let medida = indicador.medida.id(req.params.id);
    if (!medida) { return res.sendStatus(404); }

    return res.json(medida);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) { return res.sendStatus(404); }
    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let indicador = resultado.indicadores.id(req.params.indicador_id);
    let medida = indicador.medida.id(req.params.id);
    utils.bindingObject(req.body, medida);
    return proyecto.save().then(function () {
        return res.json(medida);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    let proyecto = req.proyecto;

    if (!req.params.id) { return res.sendStatus(404); }

    let objetivo_especifico = proyecto.objetivos_especificos.id(req.params.objetivo_especifico_id);
    let resultado = objetivo_especifico.resultados.id(req.params.resultado_id);
    let indicador = resultado.indicadores.id(req.params.indicador_id);
    indicador.medida.remove(req.params.id);
    proyecto.save().then(function () {
        return res.json({ message: req.t('% Deleted Correctly', req.t('models.medida')) });
    }).catch(next);
};

