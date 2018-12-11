let mongoose = require('mongoose');
let Gasto = mongoose.model('Gasto');
let Documento = mongoose.model('Documento');
const utils = require('../../../../utils/binding');
var fs = require('fs');

exports.findAll = function (req, res, next) {
    /* const proyecto = req.proyecto;
    const gasto = proyecto.gastos.id(req.params.gasto_id);
    const documentos = gasto.documentos;
    return res.json(documentos); */

    Gasto.findById(req.params.gasto_id).lean().then(function (gasto) {
        const documentos = gasto.documentos;
        if (!documentos) {
            return res.sendStatus(404);
        }

        return res.json(documentos);
    }).catch(next);
};
exports.post_file = function (req, res, next) {
    const ruta = './uploads/' + req.current_user.empresa.nombre + '/' + req.proyecto.nombre + '/gastos';
    if (!req.body) {
        return res.sendStatus(404);
    }
    let documento = new Documento(JSON.parse(req.body.data));
    if (!documento._id) {
        documento._id = mongoose.Types.ObjectId();
    }
    documento.ruta = ruta;
    documento.gasto = req.params.gasto_id;

    documento.save().then(function () {
        return res.json(documento);
    }).catch(next);
};
exports.create = function (req, res, next) {
    const ruta = './uploads/' + req.current_user.empresa.nombre + '/' + req.proyecto.nombre + '/gastos';
    if (!req.body) {
        return res.sendStatus(404);
    }
    let documento = new Documento(JSON.parse(req.body.data));
    if (!documento._id) {
        documento._id = mongoose.Types.ObjectId();
    }
    documento.ruta = ruta;
    documento.gasto = req.params.gasto_id;

    documento.save().then(function () {
        return res.json(documento);
    }).catch(next);
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

exports.get = function (req, res, next) {
    /* let proyecto = req.proyecto;
    let gasto = proyecto.gastos.id(req.params.gasto_id);
    let documento = gasto.documentos.id(req.params.id);

    if (!documento) {
        return res.sendStatus(404);
    }

    return res.json(documento); */
    Documento.findById(req.params.id).lean().then(function (documento) {
        if (!documento) {
            return res.sendStatus(404);
        }

        return res.json(documento);
    }).catch(next);
};

exports.update = function (req, res, next) {
    let proyecto = req.proyecto;
    if (!req.body) {
        return res.sendStatus(404);
    }
    let gasto = proyecto.gastos.id(req.params.gasto_id);
    let documento = gasto.documentos.id(req.params.id);
    utils.bindingObject(req.body, documento);
    return proyecto.save().then(function () {
        return res.json(documento);
    }).catch(next);

};

exports.delete = function (req, res, next) {
    /* let proyecto = req.proyecto;

    if (!req.params.id) {
        return res.sendStatus(404);
    }
    let gasto = proyecto.gastos.id(req.params.gasto_id);
    const doc =  gasto.documentos.id(req.params.id);
    const filePath = doc.ruta + '/' + doc.nombre;
    fs.unlinkSync(filePath);
    gasto.documentos.remove(req.params.id);
    proyecto.save().then(function () {
        return res.json({message: req.t('% Deleted Correctly', req.t('models.documento'))});
    }).catch(next); */
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    return Documento.findByIdAndRemove(req.params.id).then(function (documento) {

        const filePath = documento.ruta + '/' + documento.nombre;
        fs.unlinkSync(filePath);
        return res.json({
            message: req.t('% Deleted Correctly', req.t('models.documento'))
        });
    }).catch(next);
};

