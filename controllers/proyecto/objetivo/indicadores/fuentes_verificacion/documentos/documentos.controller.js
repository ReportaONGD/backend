let mongoose = require('mongoose');
let FuenteVerificacion = mongoose.model('FuenteVerificacion');
var fs = require('fs');
let Documento = mongoose.model('Documento');
const utils = require('../../../../../../utils/binding');
exports.findAll = function (req, res, next) {
    const proyecto = req.proyecto;
    const objetivo = proyecto.objetivo;
    const indicador = objetivo.indicadores.id(req.params.indicador_id);
    const fuente_verificacion = indicador.fuente_verificacion.id(req.params.fuente_verificacion_id);
    const documentos = fuente_verificacion.documentos;
    return res.json(documentos);
};
exports.post_file = function (req, res, next) {
    const ruta = './uploads/' + req.current_user.empresa.nombre + '/' + req.proyecto.nombre + '/fuentes_verificacion';
    if (!req.body) {
        return res.sendStatus(404);
    }
    const proyecto = req.proyecto;
    const objetivo = proyecto.objetivo;
    const indicador = objetivo.indicadores.id(req.params.indicador_id);
    const fuente_verificacion = indicador.fuente_verificacion.id(req.params.fuente_verificacion_id);
    let documento = new Documento(JSON.parse(req.body.data));
    if (!documento._id) {
        documento._id = mongoose.Types.ObjectId();
    }
    documento.ruta = ruta;
    if(!fuente_verificacion.documentos)
        fuente_verificacion.documentos = [];
    fuente_verificacion.documentos.push(documento);

    proyecto.save().then(function () {
        return res.json(documento);
    }).catch(next);
};
exports.create = function (req, res, next) {
    const ruta = './uploads/' + req.current_user.empresa.nombre + '/' + req.proyecto.nombre + '/fuentes_verificacion';
    if (!req.body) {
        return res.sendStatus(404);
    }
    const proyecto = req.proyecto;
    const objetivo = proyecto.objetivo;
    const indicador = objetivo.indicadores.id(req.params.indicador_id);
    const fuente_verificacion = indicador.fuente_verificacion.id(req.params.fuente_verificacion_id);
    let documento = new Documento(JSON.parse(req.body.data));
    if (!documento._id) {
        documento._id = mongoose.Types.ObjectId();
    }
    documento.ruta = ruta;
    if(!fuente_verificacion.documentos)
        fuente_verificacion.documentos = [];
    fuente_verificacion.documentos.push(documento);

    proyecto.save().then(function () {
        return res.json(documento);
    }).catch(next);
};

exports.get = function (req, res, next) {
    const proyecto = req.proyecto;
    const objetivo = proyecto.objetivo;
    const indicador = objetivo.indicadores.id(req.params.indicador_id);
   
    if (!req.params.id) {
        return res.sendStatus(404);
    }
    const fuente_verificacion = indicador.fuente_verificacion.id(req.params.fuente_verificacion_id);
    const doc =  fuente_verificacion.documentos.id(req.params.id);
    return res.json(doc);
};
exports.download = function (req, res, next) {
    if (!req.body) { return res.sendStatus(404); }
    const doc = new Documento(req.body);
    const ruta = doc.ruta + '/' + doc.nombre;
    //const ruta = 'C:\\Projects\\AECID-BACKEND\\uploads\\Demo\\Proyecto 1\\fuentes_verificacion\\' + doc.nombre;
    const file = fs.createReadStream(ruta);
    
    if(fs.existsSync(ruta)) {
      console.log('Existe');
    }
    var stat = fs.statSync(ruta);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + doc.nombre);
    file.pipe(res);
};
exports.update = function (req, res, next) {
    const proyecto = req.proyecto;
    const objetivo = proyecto.objetivo;
    const indicador = objetivo.indicadores.id(req.params.indicador_id);
    const fuente_verificacion = indicador.fuente_verificacion.id(req.params.fuente_verificacion_id);
    if (!req.body) {
        return res.sendStatus(404);
    }
    let documento = fuente_verificacion.documentos.id(req.params.id);
    utils.bindingObject(req.body, documento);
    return proyecto.save().then(function () {
        return res.json(documento);
    }).catch(next);


};

exports.delete = function (req, res, next) {
    const proyecto = req.proyecto;
    const objetivo = proyecto.objetivo;
    const indicador = objetivo.indicadores.id(req.params.indicador_id);
   
    if (!req.params.id) {
        return res.sendStatus(404);
    }
    const fuente_verificacion = indicador.fuente_verificacion.id(req.params.fuente_verificacion_id);
    const doc =  fuente_verificacion.documentos.id(req.params.id);
    const filePath = doc.ruta + '/' + doc.nombre;
    fs.unlinkSync(filePath);
    fuente_verificacion.documentos.remove(req.params.id);

    proyecto.save().then(function () {
        return res.json({message: req.t('% Deleted Correctly', req.t('models.documento'))});
    }).catch(next);
};

