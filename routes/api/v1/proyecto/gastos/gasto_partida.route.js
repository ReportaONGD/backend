var router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/gastos/gasto_partida.controller');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/gasto/:gasto_id/partida', controller);

module.exports = router;
