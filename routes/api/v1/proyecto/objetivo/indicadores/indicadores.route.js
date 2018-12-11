var router = require('express').Router();
const controller = require('../../../../../../controllers/proyecto/objetivo/indicadores/indicadores.controller.js');

require('../../../../../../controllers/base/param_proyecto_id')(router);
require('../../../base/base.route')(router,'/:proyecto_id/objetivo/:objetivo_id/indicador', controller);

module.exports = router;
