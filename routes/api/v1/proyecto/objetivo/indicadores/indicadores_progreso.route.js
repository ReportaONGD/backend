var router = require('express').Router();
const controller = require('../../../../../../controllers/proyecto/objetivo/indicadores/indicadores_progreso.controller');

require('../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../base/base.route')(router,'/:proyecto_id/objetivo/:objetivo_id/indicador/:indicador_id/progreso', controller);

module.exports = router;
