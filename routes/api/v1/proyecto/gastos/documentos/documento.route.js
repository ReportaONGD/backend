var router = require('express').Router();
var multer  = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      var dirEmpresa = './uploads/' + req.current_user.empresa.nombre + '/';
      if (!fs.existsSync(dirEmpresa)){
          fs.mkdirSync(dirEmpresa);
      }    
      var dirProyecto = './uploads/' + req.current_user.empresa.nombre + '/' + req.proyecto.nombre + '/';
      if (!fs.existsSync(dirProyecto)){
          fs.mkdirSync(dirProyecto);
      }
      var dirGastos = './uploads/' + req.current_user.empresa.nombre + '/' + req.proyecto.nombre + '/gastos';
      if (!fs.existsSync(dirGastos)){
          fs.mkdirSync(dirGastos);
      }
      cb(null, dirGastos);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

var upload = multer({ storage: storage }); // DEFINIR LA RUTA DE GUARDADO DE LOS FICHEROS EN ALGUN SITIO.
const controller = require('../../../../../../controllers/proyecto/gastos/documentos/documentos.controller');

require('../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../base/base.route')(router,'/:proyecto_id/gasto/:gasto_id/documentos', controller);
router.post('/:proyecto_id/gasto/:gasto_id/documentos_files', upload.single('file'), controller.post_file);
router.delete('/:proyecto_id/gasto/:gasto_id/documentos_files/:id', controller.delete);
router.post('/:proyecto_id/gasto/:gasto_id/documentos_files/download', controller.download);
module.exports = router;
