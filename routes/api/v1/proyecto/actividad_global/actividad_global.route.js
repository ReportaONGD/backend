var router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/actividad_global/actividad_global.controller');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/actividad_global', controller);

module.exports = router;
