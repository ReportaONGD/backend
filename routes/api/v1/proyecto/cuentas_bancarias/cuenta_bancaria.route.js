const router = require('express').Router();
const controller = require('../../../../../controllers/proyecto/cuentas_bancarias/cuenta_bancaria.controller');

require('../../../../../controllers/base/param_proyecto_id')(router);
require('../../base/base.route')(router,'/:proyecto_id/cuenta_bancaria', controller);

module.exports = router;
