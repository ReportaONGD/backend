let router = require('express').Router();
let multer  = require('multer');
let fs = require('fs');
// let permission = require('../../permission');
var storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      var dir = './uploads/excel_imports/';
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

var upload = multer({ storage: storage }); // DEFINIR LA RUTA DE GUARDADO DE LOS FICHEROS EN ALGUN SITIO.
const controller = require('../../../controllers/import_excel.controller.js');

// require('./base/base.route')(router, '/import_excel', controller, permission.adminOnly(true));
router.post('/import-excel', upload.single('file'), controller.post_file);
module.exports = router;
 