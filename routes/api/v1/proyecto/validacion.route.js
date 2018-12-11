var router = require('express').Router();
const controller = require('../../../../controllers/proyecto/validacion.controller');

require('../../../../controllers/base/param_proyecto_id')(router);
require('../base/base.route')(router,'/:proyecto_id/validacion', controller);
router.get('/:proyecto_id/validacion_catalogos', controller.validacion_catalogos);
// router.get('/:proyecto_id/validacion_proyectos', controller.validacion_proyectos);
module.exports = router;
