var router = require('express').Router();
const controller = require('../../../../../../controllers/proyecto/actividad_global/recursos/recursos.controller');

require('../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../base/base.route')(router,'/:proyecto_id/actividad_global/:actividad_global_id/recurso', controller);

module.exports = router;
