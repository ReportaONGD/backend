var router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/actividad_global/actividad_global_progreso.controller');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/actividad_global/:actividad_global_id/progreso', controller);

module.exports = router;
